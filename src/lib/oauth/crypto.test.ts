import * as fc from 'fast-check';
import {
  generateSecret,
  generateUUID,
  hashClientSecret,
  verifyClientSecret,
  verifyPKCE,
  generateCodeChallenge,
  signAccessToken,
  verifyAccessToken,
} from './crypto';

// Mock required environment variable for tests
process.env.OAUTH_JWT_SECRET = 'test-jwt-secret-for-unit-tests-only';

// ---------------------------------------------------------------------------
// Property 3: PKCE verification correctness
// Feature: oauth-provider, Property 3
// Validates: Requirements 5.1, 5.3, 5.4
// ---------------------------------------------------------------------------

describe('PKCE verification — Property 3: PKCE verification correctness', () => {
  const arbCodeVerifier = fc.string({ minLength: 43, maxLength: 128 });

  it('valid code_verifier matches its generated code_challenge', () => {
    fc.assert(
      fc.property(arbCodeVerifier, (verifier) => {
        const challenge = generateCodeChallenge(verifier);
        return verifyPKCE(verifier, challenge);
      }),
      { numRuns: 200 }
    );
  });

  it('invalid code_verifier does not match the challenge', () => {
    fc.assert(
      fc.property(arbCodeVerifier, (verifier) => {
        const challenge = generateCodeChallenge(verifier);
        const differentVerifier = verifier.split('').reverse().join('');
        return !verifyPKCE(differentVerifier, challenge);
      }),
      { numRuns: 200 }
    );
  });

  it('empty verifier or challenge returns false', () => {
    fc.assert(
      fc.property(arbCodeVerifier, (verifier) => {
        const challenge = generateCodeChallenge(verifier);
        return !verifyPKCE('', challenge) && !verifyPKCE(verifier, '') && !verifyPKCE('', '');
      }),
      { numRuns: 100 }
    );
  });
});

// ---------------------------------------------------------------------------
// Property 4: Access token contains correct claims
// Feature: oauth-provider, Property 4
// Validates: Requirements 5.1, 5.3, 5.4
// ---------------------------------------------------------------------------

describe('Access token — Property 4: Access token contains correct claims', () => {
  const arbUserId = fc.uuid();
  const arbClientId = fc.uuid();
  const arbScope = fc.oneof(
    fc.constant('profile'),
    fc.constant('email'),
    fc.constant('oasisbios:read'),
    fc.constant('oasisbios:full'),
    fc.constant('dcos:read'),
    fc.constant('profile email'),
    fc.constant('profile oasisbios:read')
  );
  const arbJti = fc.uuid();

  it('access token contains all required claims', () => {
    fc.assert(
      fc.property(arbUserId, arbClientId, arbScope, arbJti, (sub, clientId, scope, jti) => {
        const token = signAccessToken({ sub, clientId, scope, jti });
        const payload = verifyAccessToken(token);
        
        return (
          payload !== null &&
          payload.sub === sub &&
          payload.client_id === clientId &&
          payload.scope === scope &&
          payload.jti === jti &&
          payload.iss !== undefined &&
          payload.iat !== undefined &&
          payload.exp !== undefined
        );
      }),
      { numRuns: 200 }
    );
  });

  it('access token expires after specified time', () => {
    fc.assert(
      fc.property(arbUserId, arbClientId, arbScope, arbJti, (sub, clientId, scope, jti) => {
        const token = signAccessToken({ sub, clientId, scope, jti });
        const payload = verifyAccessToken(token);
        
        if (!payload) return false;
        
        const now = Math.floor(Date.now() / 1000);
        const validForOneHour = payload.exp > now && payload.exp <= now + 3600;
        
        return validForOneHour && payload.iat <= now;
      }),
      { numRuns: 100 }
    );
  });

  it('invalid token signature returns null', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 10 }), (invalidToken) => {
        const payload = verifyAccessToken(invalidToken);
        return payload === null;
      }),
      { numRuns: 100 }
    );
  });
});

// ---------------------------------------------------------------------------
// Property 1: Client credential generation uniqueness (partially tested here)
// Feature: oauth-provider, Property 1
// Validates: Requirements 1.2, 1.4
// ---------------------------------------------------------------------------

describe('Client credentials — Property 1: Client credential generation uniqueness', () => {
  it('generateSecret produces unique values across calls', () => {
    fc.assert(
      fc.property(fc.nat(), () => {
        const secrets = Array.from({ length: 100 }, () => generateSecret());
        const uniqueSecrets = new Set(secrets);
        return secrets.length === uniqueSecrets.size;
      }),
      { numRuns: 10 }
    );
  });

  it('generateUUID produces unique values across calls', () => {
    fc.assert(
      fc.property(fc.nat(), () => {
        const uuids = Array.from({ length: 100 }, () => generateUUID());
        const uniqueUuids = new Set(uuids);
        return uuids.length === uniqueUuids.size;
      }),
      { numRuns: 10 }
    );
  });
});

// ---------------------------------------------------------------------------
// Client secret hashing tests
// ---------------------------------------------------------------------------

describe('Client secret hashing', () => {
  const arbSecret = fc.string({ minLength: 32, maxLength: 128 });

  it('hashClientSecret + verifyClientSecret round-trip', async () => {
    await fc.assert(
      fc.asyncProperty(arbSecret, async (secret) => {
        const hash = await hashClientSecret(secret);
        return await verifyClientSecret(secret, hash);
      }),
      { numRuns: 3, timeout: 90000 }
    );
  }, 120000);

  it('wrong secret does not match hash', async () => {
    await fc.assert(
      fc.asyncProperty(arbSecret, async (secret) => {
        const hash = await hashClientSecret(secret);
        const wrongSecret = secret + 'invalid';
        return !(await verifyClientSecret(wrongSecret, hash));
      }),
      { numRuns: 3, timeout: 90000 }
    );
  }, 120000);
});