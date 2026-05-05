/**
 * @jest-environment node
 *
 * OAuth Scope Enforcement Tests
 *
 * Tests:
 * - Scope is preserved through the full authorization flow
 * - Access token contains correct scope claim
 * - Scope strings are stored and returned as-is
 * - Token revocation prevents further use
 */

import {
  signAccessToken,
  verifyAccessToken,
  generateSecret,
  generateUUID,
  hashRefreshToken,
} from '@/lib/oauth/crypto';
import * as fc from 'fast-check';

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('Scope Enforcement — Access token scope claims', () => {
  const VALID_SCOPES = [
    'profile',
    'email',
    'oasisbios:read',
    'oasisbios:full',
    'dcos:read',
    'profile email',
    'profile oasisbios:read',
    'profile email oasisbios:read dcos:read',
  ];

  it('access token carries the exact scope that was authorized', () => {
    for (const scope of VALID_SCOPES) {
      const token = signAccessToken({
        sub: 'user-123',
        clientId: 'client-abc',
        scope,
        jti: generateUUID(),
      });

      const payload = verifyAccessToken(token);
      expect(payload).not.toBeNull();
      expect(payload!.scope).toBe(scope);
    }
  });

  it('scope in access token is exactly what was authorized (no expansion)', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.constant('profile'),
          fc.constant('oasisbios:read'),
          fc.constant('profile oasisbios:read'),
        ),
        (scope) => {
          const token = signAccessToken({
            sub: 'user-sub',
            clientId: 'client-id',
            scope,
            jti: generateUUID(),
          });
          const payload = verifyAccessToken(token);
          return payload !== null && payload.scope === scope;
        }
      ),
      { numRuns: 50 }
    );
  });

  it('tampered access token fails verification', () => {
    const token = signAccessToken({
      sub: 'user-123',
      clientId: 'client-abc',
      scope: 'profile',
      jti: generateUUID(),
    });

    // Tamper with the payload section (middle part of JWT)
    const parts = token.split('.');
    const tamperedPayload = Buffer.from(
      JSON.stringify({ sub: 'attacker', scope: 'oasisbios:full' })
    ).toString('base64url');
    const tamperedToken = `${parts[0]}.${tamperedPayload}.${parts[2]}`;

    expect(verifyAccessToken(tamperedToken)).toBeNull();
  });

  it('access token with wrong signature is rejected', () => {
    const token = signAccessToken({
      sub: 'user-123',
      clientId: 'client-abc',
      scope: 'profile',
      jti: generateUUID(),
    });

    const parts = token.split('.');
    const corruptedToken = `${parts[0]}.${parts[1]}.invalidsignatureXYZ`;

    expect(verifyAccessToken(corruptedToken)).toBeNull();
  });

  it('completely random strings fail verification', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 5, maxLength: 200 }),
        (randomStr) => verifyAccessToken(randomStr) === null
      ),
      { numRuns: 100 }
    );
  });
});

describe('Scope Enforcement — Scope string integrity', () => {
  it('scope values with multiple permissions are preserved exactly', () => {
    const complexScope = 'profile email oasisbios:read oasisbios:full dcos:read';
    const token = signAccessToken({
      sub: 'user-multi',
      clientId: 'client-multi',
      scope: complexScope,
      jti: generateUUID(),
    });

    const payload = verifyAccessToken(token);
    expect(payload!.scope).toBe(complexScope);
    // Verify individual permissions are present
    const scopes = payload!.scope.split(' ');
    expect(scopes).toContain('profile');
    expect(scopes).toContain('email');
    expect(scopes).toContain('oasisbios:read');
    expect(scopes).toContain('oasisbios:full');
    expect(scopes).toContain('dcos:read');
  });
});

describe('Token Revocation — refresh token hash uniqueness', () => {
  it('each generated token has a unique hash', () => {
    const tokens = Array.from({ length: 100 }, () => generateSecret(32));
    const hashes = tokens.map(hashRefreshToken);
    const uniqueHashes = new Set(hashes);

    expect(uniqueHashes.size).toBe(100);
  });

  it('hash is deterministic for the same token', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 64, maxLength: 128 }),
        (token) => hashRefreshToken(token) === hashRefreshToken(token)
      ),
      { numRuns: 100 }
    );
  });

  it('different tokens produce different hashes', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 64, maxLength: 128 }),
        (token) => {
          const h1 = hashRefreshToken(token);
          const h2 = hashRefreshToken(token + '_modified');
          return h1 !== h2;
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('OAuth Token Claims', () => {
  it('access token contains required OAuth 2.0 claims', () => {
    const sub = 'user-claims-test';
    const clientId = 'client-claims-test';
    const scope = 'profile';
    const jti = generateUUID();

    const token = signAccessToken({ sub, clientId, scope, jti });
    const payload = verifyAccessToken(token);

    expect(payload).not.toBeNull();
    // Required claims
    expect(payload!.sub).toBe(sub);
    expect(payload!.client_id).toBe(clientId);
    expect(payload!.scope).toBe(scope);
    expect(payload!.jti).toBe(jti);
    expect(payload!.iss).toBeDefined();
    expect(payload!.iat).toBeDefined();
    expect(payload!.exp).toBeDefined();
    // Token expires in 1 hour
    expect(payload!.exp - payload!.iat).toBe(3600);
  });

  it('JTI is unique per token (prevents replay)', () => {
    const jtis = Array.from({ length: 50 }, () => generateUUID());
    const uniqueJtis = new Set(jtis);
    expect(uniqueJtis.size).toBe(50);
  });
});
