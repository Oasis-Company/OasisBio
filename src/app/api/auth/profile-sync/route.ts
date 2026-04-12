/**
 * POST /api/auth/profile-sync
 *
 * Syncs the authenticated user's profile. Creates User + Profile records
 * in Prisma if they don't exist. Only fills empty fields — never overwrites
 * user-edited displayName, bio, or website.
 *
 * This is the Next.js API route equivalent of the planned `auth-profile-sync`
 * Supabase Edge Function. See docs/edge-functions.md for the migration guide.
 *
 * Typical usage: call once after first login to ensure Prisma records exist.
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, handleApiError } from '@/lib/auth-utils';
import { syncUserToPrisma } from '@/lib/user-sync';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const requestId = request.headers.get('x-request-id') ?? crypto.randomUUID();

    const body = await request.json().catch(() => ({}));
    const { displayName, avatarUrl, locale } = body;

    // Build an updated user_metadata to pass to syncUserToPrisma
    const enrichedUser = {
      ...user,
      user_metadata: {
        ...user.user_metadata,
        ...(displayName ? { display_name: displayName } : {}),
        ...(avatarUrl ? { avatar_url: avatarUrl } : {}),
        ...(locale ? { locale } : {}),
      },
    };

    const result = await syncUserToPrisma(enrichedUser);

    // Update locale on profile if provided and different
    if (locale) {
      await prisma.profile.update({
        where: { id: result.profileId },
        data: { locale },
      }).catch(() => {
        // Non-fatal — profile may not exist yet if sync just created it
      });
    }

    return NextResponse.json({
      userId: result.userId,
      profileId: result.profileId,
      username: result.username,
      isNewUser: result.isNewUser,
      requestId,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
