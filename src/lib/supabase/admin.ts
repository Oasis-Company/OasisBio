import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { supabaseConfig } from '@/lib/config';

/**
 * Supabase admin client for server-side operations that require
 * service role permissions (bypassing RLS policies).
 *
 * Uses a global singleton to avoid creating multiple instances in development.
 */
const globalForSupabaseAdmin = global as unknown as {
  supabaseAdmin: ReturnType<typeof createClient> | undefined;
};

export const supabaseAdmin =
  globalForSupabaseAdmin.supabaseAdmin ||
  createClient(supabaseConfig.url, supabaseConfig.serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

if (process.env.NODE_ENV !== 'production') {
  globalForSupabaseAdmin.supabaseAdmin = supabaseAdmin;
}
