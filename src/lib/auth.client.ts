'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User, Session, SupabaseClient } from '@supabase/supabase-js';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  supabase: SupabaseClient;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function SessionProvider({ children }: { children: React.ReactNode }) {
  // Create a stable browser client instance
  const supabase = useMemo(() => createClient(), []);

  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Hydrate initial session from cookies
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setIsLoading(false);
    });

    // Keep context in sync with auth state changes (sign-in, sign-out, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const value = useMemo<AuthContextValue>(
    () => ({ user, session, isLoading, supabase }),
    [user, session, isLoading, supabase]
  );

  return React.createElement(AuthContext.Provider, { value }, children);
}

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

/**
 * Returns the current auth context.
 * Must be used inside <SessionProvider>.
 */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within a SessionProvider');
  return ctx;
}

/**
 * Compatibility shim — mirrors the shape used by existing pages.
 */
export function useSession() {
  const { user, session, isLoading } = useAuth();
  return {
    data: session ? { user, session } : null,
    status: isLoading ? 'loading' : session ? 'authenticated' : 'unauthenticated',
  };
}

// ---------------------------------------------------------------------------
// Standalone helpers (usable outside the provider)
// ---------------------------------------------------------------------------

export function signOut() {
  return createClient().auth.signOut();
}

export function signIn(provider: string, options?: { callbackUrl?: string }) {
  if (provider === 'credentials') return Promise.resolve({ error: null, data: null });
  return createClient().auth.signInWithOAuth({
    provider: provider as Parameters<SupabaseClient['auth']['signInWithOAuth']>[0]['provider'],
    options: { redirectTo: options?.callbackUrl ?? window.location.origin },
  });
}
