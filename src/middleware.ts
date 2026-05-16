import { NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

/**
 * Routes that require authentication.
 * Unauthenticated requests are redirected to /auth/login?callbackUrl=<original>
 */
const PROTECTED_PREFIXES = [
  '/dashboard',
  '/api/oasisbios',
  '/api/worlds',
  '/api/abilities',
  '/api/dcos',
  '/api/eras',
  '/api/references',
  '/api/models',
  '/api/profile',
  '/api/settings',
  '/api/export',
  '/api/import',
  '/developer/apps',
  '/api/developer',
];

/**
 * Auth routes that authenticated users should not access.
 * Authenticated requests are redirected to /dashboard.
 * Note: /auth/callback and /auth/confirm are intentionally excluded —
 * they must be accessible regardless of auth state to complete OAuth/email flows.
 */
const AUTH_PREFIXES = ['/auth/login', '/auth/register'];

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request);
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  const isAuthRoute = AUTH_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  // Redirect unauthenticated users away from protected routes
  if (isProtected && !user) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from auth pages
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Return the supabaseResponse as-is — it carries refreshed session cookies.
  // IMPORTANT: Never create a new NextResponse here without copying cookies from supabaseResponse.
  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public folder assets
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
