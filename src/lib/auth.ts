import 'server-only';

import { createClient } from '@/lib/supabase/server';
import { syncUserToPrisma } from '@/lib/user-sync';
import type { User as SupabaseUser } from '@supabase/supabase-js';

/**
 * Returns the authenticated Supabase user from the current request's session.
 * Uses @supabase/ssr createServerClient — reads cookies correctly.
 *
 * Returns null if no valid session exists.
 */
export async function getServerUser(): Promise<SupabaseUser | null> {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return null;
    return user;
  } catch {
    return null;
  }
}

/**
 * Returns the authenticated Supabase user and ensures a Prisma User + Profile
 * record exists (fallback sync in case the webhook failed to deliver).
 *
 * Returns null if no valid session exists.
 */
export async function getServerUserWithProfile() {
  const user = await getServerUser();
  if (!user) return null;

  try {
    const syncResult = await syncUserToPrisma(user);
    return { supabaseUser: user, ...syncResult };
  } catch (err) {
    // Sync failure must not block the user — log and return basic user info
    console.error('[auth] syncUserToPrisma failed (non-fatal):', err);
    return { supabaseUser: user, userId: user.id, profileId: null, username: null, isNewUser: false };
  }
}

export default { getServerUser, getServerUserWithProfile };
