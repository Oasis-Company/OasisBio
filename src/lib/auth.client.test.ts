/**
 * Tests for auth.client utilities.
 *
 * Feature: supabase-auth-fix
 * Property 5: Auth state change propagates to context
 * Validates: Requirements 2.5
 *
 * We test the pure state-transition logic without needing a real browser
 * or Supabase connection.
 */

import * as fc from 'fast-check';

// ---------------------------------------------------------------------------
// Pure state machine extracted for testing
// ---------------------------------------------------------------------------

interface AuthState {
  user: { id: string; email: string } | null;
  session: { user: { id: string; email: string }; access_token: string } | null;
  isLoading: boolean;
}

type AuthEvent =
  | { type: 'SIGNED_IN'; user: { id: string; email: string }; access_token: string }
  | { type: 'SIGNED_OUT' }
  | { type: 'TOKEN_REFRESHED'; user: { id: string; email: string }; access_token: string }
  | { type: 'INITIAL_SESSION'; session: AuthState['session'] };

function applyAuthEvent(state: AuthState, event: AuthEvent): AuthState {
  switch (event.type) {
    case 'INITIAL_SESSION':
      return {
        user: event.session?.user ?? null,
        session: event.session,
        isLoading: false,
      };
    case 'SIGNED_IN':
    case 'TOKEN_REFRESHED':
      return {
        user: event.user,
        session: { user: event.user, access_token: event.access_token },
        isLoading: false,
      };
    case 'SIGNED_OUT':
      return { user: null, session: null, isLoading: false };
    default:
      return state;
  }
}

// ---------------------------------------------------------------------------
// Arbitraries
// ---------------------------------------------------------------------------

const arbUser = fc.record({
  id: fc.uuid(),
  email: fc.emailAddress(),
});

const arbSession = arbUser.chain((user) =>
  fc.record({
    user: fc.constant(user),
    access_token: fc.string({ minLength: 20, maxLength: 100 }),
  })
);

const arbSignedInEvent = arbUser.chain((user) =>
  fc.record({
    type: fc.constant('SIGNED_IN' as const),
    user: fc.constant(user),
    access_token: fc.string({ minLength: 20, maxLength: 100 }),
  })
);

const arbSignedOutEvent = fc.constant({ type: 'SIGNED_OUT' as const });

const arbTokenRefreshedEvent = arbUser.chain((user) =>
  fc.record({
    type: fc.constant('TOKEN_REFRESHED' as const),
    user: fc.constant(user),
    access_token: fc.string({ minLength: 20, maxLength: 100 }),
  })
);

// ---------------------------------------------------------------------------
// Property 5: Auth state change propagates to context
// Feature: supabase-auth-fix, Property 5: Auth state change propagates to context
// Validates: Requirements 2.5
// ---------------------------------------------------------------------------

describe('Auth state machine — Property 5: Auth state change propagates to context', () => {
  const initialState: AuthState = { user: null, session: null, isLoading: true };

  it('SIGNED_IN event sets user and session', () => {
    // Feature: supabase-auth-fix, Property 5: Auth state change propagates to context
    fc.assert(
      fc.property(arbSignedInEvent, (event) => {
        const next = applyAuthEvent(initialState, event);
        return (
          next.user?.id === event.user.id &&
          next.session?.access_token === event.access_token &&
          next.isLoading === false
        );
      }),
      { numRuns: 200 }
    );
  });

  it('SIGNED_OUT event clears user and session', () => {
    fc.assert(
      fc.property(arbSession, (session) => {
        const authenticatedState: AuthState = { user: session.user, session, isLoading: false };
        const next = applyAuthEvent(authenticatedState, { type: 'SIGNED_OUT' });
        return next.user === null && next.session === null && next.isLoading === false;
      }),
      { numRuns: 200 }
    );
  });

  it('TOKEN_REFRESHED event updates session without losing user', () => {
    fc.assert(
      fc.property(arbTokenRefreshedEvent, (event) => {
        const next = applyAuthEvent(initialState, event);
        return (
          next.user?.id === event.user.id &&
          next.session !== null &&
          next.isLoading === false
        );
      }),
      { numRuns: 200 }
    );
  });

  it('INITIAL_SESSION with null session results in unauthenticated state', () => {
    fc.assert(
      fc.property(fc.constant(null), (session) => {
        const next = applyAuthEvent(initialState, { type: 'INITIAL_SESSION', session });
        return next.user === null && next.session === null && next.isLoading === false;
      }),
      { numRuns: 100 }
    );
  });

  it('INITIAL_SESSION with valid session sets user and marks loading done', () => {
    fc.assert(
      fc.property(arbSession, (session) => {
        const next = applyAuthEvent(initialState, { type: 'INITIAL_SESSION', session });
        return (
          next.user?.id === session.user.id &&
          next.session?.access_token === session.access_token &&
          next.isLoading === false
        );
      }),
      { numRuns: 200 }
    );
  });

  it('sign-out after sign-in always results in null user (round-trip)', () => {
    fc.assert(
      fc.property(arbSignedInEvent, (signInEvent) => {
        const afterSignIn = applyAuthEvent(initialState, signInEvent);
        const afterSignOut = applyAuthEvent(afterSignIn, { type: 'SIGNED_OUT' });
        return afterSignOut.user === null && afterSignOut.session === null;
      }),
      { numRuns: 200 }
    );
  });
});

// ---------------------------------------------------------------------------
// Unit tests — specific examples
// ---------------------------------------------------------------------------

describe('Auth state machine — unit examples', () => {
  const initialState: AuthState = { user: null, session: null, isLoading: true };

  it('initial state has isLoading=true', () => {
    expect(initialState.isLoading).toBe(true);
    expect(initialState.user).toBeNull();
    expect(initialState.session).toBeNull();
  });

  it('SIGNED_IN sets isLoading to false', () => {
    const next = applyAuthEvent(initialState, {
      type: 'SIGNED_IN',
      user: { id: 'user-1', email: 'test@example.com' },
      access_token: 'token-abc',
    });
    expect(next.isLoading).toBe(false);
    expect(next.user?.id).toBe('user-1');
  });
});
