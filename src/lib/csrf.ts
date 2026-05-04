import 'server-only';
import crypto from 'crypto';
import type { NextRequest, NextResponse } from 'next/server';

const CSRF_COOKIE_NAME = 'csrf-token';
const CSRF_HEADER_NAME = 'X-CSRF-Token';

/**
 * Generates a cryptographically random CSRF token.
 */
export function generateCSRFToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Validates a CSRF token from a request using the Double Submit Cookie pattern.
 *
 * The client must:
 * 1. Read the CSRF token from the `csrf-token` cookie
 * 2. Include it in the `X-CSRF-Token` header on state-changing requests
 *
 * Returns true if the token in the cookie matches the token in the header.
 */
export function validateCSRF(request: NextRequest): boolean {
  const cookieToken = request.cookies.get(CSRF_COOKIE_NAME)?.value;
  const headerToken = request.headers.get(CSRF_HEADER_NAME);

  if (!cookieToken || !headerToken) {
    return false;
  }

  // Timing-safe comparison to prevent timing attacks
  try {
    return crypto.timingSafeEqual(
      Buffer.from(cookieToken, 'hex'),
      Buffer.from(headerToken, 'hex')
    );
  } catch {
    return false;
  }
}

/**
 * Sets the CSRF token as a cookie on the response.
 * The cookie is readable by JavaScript (httpOnly: false) so the client can
 * include it in the X-CSRF-Token header.
 */
export function setCSRFCookie(response: NextResponse, token: string): void {
  response.cookies.set(CSRF_COOKIE_NAME, token, {
    httpOnly: false, // Client JS needs to read this for the header
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  });
}

/**
 * CSRF protection middleware helper.
 * Returns a NextResponse (403) if CSRF validation fails, null if it passes.
 *
 * Should be applied to state-changing endpoints (POST, PUT, DELETE)
 * that are authenticated via cookie-based sessions.
 */
export function withCSRF(request: NextRequest): NextResponse | null {
  // Skip CSRF check for safe methods
  const method = request.method.toUpperCase();
  if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') {
    return null;
  }

  if (!validateCSRF(request)) {
    return NextResponse.json(
      {
        error: 'invalid_csrf_token',
        error_description: 'CSRF token validation failed. Please refresh the page and try again.',
      },
      { status: 403 }
    );
  }

  return null;
}

/**
 * Endpoint to refresh/get a new CSRF token.
 * Call this from client-side when initializing the app or after CSRF errors.
 */
export function getCSRFTokenEndpoint(): { token: string } {
  const token = generateCSRFToken();
  return { token };
}
