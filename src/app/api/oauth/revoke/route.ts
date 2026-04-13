import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAccessToken } from '@/lib/oauth/crypto';
import bcrypt from 'bcryptjs';

// POST /api/oauth/revoke — revoke an access_token or refresh_token
export async function POST(request: NextRequest) {
  const contentType = request.headers.get('content-type') ?? '';
  let params: Record<string, string> = {};

  if (contentType.includes('application/x-www-form-urlencoded')) {
    const text = await request.text();
    params = Object.fromEntries(new URLSearchParams(text));
  } else {
    params = await request.json().catch(() => ({}));
  }

  const { token, token_type_hint } = params;

  if (!token) {
    return NextResponse.json(
      { error: 'invalid_request', error_description: 'token is required' },
      { status: 400 }
    );
  }

  // Try to revoke as access_token (JWT) first
  if (!token_type_hint || token_type_hint === 'access_token') {
    const payload = verifyAccessToken(token);
    if (payload) {
      await prisma.oauthToken.updateMany({
        where: { jti: payload.jti, revokedAt: null },
        data: { revokedAt: new Date() },
      });
      return NextResponse.json({}, { status: 200 });
    }
  }

  // Try to revoke as refresh_token
  if (!token_type_hint || token_type_hint === 'refresh_token') {
    const candidates = await prisma.oauthToken.findMany({
      where: { revokedAt: null },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });

    for (const candidate of candidates) {
      const matches = await bcrypt.compare(token, candidate.refreshTokenHash);
      if (matches) {
        await prisma.oauthToken.update({
          where: { id: candidate.id },
          data: { revokedAt: new Date() },
        });
        break;
      }
    }
  }

  // RFC 7009: always return 200 regardless of whether token was found
  return NextResponse.json({}, { status: 200 });
}
