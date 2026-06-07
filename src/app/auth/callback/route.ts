/**
 * OAuth Callback Route Handler
 *
 * Handles the server-side leg of the Supabase PKCE OAuth flow.
 * Supabase sends ?code=xxx here after the user approves the OAuth provider.
 *
 * This MUST be a Route Handler (not a Client Component) because:
 *  1. The PKCE code_verifier is stored in an HttpOnly cookie by @supabase/ssr.
 *  2. exchangeCodeForSession() needs to read that cookie server-side to complete the exchange.
 *  3. A Client Component running in useEffect cannot reliably access HttpOnly cookies.
 *
 * Flow:
 *  Provider -> Supabase -> GET /auth/callback?code=xxx -> exchangeCodeForSession -> /dashboard
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { syncUserToPrisma } from '@/lib/user-sync';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  // Provider-side error (e.g. user denied access)
  if (error) {
    const loginUrl = new URL('/auth/login', origin);
    loginUrl.searchParams.set('error', error);
    if (errorDescription) {
      loginUrl.searchParams.set('error_description', errorDescription);
    }
    return NextResponse.redirect(loginUrl);
  }

  if (!code) {
    const loginUrl = new URL('/auth/login', origin);
    loginUrl.searchParams.set('error', 'missing_code');
    return NextResponse.redirect(loginUrl);
  }

  try {
    const supabase = await createClient();
    const { data: sessionData, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      const loginUrl = new URL('/auth/login', origin);
      loginUrl.searchParams.set('error', exchangeError.code ?? 'exchange_failed');
      loginUrl.searchParams.set('error_description', exchangeError.message);
      return NextResponse.redirect(loginUrl);
    }

    // Sync user to database before redirecting
    if (sessionData?.user) {
      try {
        await syncUserToPrisma(sessionData.user);
      } catch (syncError) {
        console.error('[callback] Failed to sync user to database:', syncError);
        // We don't block the user from accessing the app if sync fails
        // They can still use the app, and we'll retry on next request
      }
    }

    // Session is now set in cookies — redirect to dashboard
    return NextResponse.redirect(new URL('/dashboard', origin));
  } catch {
    const loginUrl = new URL('/auth/login', origin);
    loginUrl.searchParams.set('error', 'server_error');
    return NextResponse.redirect(loginUrl);
  }
}
