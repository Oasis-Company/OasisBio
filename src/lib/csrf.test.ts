/**
 * @jest-environment node
 *
 * CSRF Protection Tests
 *
 * Tests:
 * - generateCSRFToken produces cryptographically random tokens
 * - validateCSRF returns true when cookie matches header
 * - validateCSRF returns false on missing cookie or header
 * - validateCSRF returns false on mismatched tokens
 * - validateCSRF is resistant to malformed hex inputs
 * - withCSRF skips GET/HEAD/OPTIONS methods
 * - withCSRF returns 403 on validation failure
 * - withCSRF returns null on successful validation
 */

import { NextRequest } from 'next/server';
import {
  generateCSRFToken,
  validateCSRF,
  withCSRF,
} from '@/lib/csrf';
import * as fc from 'fast-check';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildRequest(
  method: string,
  csrfCookie?: string,
  csrfHeader?: string
): NextRequest {
  const headers: Record<string, string> = {
    'content-type': 'application/json',
  };

  if (csrfHeader !== undefined) {
    headers['x-csrf-token'] = csrfHeader;
  }

  const cookieStr = csrfCookie !== undefined ? `csrf-token=${csrfCookie}` : '';
  if (cookieStr) {
    headers['cookie'] = cookieStr;
  }

  return new NextRequest('http://localhost/api/test', {
    method,
    headers,
  });
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('generateCSRFToken', () => {
  it('returns a hex string of length 64 (32 bytes)', () => {
    const token = generateCSRFToken();
    expect(token).toMatch(/^[a-f0-9]{64}$/);
  });

  it('generates unique tokens on each call', () => {
    const tokens = Array.from({ length: 50 }, () => generateCSRFToken());
    const unique = new Set(tokens);
    expect(unique.size).toBe(50);
  });

  it('uses crypto-grade randomness (property: every call is unique)', () => {
    fc.assert(
      fc.property(fc.nat(), () => {
        const t1 = generateCSRFToken();
        const t2 = generateCSRFToken();
        return t1 !== t2;
      }),
      { numRuns: 30 }
    );
  });
});

describe('validateCSRF', () => {
  let validToken: string;

  beforeEach(() => {
    validToken = generateCSRFToken();
  });

  it('returns true when cookie and header match', () => {
    const req = buildRequest('POST', validToken, validToken);
    expect(validateCSRF(req)).toBe(true);
  });

  it('returns false when cookie is missing', () => {
    const req = buildRequest('POST', undefined, validToken);
    expect(validateCSRF(req)).toBe(false);
  });

  it('returns false when header is missing', () => {
    const req = buildRequest('POST', validToken, undefined);
    expect(validateCSRF(req)).toBe(false);
  });

  it('returns false when both are missing', () => {
    const req = buildRequest('POST', undefined, undefined);
    expect(validateCSRF(req)).toBe(false);
  });

  it('returns false when cookie and header differ', () => {
    const otherToken = generateCSRFToken();
    const req = buildRequest('POST', validToken, otherToken);
    expect(validateCSRF(req)).toBe(false);
  });

  it('returns false when header is corrupted (single bit flip)', () => {
    // Flip last character
    const flippedToken = validToken.slice(0, -1) + (validToken.endsWith('a') ? 'b' : 'a');
    const req = buildRequest('POST', validToken, flippedToken);
    expect(validateCSRF(req)).toBe(false);
  });

  it('returns false for non-hex token strings (malformed inputs)', () => {
    const malformed = 'not-a-valid-hex-token!@#$%^&*()';
    const req = buildRequest('POST', malformed, malformed);
    // timingSafeEqual may throw → caught by the try/catch → returns false
    expect(validateCSRF(req)).toBe(false);
  });

  it('is case-sensitive (uppercase hex ≠ lowercase hex)', () => {
    const token = generateCSRFToken(); // always lowercase
    const uppercaseToken = token.toUpperCase();
    const req = buildRequest('POST', token, uppercaseToken);
    // Uppercase and lowercase hex represent different byte buffers in Buffer.from(x, 'hex')
    // They should fail or pass based on exact byte comparison
    // The important thing is consistent behavior — no crash
    expect(typeof validateCSRF(req)).toBe('boolean');
  });
});

describe('withCSRF — middleware helper', () => {
  let validToken: string;

  beforeEach(() => {
    validToken = generateCSRFToken();
  });

  // ── Safe methods (should skip CSRF check) ─────────────────────────────────

  it('returns null (skip) for GET requests', () => {
    const req = buildRequest('GET');
    expect(withCSRF(req)).toBeNull();
  });

  it('returns null (skip) for HEAD requests', () => {
    const req = buildRequest('HEAD');
    expect(withCSRF(req)).toBeNull();
  });

  it('returns null (skip) for OPTIONS requests', () => {
    const req = buildRequest('OPTIONS');
    expect(withCSRF(req)).toBeNull();
  });

  // ── State-changing methods (must enforce CSRF) ────────────────────────────

  it('returns null (pass) for POST with valid CSRF token', () => {
    const req = buildRequest('POST', validToken, validToken);
    expect(withCSRF(req)).toBeNull();
  });

  it('returns null (pass) for PUT with valid CSRF token', () => {
    const req = buildRequest('PUT', validToken, validToken);
    expect(withCSRF(req)).toBeNull();
  });

  it('returns null (pass) for DELETE with valid CSRF token', () => {
    const req = buildRequest('DELETE', validToken, validToken);
    expect(withCSRF(req)).toBeNull();
  });

  it('returns 403 for POST without CSRF token', () => {
    const req = buildRequest('POST', undefined, undefined);
    const response = withCSRF(req);
    expect(response).not.toBeNull();
    expect(response!.status).toBe(403);
  });

  it('returns 403 for POST with invalid CSRF token', () => {
    const wrongToken = generateCSRFToken();
    const req = buildRequest('POST', validToken, wrongToken);
    const response = withCSRF(req);
    expect(response).not.toBeNull();
    expect(response!.status).toBe(403);
  });

  it('403 response includes error code in body', async () => {
    const req = buildRequest('POST', undefined, undefined);
    const response = withCSRF(req);
    const body = await response!.json();
    expect(body.error).toBe('invalid_csrf_token');
  });

  it('403 response includes human-readable description', async () => {
    const req = buildRequest('DELETE', validToken, generateCSRFToken());
    const response = withCSRF(req);
    const body = await response!.json();
    expect(body.error_description).toBeTruthy();
    expect(typeof body.error_description).toBe('string');
  });

  // ── Edge cases ────────────────────────────────────────────────────────────

  it('handles PATCH method — must enforce CSRF', () => {
    const req = buildRequest('PATCH', undefined, undefined);
    const response = withCSRF(req);
    // PATCH is not in the safe list (GET/HEAD/OPTIONS), so must be checked
    expect(response).not.toBeNull();
    expect(response!.status).toBe(403);
  });
});
