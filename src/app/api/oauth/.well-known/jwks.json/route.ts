import { NextResponse } from 'next/server';
import { oauthConfig } from '@/lib/oauth/config';
import crypto from 'crypto';

// GET /api/oauth/.well-known/jwks.json — JWKS key set for OIDC discovery
// Since OasisBio uses HS256 (symmetric HMAC), we expose the public key material
// as a symmetric key (kty=oct). In production, consider migrating to RS256/ES256
// for true asymmetric verification by third parties.
export async function GET() {
  const secret = oauthConfig.jwtSecret;

  // Compute the JWK thumbprint components for HS256
  const secretBytes = Buffer.from(secret, 'utf-8');
  // Use first 32 bytes (256 bits) as key material
  const keyMaterial = secretBytes.length >= 32 ? secretBytes.subarray(0, 32) : Buffer.alloc(32).fill(secretBytes);

  return NextResponse.json({
    keys: [
      {
        kty: 'oct',
        alg: 'HS256',
        kid: 'hs256-1', // Key ID — update if rotating keys
        use: 'sig',
        k: keyMaterial.toString('base64url'),
      },
    ],
  });
}
