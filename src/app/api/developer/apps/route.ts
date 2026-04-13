import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, handleApiError } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import { generateSecret, generateUUID, hashClientSecret } from '@/lib/oauth/crypto';
import { validateRedirectUri } from '@/lib/oauth/validate';

const MAX_APPS_PER_USER = 10;

// GET /api/developer/apps — list current user's OAuth apps
export async function GET() {
  try {
    const user = await requireAuth();

    const apps = await prisma.oauthApp.findMany({
      where: { ownerUserId: user.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        description: true,
        homepageUrl: true,
        logoUrl: true,
        redirectUris: true,
        clientId: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        // Never return client_secret_hash
      },
    });

    return NextResponse.json(apps);
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/developer/apps — create a new OAuth app
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();

    const { name, description, homepageUrl, redirectUris, logoUrl } = body;

    // Validate required fields
    if (!name?.trim()) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'name is required' } },
        { status: 400 }
      );
    }
    if (!homepageUrl?.trim()) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'homepageUrl is required' } },
        { status: 400 }
      );
    }
    if (!Array.isArray(redirectUris) || redirectUris.length === 0) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'At least one redirectUri is required' } },
        { status: 400 }
      );
    }

    // Validate all redirect URIs
    const invalidUris = redirectUris.filter((uri: string) => !validateRedirectUri(uri));
    if (invalidUris.length > 0) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: `Invalid redirect URIs: ${invalidUris.join(', ')}` } },
        { status: 400 }
      );
    }

    // Enforce per-user app limit
    const existingCount = await prisma.oauthApp.count({
      where: { ownerUserId: user.id },
    });
    if (existingCount >= MAX_APPS_PER_USER) {
      return NextResponse.json(
        { error: { code: 'LIMIT_EXCEEDED', message: `Maximum ${MAX_APPS_PER_USER} apps per account` } },
        { status: 400 }
      );
    }

    // Generate credentials
    const clientId = generateUUID();
    const clientSecret = generateSecret(32); // 64-char hex
    const clientSecretHash = await hashClientSecret(clientSecret);

    const app = await prisma.oauthApp.create({
      data: {
        ownerUserId: user.id,
        name: name.trim(),
        description: description?.trim() ?? null,
        homepageUrl: homepageUrl.trim(),
        logoUrl: logoUrl?.trim() ?? null,
        redirectUris,
        clientId,
        clientSecretHash,
      },
      select: {
        id: true,
        name: true,
        description: true,
        homepageUrl: true,
        logoUrl: true,
        redirectUris: true,
        clientId: true,
        isActive: true,
        createdAt: true,
      },
    });

    // Return client_secret ONCE — never stored in plaintext
    return NextResponse.json(
      { ...app, clientSecret },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
