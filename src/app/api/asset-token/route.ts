/**
 * POST /api/asset-token
 *
 * Generates signed upload or download tokens/URLs for Supabase Storage and Cloudflare R2.
 * Validates ownership before issuing any token.
 *
 * This is the Next.js API route equivalent of the planned `asset-token` Supabase Edge Function.
 * See docs/edge-functions.md for the migration guide.
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, handleApiError } from '@/lib/auth-utils';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'crypto';

// ─────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────

const RESOURCE_CONFIG = {
  avatar: {
    provider: 'supabase' as const,
    bucket: 'avatars',
    allowedMime: ['image/webp', 'image/png', 'image/jpeg'],
    maxSize: 512 * 1024, // 512 KB
  },
  character_cover: {
    provider: 'supabase' as const,
    bucket: 'character-covers',
    allowedMime: ['image/webp', 'image/png', 'image/jpeg'],
    maxSize: 800 * 1024, // 800 KB
  },
  model_preview: {
    provider: 'supabase' as const,
    bucket: 'model-previews',
    allowedMime: ['image/webp', 'image/png', 'image/jpeg'],
    maxSize: 600 * 1024, // 600 KB
  },
  model: {
    provider: 'r2' as const,
    allowedMime: ['model/gltf-binary', 'application/octet-stream'],
    maxSize: 12 * 1024 * 1024, // 12 MB
  },
} as const;

type ResourceType = keyof typeof RESOURCE_CONFIG;

// ─────────────────────────────────────────────
// Ownership verification
// ─────────────────────────────────────────────

async function verifyOwnership(resourceType: ResourceType, resourceId: string, userId: string): Promise<boolean> {
  if (resourceType === 'avatar') {
    // Avatar resourceId is the userId itself
    return resourceId === userId;
  }

  // For character resources, verify the OasisBio belongs to the user
  const bio = await prisma.oasisBio.findUnique({
    where: { id: resourceId },
    select: { userId: true },
  });
  return bio?.userId === userId;
}

// ─────────────────────────────────────────────
// R2 client (lazy init)
// ─────────────────────────────────────────────

function getR2Client() {
  return new S3Client({
    region: 'auto',
    credentials: {
      accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
    },
    endpoint: process.env.CLOUDFLARE_R2_ENDPOINT!,
  });
}

// ─────────────────────────────────────────────
// Handler
// ─────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const requestId = request.headers.get('x-request-id') ?? crypto.randomUUID();

    const body = await request.json();
    const { action, resourceType, resourceId, filename, contentType, size } = body;

    // Validate required fields
    if (!action || !['upload', 'download'].includes(action)) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'action must be "upload" or "download"' } },
        { status: 400 }
      );
    }
    if (!resourceType || !(resourceType in RESOURCE_CONFIG)) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: `resourceType must be one of: ${Object.keys(RESOURCE_CONFIG).join(', ')}` } },
        { status: 400 }
      );
    }
    if (!resourceId) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'resourceId is required' } },
        { status: 400 }
      );
    }

    const config = RESOURCE_CONFIG[resourceType as ResourceType];

    // Validate upload-specific fields
    if (action === 'upload') {
      if (!contentType || !(config.allowedMime as readonly string[]).includes(contentType)) {
        return NextResponse.json(
          { error: { code: 'VALIDATION_ERROR', message: `contentType must be one of: ${config.allowedMime.join(', ')}` } },
          { status: 400 }
        );
      }
      if (size && size > config.maxSize) {
        return NextResponse.json(
          { error: { code: 'VALIDATION_ERROR', message: `File size exceeds limit of ${(config.maxSize / 1024 / 1024).toFixed(1)} MB` } },
          { status: 400 }
        );
      }
    }

    // Verify ownership
    const isOwner = await verifyOwnership(resourceType as ResourceType, resourceId, user.id);
    if (!isOwner) {
      return NextResponse.json(
        { error: { code: 'FORBIDDEN', message: 'You do not own this resource' } },
        { status: 403 }
      );
    }

    // Generate token based on provider
    if (config.provider === 'supabase') {
      const supabase = await createClient();
      const ext = filename?.split('.').pop() ?? contentType?.split('/')[1] ?? 'webp';
      const path = resourceType === 'avatar'
        ? `${user.id}/avatar.${ext}`
        : `${user.id}/${resourceId}/${resourceType === 'character_cover' ? 'cover' : 'preview'}.${ext}`;

      if (action === 'upload') {
        const { data, error } = await supabase.storage
          .from(config.bucket)
          .createSignedUploadUrl(path);

        if (error) throw error;

        return NextResponse.json({
          provider: 'supabase',
          method: 'signed-upload',
          bucket: config.bucket,
          path,
          token: data.token,
          signedUrl: data.signedUrl,
          expiresIn: 300,
          requestId,
        });
      } else {
        const { data, error } = await supabase.storage
          .from(config.bucket)
          .createSignedUrl(path, 60);

        if (error) throw error;

        return NextResponse.json({
          provider: 'supabase',
          method: 'signed-download',
          url: data.signedUrl,
          expiresIn: 60,
          requestId,
        });
      }
    } else {
      // R2
      const r2 = getR2Client();
      const bucket = process.env.CLOUDFLARE_R2_BUCKET_NAME!;
      const key = `models/${user.id}/${resourceId}/model.glb`;

      if (action === 'upload') {
        const command = new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          ContentType: contentType ?? 'model/gltf-binary',
        });
        const signedUrl = await getSignedUrl(r2, command, { expiresIn: 300 });

        return NextResponse.json({
          provider: 'r2',
          method: 'signed-upload',
          key,
          signedUrl,
          expiresIn: 300,
          requestId,
        });
      } else {
        const command = new GetObjectCommand({ Bucket: bucket, Key: key });
        const signedUrl = await getSignedUrl(r2, command, { expiresIn: 3600 });

        return NextResponse.json({
          provider: 'r2',
          method: 'signed-download',
          url: signedUrl,
          expiresIn: 3600,
          requestId,
        });
      }
    }
  } catch (error) {
    return handleApiError(error);
  }
}
