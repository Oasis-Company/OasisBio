import { validateScopes } from './scopes';

// ─────────────────────────────────────────────
// Redirect URI validation
// ─────────────────────────────────────────────

/**
 * Validates a redirect URI.
 * Accepts: HTTPS URLs, http://localhost (any port), http://127.0.0.1 (any port)
 * Rejects: HTTP non-localhost, invalid format, missing scheme, fragments (#)
 *
 * Feature: oauth-provider, Property 2: Redirect URI validation
 */
export function validateRedirectUri(uri: string): boolean {
  if (!uri) return false;
  try {
    const parsed = new URL(uri);
    // No fragments allowed in redirect URIs (RFC 6749 §3.1.2)
    if (parsed.hash) return false;
    // HTTPS is always allowed
    if (parsed.protocol === 'https:') return true;
    // HTTP only allowed for localhost / 127.0.0.1 (development)
    if (parsed.protocol === 'http:') {
      return parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1';
    }
    return false;
  } catch {
    return false;
  }
}

// ─────────────────────────────────────────────
// Authorization request validation
// ─────────────────────────────────────────────

export interface AuthorizationParams {
  client_id?: string;
  redirect_uri?: string;
  response_type?: string;
  scope?: string;
  state?: string;
  code_challenge?: string;
  code_challenge_method?: string;
}

export interface AuthorizationValidationResult {
  valid: boolean;
  error?: string;
  errorDescription?: string;
}

/**
 * Validates all parameters for GET /oauth/authorize.
 * Returns error details if invalid.
 */
export function validateAuthorizationParams(
  params: AuthorizationParams
): AuthorizationValidationResult {
  if (!params.client_id) {
    return { valid: false, error: 'invalid_request', errorDescription: 'client_id is required' };
  }
  if (!params.redirect_uri) {
    return { valid: false, error: 'invalid_request', errorDescription: 'redirect_uri is required' };
  }
  if (!validateRedirectUri(params.redirect_uri)) {
    return { valid: false, error: 'invalid_request', errorDescription: 'redirect_uri is invalid' };
  }
  if (params.response_type !== 'code') {
    return { valid: false, error: 'unsupported_response_type', errorDescription: 'Only response_type=code is supported' };
  }
  if (!params.scope) {
    return { valid: false, error: 'invalid_request', errorDescription: 'scope is required' };
  }
  const invalidScopes = validateScopes(params.scope);
  if (invalidScopes.length > 0) {
    return { valid: false, error: 'invalid_scope', errorDescription: `Unknown scopes: ${invalidScopes.join(', ')}` };
  }
  if (!params.state) {
    return { valid: false, error: 'invalid_request', errorDescription: 'state is required' };
  }
  if (!params.code_challenge) {
    return { valid: false, error: 'invalid_request', errorDescription: 'code_challenge is required (PKCE)' };
  }
  if (params.code_challenge_method && params.code_challenge_method !== 'S256') {
    return { valid: false, error: 'invalid_request', errorDescription: 'Only code_challenge_method=S256 is supported' };
  }
  return { valid: true };
}

// ─────────────────────────────────────────────
// Token request validation
// ─────────────────────────────────────────────

export interface TokenParams {
  grant_type?: string;
  code?: string;
  redirect_uri?: string;
  client_id?: string;
  client_secret?: string;
  code_verifier?: string;
  refresh_token?: string;
}

export interface TokenValidationResult {
  valid: boolean;
  error?: string;
  errorDescription?: string;
}

/**
 * Validates parameters for POST /oauth/token.
 */
export function validateTokenParams(params: TokenParams): TokenValidationResult {
  if (!params.grant_type) {
    return { valid: false, error: 'invalid_request', errorDescription: 'grant_type is required' };
  }
  if (!['authorization_code', 'refresh_token'].includes(params.grant_type)) {
    return { valid: false, error: 'unsupported_grant_type', errorDescription: `grant_type "${params.grant_type}" is not supported` };
  }
  if (!params.client_id) {
    return { valid: false, error: 'invalid_request', errorDescription: 'client_id is required' };
  }
  if (!params.client_secret) {
    return { valid: false, error: 'invalid_request', errorDescription: 'client_secret is required' };
  }

  if (params.grant_type === 'authorization_code') {
    if (!params.code) {
      return { valid: false, error: 'invalid_request', errorDescription: 'code is required' };
    }
    if (!params.redirect_uri) {
      return { valid: false, error: 'invalid_request', errorDescription: 'redirect_uri is required' };
    }
    if (!params.code_verifier) {
      return { valid: false, error: 'invalid_request', errorDescription: 'code_verifier is required (PKCE)' };
    }
  }

  if (params.grant_type === 'refresh_token') {
    if (!params.refresh_token) {
      return { valid: false, error: 'invalid_request', errorDescription: 'refresh_token is required' };
    }
  }

  return { valid: true };
}
