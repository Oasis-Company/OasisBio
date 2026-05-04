import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  verifyClientSecret,
  verifyPKCE,
  signAccessToken,
  generateSecret,
  generateUUID,
  hashRefreshToken,
} from '@/lib/oauth/crypto';
import { validateTokenParams } from '@/lib/oauth/validate';
import { withRateLimit, getClientIP } from '@/lib/rate-limit';

function oauthError(error: string, description: string, status = 400) {
  return NextResponse.json(
    { error, error_description: description },
    { status, headers: { 'Cache-Control': 'no-store' } }
  );
}

// POST /api/oauth/token
export async function POST(request: NextRequest) {
  // Rate limit: 30 requests per minute per IP (prevents client_secret brute force)
  const rateLimitResponse = withRateLimit(request, 60_000, 30, getClientIP(request));
  if (rateLimitResponse) return rateLimitResponse;

  // Parse body — supports both JSON and application/x-www-form-urlencoded
  let params: Record<string, string> = {};
  const contentType = request.headers.get('content-type') ?? '';

  if (contentType.includes('application/x-www-form-urlencoded')) {
    const text = await request.text();
    params = Object.fromEntries(new URLSearchParams(text));
  } else {
    params = await request.json().catch(() => ({}));
  }

  const validation = validateTokenParams(params);
  if (!validation.valid) {
    return oauthError(validation.error!, validation.errorDescription!);
  }

  // Verify client credentials
  const app = await prisma.oauthApp.findUnique({
    where: { clientId: params.client_id, isActive: true },
    select: { clientId: true, clientSecretHash: true, redirectUris: true },
  });

  if (!app) return oauthError('invalid_client', 'Unknown client_id');

  const secretValid = await verifyClientSecret(params.client_secret, app.clientSecretHash);
  if (!secretValid) return oauthError('invalid_client', 'Invalid client_secret');

  // ─── authorization_code grant ───────────────────────────────────────────
  if (params.grant_type === 'authorization_code') {
    const authCode = await prisma.oauthAuthorizationCode.findUnique({
      where: { code: params.code },
    });

    if (!authCode) return oauthError('invalid_grant', 'Authorization code not found');
    if (authCode.usedAt) return oauthError('invalid_grant', 'Authorization code already used');
    if (authCode.expiresAt < new Date()) return oauthError('invalid_grant', 'Authorization code expired');
    if (authCode.clientId !== params.client_id) return oauthError('invalid_grant', 'client_id mismatch');
    if (authCode.redirectUri !== params.redirect_uri) return oauthError('invalid_grant', 'redirect_uri mismatch');

    // Verify PKCE
    if (!verifyPKCE(params.code_verifier, authCode.codeChallenge)) {
      return oauthError('invalid_grant', 'PKCE verification failed');
    }

    // Mark code as used (single-use)
    await prisma.oauthAuthorizationCode.update({
      where: { code: params.code },
      data: { usedAt: new Date() },
    });

    return issueTokens(authCode.clientId, authCode.userId, authCode.scope);
  }

  // ─── refresh_token grant ─────────────────────────────────────────────────
  if (params.grant_type === 'refresh_token') {
    // O(1) lookup: hash the provided token and query directly by hash
    const tokenHash = hashRefreshToken(params.refresh_token);
    const matchedToken = await prisma.oauthToken.findUnique({
      where: { refreshTokenHash: tokenHash },
    });

    if (!matchedToken) return oauthError('invalid_grant', 'Invalid or expired refresh_token');
    if (matchedToken.revokedAt) return oauthError('invalid_grant', 'Refresh token has been revoked');
    if (matchedToken.expiresAt < new Date()) return oauthError('invalid_grant', 'Refresh token has expired');
    if (matchedToken.clientId !== params.client_id) return oauthError('invalid_grant', 'client_id mismatch');

    // Revoke old refresh token (rotation)
    await prisma.oauthToken.update({
      where: { id: matchedToken.id },
      data: { revokedAt: new Date() },
    });

    return issueTokens(matchedToken.clientId, matchedToken.userId, matchedToken.scope);
  }

  return oauthError('unsupported_grant_type', `grant_type "${params.grant_type}" is not supported`);
}

async function issueTokens(clientId: string, userId: string, scope: string) {
  const jti = generateUUID();
  const refreshToken = generateSecret(32);
  const refreshTokenHash = hashRefreshToken(refreshToken);
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

  await prisma.oauthToken.create({
    data: { clientId, userId, scope, jti, refreshTokenHash, expiresAt },
  });

  const accessToken = signAccessToken({ sub: userId, clientId, scope, jti });

  return NextResponse.json(
    {
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: 3600,
      refresh_token: refreshToken,
      scope,
    },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}
