import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, handleApiError } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import { generateSecret } from '@/lib/oauth/crypto';
import { validateScopes } from '@/lib/oauth/scopes';

// POST /api/oauth/authorize — process user's authorization decision
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();

    const { clientId, redirectUri, scope, state, codeChallenge, codeChallengeMethod, decision } = body;

    // Verify the app exists and redirect_uri is registered
    const app = await prisma.oauthApp.findUnique({
      where: { clientId, isActive: true },
      select: { clientId: true, redirectUris: true },
    });

    if (!app || !app.redirectUris.includes(redirectUri)) {
      return NextResponse.json(
        { error: { code: 'INVALID_CLIENT', message: 'Invalid client or redirect_uri' } },
        { status: 400 }
      );
    }

    // Build redirect URL
    const redirectUrl = new URL(redirectUri);
    redirectUrl.searchParams.set('state', state);

    if (decision !== 'allow') {
      redirectUrl.searchParams.set('error', 'access_denied');
      redirectUrl.searchParams.set('error_description', 'The user denied access');
      return NextResponse.json({ redirectUrl: redirectUrl.toString() });
    }

    // Validate scopes
    const invalidScopes = validateScopes(scope);
    if (invalidScopes.length > 0) {
      redirectUrl.searchParams.set('error', 'invalid_scope');
      redirectUrl.searchParams.set('error_description', `Unknown scopes: ${invalidScopes.join(', ')}`);
      return NextResponse.json({ redirectUrl: redirectUrl.toString() });
    }

    // Generate authorization code (32-byte hex, expires in 10 minutes)
    const code = generateSecret(32);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.oauthAuthorizationCode.create({
      data: {
        code,
        clientId,
        userId: user.id,
        redirectUri,
        scope,
        codeChallenge,
        expiresAt,
      },
    });

    redirectUrl.searchParams.set('code', code);
    return NextResponse.json({ redirectUrl: redirectUrl.toString() });
  } catch (error) {
    return handleApiError(error);
  }
}
