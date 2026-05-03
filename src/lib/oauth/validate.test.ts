import * as fc from 'fast-check';
import { validateRedirectUri, validateAuthorizationParams, validateTokenParams } from './validate';

describe('Redirect URI validation — Property 2: Redirect URI validation', () => {
  const arbDomain = fc.domain();
  const arbPort = fc.integer({ min: 1, max: 65535 });
  const arbPath = fc.string({ minLength: 0, maxLength: 100 }).map((p) => {
    const clean = p.replace(/#/g, '');
    return clean ? `/${clean}` : '';
  });

  it('HTTPS URLs are always valid', () => {
    fc.assert(
      fc.property(arbDomain, arbPath, (domain, path) => {
        const uri = `https://${domain}${path}`;
        return validateRedirectUri(uri);
      }),
      { numRuns: 200 }
    );
  });

  it('HTTP localhost URLs are valid', () => {
    fc.assert(
      fc.property(arbPort, arbPath, (port, path) => {
        const uri1 = `http://localhost:${port}${path}`;
        const uri2 = `http://localhost${path}`;
        const uri3 = `http://127.0.0.1:${port}${path}`;
        return validateRedirectUri(uri1) && validateRedirectUri(uri2) && validateRedirectUri(uri3);
      }),
      { numRuns: 200 }
    );
  });

  it('HTTP non-localhost URLs are invalid', () => {
    fc.assert(
      fc.property(arbDomain, arbPort, arbPath, (domain, port, path) => {
        fc.pre(domain !== 'localhost' && domain !== '127.0.0.1');
        const uri = `http://${domain}:${port}${path}`;
        return !validateRedirectUri(uri);
      }),
      { numRuns: 200 }
    );
  });

  it('URLs with fragments are invalid', () => {
    fc.assert(
      fc.property(arbDomain, (domain) => {
        const uri = `https://${domain}/callback#fragment`;
        return !validateRedirectUri(uri);
      }),
      { numRuns: 100 }
    );
  });

  it('Invalid URL formats are rejected', () => {
    const invalidUris = fc.oneof(
      fc.constant('not-a-url'),
      fc.constant('http://'),
      fc.constant('://example.com'),
      fc.string({ minLength: 1 }).map((s) => `ftp://${s}`)
    );
    
    fc.assert(
      fc.property(invalidUris, (uri) => {
        return !validateRedirectUri(uri);
      }),
      { numRuns: 200 }
    );
  });
});

describe('Authorization params validation', () => {
  const arbClientId = fc.uuid();
  const arbScope = fc.oneof(
    fc.constant('profile'),
    fc.constant('email'),
    fc.constant('oasisbios:read'),
    fc.constant('oasisbios:full'),
    fc.constant('dcos:read'),
    fc.constant('profile email')
  );
  const arbState = fc.string({ minLength: 10, maxLength: 100 });
  const arbCodeChallenge = fc.string({ minLength: 43, maxLength: 128 });

  it('valid authorization params pass validation', () => {
    fc.assert(
      fc.property(arbClientId, arbScope, arbState, arbCodeChallenge, (clientId, scope, state, codeChallenge) => {
        const result = validateAuthorizationParams({
          client_id: clientId,
          redirect_uri: 'https://example.com/callback',
          response_type: 'code',
          scope,
          state,
          code_challenge: codeChallenge,
          code_challenge_method: 'S256',
        });
        return result.valid;
      }),
      { numRuns: 200 }
    );
  });

  it('missing client_id fails validation', () => {
    fc.assert(
      fc.property(arbScope, arbState, arbCodeChallenge, (scope, state, codeChallenge) => {
        const result = validateAuthorizationParams({
          redirect_uri: 'https://example.com/callback',
          response_type: 'code',
          scope,
          state,
          code_challenge: codeChallenge,
        });
        return !result.valid && result.error === 'invalid_request';
      }),
      { numRuns: 100 }
    );
  });

  it('invalid response_type fails validation', () => {
    fc.assert(
      fc.property(arbClientId, arbScope, arbState, arbCodeChallenge, (clientId, scope, state, codeChallenge) => {
        const result = validateAuthorizationParams({
          client_id: clientId,
          redirect_uri: 'https://example.com/callback',
          response_type: 'token',
          scope,
          state,
          code_challenge: codeChallenge,
        });
        return !result.valid && result.error === 'unsupported_response_type';
      }),
      { numRuns: 100 }
    );
  });

  it('unknown scopes fail validation', () => {
    fc.assert(
      fc.property(arbClientId, arbState, arbCodeChallenge, (clientId, state, codeChallenge) => {
        const result = validateAuthorizationParams({
          client_id: clientId,
          redirect_uri: 'https://example.com/callback',
          response_type: 'code',
          scope: 'unknown_scope profile',
          state,
          code_challenge: codeChallenge,
        });
        return !result.valid && result.error === 'invalid_scope';
      }),
      { numRuns: 100 }
    );
  });
});

describe('Token params validation', () => {
  const arbClientId = fc.uuid();
  const arbClientSecret = fc.string({ minLength: 32, maxLength: 128 });
  const arbCode = fc.string({ minLength: 20, maxLength: 100 });
  const arbCodeVerifier = fc.string({ minLength: 43, maxLength: 128 });
  const arbRefreshToken = fc.string({ minLength: 64, maxLength: 128 });

  it('valid authorization_code grant params pass validation', () => {
    fc.assert(
      fc.property(arbClientId, arbClientSecret, arbCode, arbCodeVerifier, (clientId, clientSecret, code, codeVerifier) => {
        const result = validateTokenParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: 'https://example.com/callback',
          client_id: clientId,
          client_secret: clientSecret,
          code_verifier: codeVerifier,
        });
        return result.valid;
      }),
      { numRuns: 200 }
    );
  });

  it('valid refresh_token grant params pass validation', () => {
    fc.assert(
      fc.property(arbClientId, arbClientSecret, arbRefreshToken, (clientId, clientSecret, refreshToken) => {
        const result = validateTokenParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
          client_id: clientId,
          client_secret: clientSecret,
        });
        return result.valid;
      }),
      { numRuns: 200 }
    );
  });

  it('missing grant_type fails validation', () => {
    fc.assert(
      fc.property(arbClientId, arbClientSecret, (clientId, clientSecret) => {
        const result = validateTokenParams({
          client_id: clientId,
          client_secret: clientSecret,
        });
        return !result.valid && result.error === 'invalid_request';
      }),
      { numRuns: 100 }
    );
  });

  it('unsupported grant_type fails validation', () => {
    fc.assert(
      fc.property(arbClientId, arbClientSecret, (clientId, clientSecret) => {
        const result = validateTokenParams({
          grant_type: 'password',
          client_id: clientId,
          client_secret: clientSecret,
        });
        return !result.valid && result.error === 'unsupported_grant_type';
      }),
      { numRuns: 100 }
    );
  });

  it('authorization_code grant without code_verifier fails validation', () => {
    fc.assert(
      fc.property(arbClientId, arbClientSecret, arbCode, (clientId, clientSecret, code) => {
        const result = validateTokenParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: 'https://example.com/callback',
          client_id: clientId,
          client_secret: clientSecret,
        });
        return !result.valid && result.error === 'invalid_request';
      }),
      { numRuns: 100 }
    );
  });
});