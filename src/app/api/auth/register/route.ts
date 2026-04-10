import { NextResponse } from 'next/server';

/**
 * This endpoint is deprecated.
 * Registration is now handled client-side via Supabase OTP (passwordless).
 * See: /auth/register page
 */
export async function POST() {
  return NextResponse.json(
    { error: { code: 'DEPRECATED', message: 'Use the /auth/register page for OTP-based registration' } },
    { status: 410 }
  );
}
