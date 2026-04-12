/**
 * OAuth Scope definitions for OasisBio.
 *
 * Scopes control what data a third-party app can access after authorization.
 */

export const SCOPES = {
  profile: 'Access your basic profile (username, display name, avatar)',
  email: 'Access your email address',
  'oasisbios:read': 'View your character list',
  'oasisbios:full': 'View your characters\' full details (abilities, worlds, eras, references)',
  'dcos:read': 'Read your DCOS documents',
} as const;

export type ScopeName = keyof typeof SCOPES;

export const ALL_SCOPES = Object.keys(SCOPES) as ScopeName[];

/**
 * Parse a space-separated scope string into an array of valid ScopeNames.
 * Invalid scopes are silently dropped.
 */
export function parseScopes(scopeString: string): ScopeName[] {
  if (!scopeString) return [];
  return scopeString
    .split(' ')
    .filter((s): s is ScopeName => s in SCOPES);
}

/**
 * Validate that all requested scopes are recognized.
 * Returns the list of invalid scope names (empty = all valid).
 */
export function validateScopes(scopeString: string): string[] {
  if (!scopeString) return [];
  return scopeString
    .split(' ')
    .filter((s) => !(s in SCOPES));
}

/**
 * Check if a token's scope string includes the required scope.
 *
 * Feature: oauth-provider, Property 5: Scope enforcement
 */
export function hasScope(tokenScope: string, required: ScopeName): boolean {
  const scopes = parseScopes(tokenScope);
  return scopes.includes(required);
}

/**
 * Format scopes for display on the consent screen.
 * Returns human-readable descriptions for each requested scope.
 */
export function formatScopesForConsent(scopeString: string): string[] {
  return parseScopes(scopeString).map((s) => SCOPES[s]);
}
