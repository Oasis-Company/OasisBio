import { NextResponse } from 'next/server';
import { generateCSRFToken, setCSRFCookie } from '@/lib/csrf';

/**
 * GET /api/csrf-token
 *
 * Returns a new CSRF token and sets it as a cookie.
 * Client should read the cookie value and include it in the X-CSRF-Token header
 * for all state-changing requests (POST, PUT, DELETE).
 */
export async function GET() {
  const token = generateCSRFToken();
  const response = NextResponse.json({ token });
  setCSRFCookie(response, token);
  return response;
}
