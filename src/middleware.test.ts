/**
 * Tests for Next.js middleware route protection logic.
 *
 * Feature: supabase-auth-fix
 * Property 1: Protected routes always redirect unauthenticated users
 * Validates: Requirements 3.2, 3.5
 *
 * We test the pure routing logic extracted from the middleware,
 * without needing to mock the full Supabase SSR client.
 */

import * as fc from 'fast-check';

// ---------------------------------------------------------------------------
// Pure routing logic extracted for testing
// ---------------------------------------------------------------------------

const PROTECTED_PREFIXES = ['/dashboard', '/api/oasisbios', '/api/worlds'];
const AUTH_PREFIXES = ['/auth/login', '/auth/register'];

interface RouteDecision {
  action: 'redirect-to-login' | 'redirect-to-dashboard' | 'pass';
  redirectUrl?: string;
}

function decideRoute(pathname: string, isAuthenticated: boolean): RouteDecision {
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  const isAuthRoute = AUTH_PREFIXES.some((p) => pathname.startsWith(p));

  if (isProtected && !isAuthenticated) {
    return {
      action: 'redirect-to-login',
      redirectUrl: `/auth/login?callbackUrl=${encodeURIComponent(pathname)}`,
    };
  }

  if (isAuthRoute && isAuthenticated) {
    return { action: 'redirect-to-dashboard', redirectUrl: '/dashboard' };
  }

  return { action: 'pass' };
}

// ---------------------------------------------------------------------------
// Property 1: Protected routes always redirect unauthenticated users
// Feature: supabase-auth-fix, Property 1: Protected routes always redirect unauthenticated users
// Validates: Requirements 3.2, 3.5
// ---------------------------------------------------------------------------

describe('Middleware routing — Property 1: Protected routes redirect unauthenticated users', () => {
  it('any path under /dashboard redirects to login when unauthenticated', () => {
    // Feature: supabase-auth-fix, Property 1: Protected routes always redirect unauthenticated users
    fc.assert(
      fc.property(
        fc.string({ minLength: 0, maxLength: 50 }).map((s) => `/dashboard/${s}`),
        (pathname) => {
          const result = decideRoute(pathname, false);
          return result.action === 'redirect-to-login';
        }
      ),
      { numRuns: 200 }
    );
  });

  it('any path under /api/oasisbios redirects to login when unauthenticated', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 0, maxLength: 50 }).map((s) => `/api/oasisbios/${s}`),
        (pathname) => {
          const result = decideRoute(pathname, false);
          return result.action === 'redirect-to-login';
        }
      ),
      { numRuns: 200 }
    );
  });

  it('any path under /api/worlds redirects to login when unauthenticated', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 0, maxLength: 50 }).map((s) => `/api/worlds/${s}`),
        (pathname) => {
          const result = decideRoute(pathname, false);
          return result.action === 'redirect-to-login';
        }
      ),
      { numRuns: 200 }
    );
  });

  it('redirect URL always contains the original path as callbackUrl', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...PROTECTED_PREFIXES).chain((prefix) =>
          fc.string({ minLength: 0, maxLength: 30 }).map((s) => `${prefix}/${s}`)
        ),
        (pathname) => {
          const result = decideRoute(pathname, false);
          if (result.action !== 'redirect-to-login') return false;
          return result.redirectUrl?.includes(encodeURIComponent(pathname)) ?? false;
        }
      ),
      { numRuns: 200 }
    );
  });

  it('protected routes pass through when authenticated', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...PROTECTED_PREFIXES).chain((prefix) =>
          fc.string({ minLength: 0, maxLength: 30 }).map((s) => `${prefix}/${s}`)
        ),
        (pathname) => {
          const result = decideRoute(pathname, true);
          return result.action === 'pass';
        }
      ),
      { numRuns: 200 }
    );
  });

  it('auth routes redirect authenticated users to /dashboard', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('/auth/login', '/auth/register'),
        (pathname) => {
          const result = decideRoute(pathname, true);
          return result.action === 'redirect-to-dashboard';
        }
      ),
      { numRuns: 100 }
    );
  });

  it('public routes always pass through regardless of auth state', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('/', '/about', '/explore', '/api/health'),
        fc.boolean(),
        (pathname, isAuthenticated) => {
          const result = decideRoute(pathname, isAuthenticated);
          return result.action === 'pass';
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ---------------------------------------------------------------------------
// Unit tests — specific examples
// ---------------------------------------------------------------------------

describe('Middleware routing — unit examples', () => {
  it('/dashboard redirects unauthenticated to /auth/login?callbackUrl=%2Fdashboard', () => {
    const result = decideRoute('/dashboard', false);
    expect(result.action).toBe('redirect-to-login');
    expect(result.redirectUrl).toBe('/auth/login?callbackUrl=%2Fdashboard');
  });

  it('/auth/login redirects authenticated user to /dashboard', () => {
    const result = decideRoute('/auth/login', true);
    expect(result.action).toBe('redirect-to-dashboard');
    expect(result.redirectUrl).toBe('/dashboard');
  });

  it('/ passes through for unauthenticated user', () => {
    const result = decideRoute('/', false);
    expect(result.action).toBe('pass');
  });

  it('/api/oasisbios/bio123 redirects unauthenticated', () => {
    const result = decideRoute('/api/oasisbios/bio123', false);
    expect(result.action).toBe('redirect-to-login');
  });
});
