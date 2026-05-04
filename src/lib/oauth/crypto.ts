import 'server-only';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { oauthConfig } from '@/lib/config';

const JWT_SECRET = oauthConfig.jwtSecret;

export function getJwtIssuer(): string {
  const host = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL;
  if (host) {
    return host.startsWith('http') ? host : `https://${host}`;
  }
  return 'https://oasisbio.com';
}

// ─────────────────────────────────────────────
// Random secret generation
// ─────────────────────────────────────────────

/**
 * Generates a cryptographically random hex string.
 * Default: 32 bytes = 64 hex chars (suitable for client_secret, refresh_token)
 */
export function generateSecret(bytes = 32): string {
  return crypto.randomBytes(bytes).toString('hex');
}

/**
 * Generates a UUID v4 (suitable for client_id, jti)
 */
export function generateUUID(): string {
  return crypto.randomUUID();
}

// ─────────────────────────────────────────────
// Refresh token hashing
// ─────────────────────────────────────────────

/**
 * Hash a refresh token for storage using SHA-256.
 * Refresh tokens are high-entropy random values (64 hex chars),
 * so SHA-256 is sufficient — bcrypt is unnecessary and slow here.
 * This allows O(1) database lookup by hash.
 */
export function hashRefreshToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

// ─────────────────────────────────────────────
// Client secret hashing
// ─────────────────────────────────────────────

/** Hash a client_secret for storage. Never store plaintext. */
export async function hashClientSecret(secret: string): Promise<string> {
  return bcrypt.hash(secret, 12);
}

/** Verify a client_secret against its stored hash. */
export async function verifyClientSecret(secret: string, hash: string): Promise<boolean> {
  return bcrypt.compare(secret, hash);
}

// ─────────────────────────────────────────────
// PKCE (RFC 7636)
// ─────────────────────────────────────────────

/**
 * Verifies a PKCE code_verifier against a stored code_challenge.
 * Uses S256 method: challenge = BASE64URL(SHA256(verifier))
 *
 * Feature: oauth-provider, Property 3: PKCE verification correctness
 */
export function verifyPKCE(codeVerifier: string, codeChallenge: string): boolean {
  if (!codeVerifier || !codeChallenge) return false;
  const computed = crypto
    .createHash('sha256')
    .update(codeVerifier)
    .digest('base64url');
  // Constant-time comparison to prevent timing attacks
  try {
    return crypto.timingSafeEqual(
      Buffer.from(computed, 'base64url'),
      Buffer.from(codeChallenge, 'base64url')
    );
  } catch {
    return false;
  }
}

/**
 * Generates a PKCE code_challenge from a code_verifier (for testing).
 */
export function generateCodeChallenge(codeVerifier: string): string {
  return crypto.createHash('sha256').update(codeVerifier).digest('base64url');
}

// ─────────────────────────────────────────────
// JWT Access Tokens
// ─────────────────────────────────────────────

export interface AccessTokenPayload {
  sub: string;        // user_id
  client_id: string;
  scope: string;      // space-separated
  jti: string;        // JWT ID (for revocation lookup)
  iat: number;
  exp: number;
  iss: string;
}

/**
 * Signs a new access token JWT.
 * Expires in 1 hour.
 *
 * Feature: oauth-provider, Property 4: Access token contains correct claims
 */
export function signAccessToken(payload: {
  sub: string;
  clientId: string;
  scope: string;
  jti: string;
}): string {
  const issuer = getJwtIssuer();
  return jwt.sign(
    {
      sub: payload.sub,
      client_id: payload.clientId,
      scope: payload.scope,
      jti: payload.jti,
      iss: issuer,
    },
    JWT_SECRET,
    { expiresIn: '1h', algorithm: 'HS256' }
  );
}

/**
 * Verifies and decodes an access token JWT.
 * Returns null if invalid or expired.
 */
export function verifyAccessToken(token: string): AccessTokenPayload | null {
  try {
    const issuer = getJwtIssuer();
    const payload = jwt.verify(token, JWT_SECRET, {
      issuer: issuer,
      algorithms: ['HS256'],
    }) as AccessTokenPayload;
    return payload;
  } catch {
    return null;
  }
}
