import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Updates the Supabase session in the middleware layer.
 *
 * This proxy is responsible for:
 * 1. Refreshing expired auth tokens via getClaims()
 * 2. Writing the refreshed token back to request cookies (for Server Components)
 * 3. Writing the refreshed token to response cookies (for the browser)
 *
 * CRITICAL: Do NOT add any code between createServerClient and getClaims().
 * Doing so can cause users to be randomly logged out.
 */
export async function updateSession(request: NextRequest): Promise<{
  supabaseResponse: NextResponse;
  user: Record<string, unknown> | null;
}> {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          // Write refreshed cookies back to the request (for downstream server reads)
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));

          // Rebuild the response with updated cookies
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );

          // Forward any additional headers (e.g. x-supabase-*)
          if (headers) {
            Object.entries(headers).forEach(([key, value]) =>
              supabaseResponse.headers.set(key, value)
            );
          }
        },
      },
    }
  );

  // CRITICAL: getClaims() must be called immediately after createServerClient
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims ?? null;

  return { supabaseResponse, user };
}
