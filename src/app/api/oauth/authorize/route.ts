import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateSecret } from '@/lib/oauth/crypto';
import { createClient } from '@/lib/supabase/server';
import { withCSRF } from '@/lib/csrf';

// POST /api/oauth/authorize — process user's authorization decision
export async function POST(request: NextRequest) {
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
  const userId = user.id; // Server-side userId — prevents authorization code forgery

  if (decision !== 'allow') {
    const url = new URL(redirectUri);
    url.searchParams.set('error', 'access_denied');
    url.searchParams.set('error_description', 'The user denied access');
    url.searchParams.set('state', state);
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
      scope,
      codeChallenge,
      expiresAt,
    },
  });

  const url = new URL(redirectUri);
  url.searchParams.set('code', code);
  url.searchParams.set('state', state);

  return NextResponse.json({ redirectUrl: url.toString() });
}
