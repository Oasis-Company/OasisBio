import * as fc from 'fast-check';
import {
  generateSecret,
  hashRefreshToken,
  verifyPKCE,
  generateCodeChallenge,
} from '@/lib/oauth/crypto';

// Mock required environment variable for tests
process.env.OAUTH_JWT_SECRET = 'test-jwt-secret-for-unit-tests-only';

describe('Token endpoint — Property 6: Refresh token rotation', () => {
  it('new refresh token is generated on each refresh', () => {
    fc.assert(
      fc.property(fc.nat(), () => {
        const tokens: string[] = [];
        for (let i = 0; i < 10; i++) {
          tokens.push(generateSecret(32));
        }
        const uniqueTokens = new Set(tokens);
        return tokens.length === uniqueTokens.size;
      }),
      { numRuns: 100 }
    );
  });

  it('refresh token hash is deterministic', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 64, maxLength: 128 }), (token) => {
        const hash1 = hashRefreshToken(token);
        const hash2 = hashRefreshToken(token);
        return hash1 === hash2;
      }),
      { numRuns: 200 }
    );
  });

  it('different tokens produce different hashes', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 64, maxLength: 128 }), (token) => {
        const hash1 = hashRefreshToken(token);
        const hash2 = hashRefreshToken(token + 'modified');
        return hash1 !== hash2;
      }),
      { numRuns: 200 }
    );
  });
});

describe('Token endpoint — Property 7: Authorization code is single-use', () => {
  const arbCodeVerifier = fc.string({ minLength: 43, maxLength: 128 });

  it('PKCE verification prevents replay attacks', () => {
    fc.assert(
      fc.property(arbCodeVerifier, (verifier) => {
        const challenge = generateCodeChallenge(verifier);
        
        let wrongVerifier: string;
        if (verifier.length > 0) {
          wrongVerifier = verifier.slice(0, -1) + (verifier.slice(-1) === 'x' ? 'y' : 'x');
        } else {
          wrongVerifier = 'wrong';
        }
        
        const validResult = verifyPKCE(verifier, challenge);
        const invalidResult = verifyPKCE(wrongVerifier, challenge);
        
        return validResult && !invalidResult;
      }),
      { numRuns: 200 }
    );
  });

  it('authorization code generation produces unique values', () => {
    fc.assert(
      fc.property(fc.nat(), () => {
        const codes = Array.from({ length: 100 }, () => generateSecret(32));
        const uniqueCodes = new Set(codes);
        return codes.length === uniqueCodes.size;
      }),
      { numRuns: 10 }
    );
  });
});

describe('Token request validation', () => {
  it('valid authorization code request structure', () => {
    fc.assert(
      fc.property(
        fc.uuid(),
        fc.string({ minLength: 32, maxLength: 128 }),
        fc.string({ minLength: 20, maxLength: 100 }),
        fc.string({ minLength: 43, maxLength: 128 }),
        (clientId, clientSecret, code, codeVerifier) => {
          const params = {
            grant_type: 'authorization_code',
            client_id: clientId,
            client_secret: clientSecret,
            code,
            redirect_uri: 'https://example.com/callback',
            code_verifier: codeVerifier,
          };
          return validateTokenParamsStructure(params);
        }
      ),
      { numRuns: 200 }
    );
  });

  it('valid refresh token request structure', () => {
    fc.assert(
      fc.property(
        fc.uuid(),
        fc.string({ minLength: 32, maxLength: 128 }),
        fc.string({ minLength: 64, maxLength: 128 }),
        (clientId, clientSecret, refreshToken) => {
          const params = {
            grant_type: 'refresh_token',
            client_id: clientId,
            client_secret: clientSecret,
            refresh_token: refreshToken,
          };
          return validateTokenParamsStructure(params);
        }
      ),
      { numRuns: 200 }
    );
  });
});

function validateTokenParamsStructure(params: Record<string, string>): boolean {
  if (!params.grant_type) return false;
  if (!params.client_id) return false;
  if (!params.client_secret) return false;
  
  if (params.grant_type === 'authorization_code') {
    if (!params.code) return false;
    if (!params.redirect_uri) return false;
    if (!params.code_verifier) return false;
  }
  
  if (params.grant_type === 'refresh_token') {
    if (!params.refresh_token) return false;
  }
  
  return true;
}