import { NextRequest, NextResponse } from 'next/server';
import { requireOAuthToken } from '@/lib/oauth/middleware';
import { hasScope } from '@/lib/oauth/scopes';
import { prisma } from '@/lib/prisma';
import { handleApiError } from '@/lib/auth-utils';

// GET /api/oauth/userinfo — returns profile data based on granted scopes
export async function GET(request: NextRequest) {
  try {
    const result = await requireOAuthToken(request, 'profile');
    if ('error' in result) return result.error;

    const { userId, scope } = result.context;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });

    const profile = await prisma.profile.findFirst({
      where: { userId },
      select: { username: true, displayName: true, avatarUrl: true },
    });

    const response: Record<string, unknown> = {
      sub: userId,
    };

    // profile scope
    if (profile) {
      response.username = profile.username;
      response.display_name = profile.displayName;
      response.avatar_url = profile.avatarUrl ?? null;
    }

    // email scope
    if (hasScope(scope, 'email') && user) {
      response.email = user.email;
    }

    return NextResponse.json(response);
  } catch (error) {
    return handleApiError(error);
  }
}
