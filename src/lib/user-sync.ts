import 'server-only';
import { prisma } from '@/lib/prisma';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import crypto from 'crypto';

export interface SyncResult {
  userId: string;
  profileId: string;
  username: string;
  isNewUser: boolean;
}

/**
 * Generates a unique username from a base string.
 *
 * Rules:
 * - Lowercased, only alphanumeric characters kept
 * - Falls back to "user_<random>" if base is empty after cleaning
 * - Appends incrementing numeric suffix on collision (e.g. john, john1, john2)
 *
 * Uses crypto.randomBytes for secure random fallback values.
 * Includes a maximum attempt limit to prevent infinite loops.
 */
export async function generateUniqueUsername(base: string): Promise<string> {
  const clean = base.toLowerCase().replace(/[^a-z0-9]/g, '');
  const stem = clean.length > 0 ? clean : `user_${crypto.randomBytes(3).toString('hex')}`;

  let candidate = stem;
  let counter = 0;
  const maxAttempts = 100;

  while (counter < maxAttempts) {
    const existing = await prisma.profile.findUnique({ where: { username: candidate } });
    if (!existing) return candidate;

    counter++;
    candidate = `${stem}${counter}`;
  }

  throw new Error(`Failed to generate unique username for base "${base}" after ${maxAttempts} attempts`);
}

/**
 * Syncs a Supabase user to the Prisma database.
 *
 * Behaviour:
 * - Upserts the User record (id, email, name)
 * - Creates a Profile if one doesn't exist
 * - If a Profile already exists, only fills in empty fields —
 *   never overwrites user-edited displayName, bio, or website
 *
 * This function is safe to call on every authenticated request as a fallback
 * in case the Supabase webhook failed to deliver.
 */
export async function syncUserToPrisma(supabaseUser: SupabaseUser): Promise<SyncResult> {
  const { id, email, user_metadata } = supabaseUser;
  const displayName: string =
    user_metadata?.display_name ||
    user_metadata?.name ||
    email?.split('@')[0] ||
    'User';

  // Upsert User — only update email and name if they changed
  const user = await prisma.user.upsert({
    where: { id },
    update: {
      email: email ?? '',
      // Only update name if it's currently null/empty
      ...(await shouldUpdateName(id, displayName) ? { name: displayName } : {}),
    },
    create: {
      id,
      email: email ?? '',
      name: displayName,
    },
  });

  // Check if Profile already exists
  const existingProfile = await prisma.profile.findFirst({ where: { userId: id } });

  if (existingProfile) {
    // Only fill in fields that are currently empty — never overwrite user edits
    const updates: Record<string, string> = {};
    if (!existingProfile.displayName) updates.displayName = displayName;
    if (!existingProfile.avatarUrl && user_metadata?.avatar_url) {
      updates.avatarUrl = user_metadata.avatar_url;
    }

    const profile =
      Object.keys(updates).length > 0
        ? await prisma.profile.update({ where: { id: existingProfile.id }, data: updates })
        : existingProfile;

    return {
      userId: user.id,
      profileId: profile.id,
      username: profile.username,
      isNewUser: false,
    };
  }

  // Create new Profile with retry on P2002 (unique constraint violation)
  let profile;
  let username = await generateUniqueUsername(displayName);
  let retries = 0;
  const maxRetries = 3;

  while (retries < maxRetries) {
    try {
      profile = await prisma.profile.create({
        data: {
          userId: id,
          username,
          displayName,
          avatarUrl: user_metadata?.avatar_url ?? null,
        },
      });
      break; // Success
    } catch (err: any) {
      if (err?.code === 'P2002' && err?.meta?.target?.includes('username')) {
        // Username conflict — regenerate with extra randomness
        retries++;
        if (retries >= maxRetries) throw err;
        username = await generateUniqueUsername(
          displayName + '_' + crypto.randomBytes(2).toString('hex')
        );
        continue;
      }
      throw err;
    }
  }

  // profile is guaranteed to be assigned here (either loop succeeds and breaks, or throws)
  return {
    userId: user.id,
    profileId: profile!.id,
    username: profile!.username,
    isNewUser: true,
  };
}

/** Returns true if the user's current name in DB is null/empty */
async function shouldUpdateName(userId: string, newName: string): Promise<boolean> {
  if (!newName) return false;
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { name: true } });
  return !user?.name;
}
