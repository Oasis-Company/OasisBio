import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateSecret } from '@/lib/oauth/crypto';
import crypto from 'crypto';

// POST /api/oauth/authorize — process user's authorization decision
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { clientId, redirectUri, scope, state, codeChallenge, codeChallengeMethod, decision, userId } = body;

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
