/**
 * Supabase Storage utilities.
 *
 * Provides path helpers, file validation, upload/delete wrappers,
 * and public URL generation for all storage buckets.
 */

import { createClient } from '@/lib/supabase/client';

// ---------------------------------------------------------------------------
// Bucket names
// ---------------------------------------------------------------------------

export const STORAGE_BUCKETS = {
  AVATARS: 'avatars',
  CHARACTER_COVERS: 'character-covers',
  MODEL_PREVIEWS: 'model-previews',
} as const;

// ---------------------------------------------------------------------------
// Path helpers
// ---------------------------------------------------------------------------

export const storagePath = {
  avatar: {
    getPath: (userId: string, extension = 'webp') => `${userId}/avatar.${extension}`,
    getUrl: (userId: string, extension = 'webp') => {
      const supabase = createClient();
      const { data } = supabase.storage
        .from(STORAGE_BUCKETS.AVATARS)
        .getPublicUrl(`${userId}/avatar.${extension}`);
      return data.publicUrl;
    },
  },

  characterCover: {
    getPath: (userId: string, characterId: string, extension = 'webp') =>
      `${userId}/${characterId}/cover.${extension}`,
    getUrl: (userId: string, characterId: string, extension = 'webp') => {
      const supabase = createClient();
      const { data } = supabase.storage
        .from(STORAGE_BUCKETS.CHARACTER_COVERS)
        .getPublicUrl(`${userId}/${characterId}/cover.${extension}`);
      return data.publicUrl;
    },
  },

  modelPreview: {
    getPath: (userId: string, characterId: string, extension = 'webp') =>
      `${userId}/${characterId}/preview.${extension}`,
    getUrl: (userId: string, characterId: string, extension = 'webp') => {
      const supabase = createClient();
      const { data } = supabase.storage
        .from(STORAGE_BUCKETS.MODEL_PREVIEWS)
        .getPublicUrl(`${userId}/${characterId}/preview.${extension}`);
      return data.publicUrl;
    },
  },
};

// ---------------------------------------------------------------------------
// File validation
// ---------------------------------------------------------------------------

export function validateFile(
  file: File,
  options: { maxSize: number; allowedTypes: string[] }
): { valid: boolean; error?: string } {
  if (file.size > options.maxSize) {
    return {
      valid: false,
      error: `File size must be less than ${(options.maxSize / 1024 / 1024).toFixed(1)} MB`,
    };
  }
  if (!options.allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type not allowed. Allowed: ${options.allowedTypes.join(', ')}`,
    };
  }
  return { valid: true };
}

// ---------------------------------------------------------------------------
// Upload / delete
// ---------------------------------------------------------------------------

export async function uploadFile(
  bucket: string,
  path: string,
  file: File,
  options?: { cacheControl?: string; upsert?: boolean }
) {
  const supabase = createClient();
  const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: options?.cacheControl ?? '3600',
    upsert: options?.upsert ?? true,
  });
  if (error) throw error;
  return data;
}

export async function deleteStorageFile(bucket: string, path: string) {
  const supabase = createClient();
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) throw error;
  return true;
}
