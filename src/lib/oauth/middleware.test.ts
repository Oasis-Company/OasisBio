import * as fc from 'fast-check';
import { hasScope, parseScopes, ALL_SCOPES, type ScopeName } from './scopes';
import { signAccessToken, verifyAccessToken, generateUUID } from './crypto';

describe('Scope enforcement — Property 5: Scope enforcement', () => {
  it('hasScope returns true when token has required scope', () => {
    fc.assert(
      fc.property(
        fc.uuid(),
        fc.uuid(),
        (userId, clientId) => {
          const scope = 'profile email oasisbios:read';
          const jti = generateUUID();
          const token = signAccessToken({ sub: userId, clientId, scope, jti });
          const payload = verifyAccessToken(token);
          
          if (!payload) return false;
          
          return hasScope(payload.scope, 'profile') &&
                 hasScope(payload.scope, 'email') &&
                 hasScope(payload.scope, 'oasisbios:read');
        }
      ),
      { numRuns: 200 }
    );
  });

  it('hasScope returns false when token lacks required scope', () => {
    fc.assert(
      fc.property(
        fc.uuid(),
        fc.uuid(),
        (userId, clientId) => {
          const scope = 'profile';
          const jti = generateUUID();
          const token = signAccessToken({ sub: userId, clientId, scope, jti });
          const payload = verifyAccessToken(token);
          
          if (!payload) return false;
          
          return !hasScope(payload.scope, 'email') &&
                 !hasScope(payload.scope, 'oasisbios:read') &&
                 !hasScope(payload.scope, 'oasisbios:full') &&
                 !hasScope(payload.scope, 'dcos:read');
        }
      ),
      { numRuns: 200 }
    );
  });

  it('insufficient scope should result in 403 (property-based test)', () => {
    const arbScopesArray = fc.array(fc.oneof(...ALL_SCOPES.map(fc.constant)), { minLength: 1, maxLength: 3 });
    
    fc.assert(
      fc.property(
        fc.uuid(),
        fc.uuid(),
        arbScopesArray,
        fc.oneof(...ALL_SCOPES.map(fc.constant)),
        (userId, clientId, grantedScopes, requiredScope) => {
          fc.pre(!grantedScopes.includes(requiredScope));
          
          const scopeString = grantedScopes.join(' ');
          const jti = generateUUID();
          const token = signAccessToken({ sub: userId, clientId, scope: scopeString, jti });
          const payload = verifyAccessToken(token);
          
          if (!payload) return false;
          
          return !hasScope(payload.scope, requiredScope);
        }
      ),
      { numRuns: 200 }
    );
  });
});

describe('Scope parsing', () => {
  it('parseScopes correctly parses space-separated scope string', () => {
    const arbScopesArray = fc.array(fc.oneof(...ALL_SCOPES.map(fc.constant)), { minLength: 1, maxLength: 5, maxUnique: 5 });
    
    fc.assert(
      fc.property(
        arbScopesArray,
        (scopes) => {
          const scopeString = scopes.join(' ');
          const parsed = parseScopes(scopeString);
          
          return scopes.every((s) => parsed.includes(s)) &&
                 parsed.length === scopes.length;
        }
      ),
      { numRuns: 200 }
    );
  });

  it('parseScopes drops invalid scopes', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }),
        (invalidScope) => {
          fc.pre(!(invalidScope in ALL_SCOPES.reduce((acc, s) => ({ ...acc, [s]: true }), {})));
          
          const result = parseScopes(`profile ${invalidScope} email`);
          return result.length === 2 &&
                 result.includes('profile') &&
                 result.includes('email');
        }
      ),
      { numRuns: 200 }
    );
  });
});

describe('Access token scope validation', () => {
  const arbScopesArray = fc.array(fc.oneof(...ALL_SCOPES.map(fc.constant)), { minLength: 1, maxLength: 5, maxUnique: 5 });
  
  it('access token contains granted scopes', () => {
    fc.assert(
      fc.property(
        fc.uuid(),
        fc.uuid(),
        arbScopesArray,
        (userId, clientId, scopes) => {
          const scopeString = scopes.join(' ');
          const jti = generateUUID();
          const token = signAccessToken({ sub: userId, clientId, scope: scopeString, jti });
          const payload = verifyAccessToken(token);
          
          if (!payload) return false;
          
          return payload.scope === scopeString &&
                 payload.jti === jti;
        }
      ),
      { numRuns: 200 }
    );
  });
});

describe('Authorization flow scope enforcement', () => {
  interface ResourceEndpoint {
    name: string;
    requiredScope: ScopeName;
  }

  const endpoints: ResourceEndpoint[] = [
    { name: 'userinfo basic', requiredScope: 'profile' },
    { name: 'userinfo email', requiredScope: 'email' },
    { name: 'oasisbios list', requiredScope: 'oasisbios:read' },
    { name: 'oasisbios full', requiredScope: 'oasisbios:full' },
    { name: 'dcos read', requiredScope: 'dcos:read' },
  ];

  const arbScopesArray = fc.array(fc.oneof(...ALL_SCOPES.map(fc.constant)), { minLength: 1, maxLength: 4, maxUnique: 4 });

  it('endpoint access is denied when scope is missing', () => {
    fc.assert(
      fc.property(
        fc.uuid(),
        fc.uuid(),
        arbScopesArray,
        fc.oneof(...endpoints.map(fc.constant)),
        (userId, clientId, grantedScopes, endpoint) => {
          fc.pre(!grantedScopes.includes(endpoint.requiredScope));
          
          const scopeString = grantedScopes.join(' ');
          const jti = generateUUID();
          const token = signAccessToken({ sub: userId, clientId, scope: scopeString, jti });
          const payload = verifyAccessToken(token);
          
          if (!payload) return false;
          
          const hasAccess = hasScope(payload.scope, endpoint.requiredScope);
          return !hasAccess;
        }
      ),
      { numRuns: 200 }
    );
  });

  it('endpoint access is granted when scope is present', () => {
    fc.assert(
      fc.property(
        fc.uuid(),
        fc.uuid(),
        fc.oneof(...endpoints.map(fc.constant)),
        (userId, clientId, endpoint) => {
          const scopeString = endpoint.requiredScope;
          const jti = generateUUID();
          const token = signAccessToken({ sub: userId, clientId, scope: scopeString, jti });
          const payload = verifyAccessToken(token);
          
          if (!payload) return false;
          
          return hasScope(payload.scope, endpoint.requiredScope);
        }
      ),
      { numRuns: 200 }
    );
  });
});