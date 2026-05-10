import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateSecret } from '@/lib/oauth/crypto';
import { createClient } from '@/lib/supabase/server';
import { withCSRF } from '@/lib/csrf';
import { handleApiError } from '@/lib/auth-utils';

/** Valid OAuth 2.0 scope values for OasisBio */
const VALID_SCOPES = new Set([
  'profile', 'email',
  'oasisbios:read', 'oasisbios:full',
  'dcos:read',
]);

function validateScopes(scope?: string | null): string[] {
  if (!scope) return [];
  const requested = scope.trim().split(/\s+/).filter(Boolean);
  if (requested.length === 0) return [];
  const invalid = requested.filter(s => !VALID_SCOPES.has(s));
  if (invalid.length > 0) {
    throw new AuthError(`Invalid scopes: ${invalid.join(', ')}`, 400, 'invalid_scope');
  }
  return requested;
}

import { AuthError } from '@/lib/auth-utils';

// POST /api/oauth/authorize — process user's authorization decision
export async function POST(request: NextRequest) {
  try {
    // CSRF protection for state-changing requests (Double Submit Cookie)
    const csrfCheck = withCSRF(request);
    if (csrfCheck) return csrfCheck;

    // Verify user session from server-side — do NOT trust client-provided userId
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'unauthenticated', error_description: 'User must be logged in to authorize applications' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { clientId, redirectUri, scope, state, codeChallenge, codeChallengeMethod, decision } = body;

    // --- Input validation ---
    if (!clientId || typeof clientId !== 'string') {
      return NextResponse.json(
        { error: 'invalid_request', error_description: 'clientId is required' },
        { status: 400 }
      );
    }

    // Validate client exists
    const app = await prisma.oauthApp.findUnique({ where: { clientId } });
    if (!app) {
      return NextResponse.json(
        { error: 'unauthorized_client', error_description: 'Invalid client_id' },
        { status: 401 }
      );
    }

    if (!redirectUri || typeof redirectUri !== 'string') {
      return NextResponse.json(
        { error: 'invalid_request', error_description: 'redirectUri is required' },
        { status: 400 }
      );
    }

    // Validate redirect_uri matches one of the app's registered URIs
    const registeredUris = (app.redirectUris as string[]) ?? [];
    if (!registeredUris.includes(redirectUri)) {
      return NextResponse.json(
        { error: 'invalid_request', error_description: 'redirect_uri does not match registered URI' },
        { status: 400 }
      );
    }

    // Validate scopes
    const validScopes = validateScopes(scope);

    // Validate PKCE challenge method
    let normalizedCodeChallenge: string | undefined;
    if (codeChallenge) {
      if (codeChallengeMethod && codeChallengeMethod !== 'S256') {
        return NextResponse.json(
          { error: 'invalid_request', error_description: 'Only S256 code_challenge_method is supported' },
          { status: 400 }
        );
      }
      normalizedCodeChallenge = codeChallenge;
    }

    const userId = user.id; // Server-side userId — prevents authorization code forgery

    if (decision !== 'allow') {
      const url = new URL(redirectUri);
      url.searchParams.set('error', 'access_denied');
      url.searchParams.set('error_description', 'The user denied access');
      if (state) url.searchParams.set('state', state);
      return NextResponse.json({ redirectUrl: url.toString() });
    }

    // Generate authorization code
    const code = generateSecret(32); // 64-char hex
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await prisma.oauthAuthorizationCode.create({
      data: {
        code,
        clientId,
        userId,
        redirectUri,
        scope: validScopes.length > 0 ? validScopes.join(' ') : null,
        codeChallenge: normalizedCodeChallenge,
        expiresAt,
      },
    });

    const url = new URL(redirectUri);
    url.searchParams.set('code', code);
    if (state) url.searchParams.set('state', state);

    return NextResponse.json({ redirectUrl: url.toString() });
  } catch (error) {
    return handleApiError(error);
  }
}
