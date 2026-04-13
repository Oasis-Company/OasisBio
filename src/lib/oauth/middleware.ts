import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from './crypto';
import { hasScope, type ScopeName } from './scopes';
import { prisma } from '@/lib/prisma';

export interface OAuthContext {
  userId: string;
  clientId: string;
  scope: string;
  jti: string;
}

/**
 * Extracts and validates a Bearer token from the Authorization header.
 * Checks that the token is not revoked and has the required scope.
 *
 * Feature: oauth-provider, Property 5: Scope enforcement
 */
export async function requireOAuthToken(
  request: NextRequest,
  requiredScope: ScopeName
): Promise<{ context: OAuthContext } | { error: NextResponse }> {
  const authHeader = request.headers.get('authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    return {
      error: NextResponse.json(
        { error: 'invalid_token', error_description: 'Bearer token required' },
        { status: 401, headers: { 'WWW-Authenticate': 'Bearer realm="oasisbio"' } }
      ),
    };
  }

  const token = authHeader.slice(7);
  const payload = verifyAccessToken(token);

  if (!payload) {
    return {
      error: NextResponse.json(
        { error: 'invalid_token', error_description: 'Token is invalid or expired' },
        { status: 401, headers: { 'WWW-Authenticate': 'Bearer error="invalid_token"' } }
      ),
    };
  }

  // Check if token has been revoked
  const tokenRecord = await prisma.oauthToken.findUnique({
    where: { jti: payload.jti },
    select: { revokedAt: true },
  });

  if (!tokenRecord || tokenRecord.revokedAt) {
    return {
      error: NextResponse.json(
        { error: 'invalid_token', error_description: 'Token has been revoked' },
        { status: 401, headers: { 'WWW-Authenticate': 'Bearer error="invalid_token"' } }
      ),
    };
  }

  // Check scope
  if (!hasScope(payload.scope, requiredScope)) {
    return {
      error: NextResponse.json(
        {
          error: 'insufficient_scope',
          error_description: `This endpoint requires the "${requiredScope}" scope`,
        },
        { status: 403 }
      ),
    };
  }

  return {
    context: {
      userId: payload.sub,
      clientId: payload.client_id,
      scope: payload.scope,
      jti: payload.jti,
    },
  };
}
