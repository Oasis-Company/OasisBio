import { uploadFile as uploadToSupabase, deleteStorageFile as deleteFromSupabase, STORAGE_BUCKETS } from './supabase/storage';
import { uploadToR2, deleteFromR2, r2Path } from './cloudflare-r2';

// Storage types
export type StorageType = 'supabase' | 'r2';

// Storage utilities
export const storage = {
  // Upload file to appropriate storage based on type and size
  upload: async (
    file: File,
    options: {
      type: 'avatar' | 'character-cover' | 'model-preview' | 'model' | 'export' | 'texture';
      userId: string;
      characterId?: string;
      modelId?: string;
      textureName?: string;
      exportFileName?: string;
      exportTimestamp?: string;
    }
  ) => {
    if (options.type === 'model' || options.type === 'export' || options.type === 'texture') {
      // Use R2 for large files
      let key: string;
      let contentType: string;

      switch (options.type) {
        case 'model':
          if (!options.characterId) throw new Error('Character ID is required for model upload');
          key = r2Path.model.getPath(options.userId, options.characterId, 'glb');
          contentType = 'model/gltf-binary';
          break;
        case 'export':
          if (!options.exportFileName || !options.exportTimestamp) {
            throw new Error('Export file name and timestamp are required');
          }
          key = r2Path.export.getPath(options.userId, options.exportTimestamp, options.exportFileName);
          contentType = 'application/zip';
          break;
        case 'texture':
          if (!options.characterId || !options.textureName) {
            throw new Error('Character ID and texture name are required');
          }
          const extension = file.name.split('.').pop() || 'png';
          key = r2Path.texture.getPath(options.userId, options.characterId, options.textureName, extension);
          contentType = file.type;
          break;
        default:
          throw new Error('Invalid storage type');
      }

      // Convert File to Buffer for R2
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const result = await uploadToR2(key, buffer, contentType);
      return { storage: 'r2' as StorageType, key, result };
    } else {
      // Use Supabase for small files
      let bucket: keyof typeof STORAGE_BUCKETS;
      let path: string;

      switch (options.type) {
        case 'avatar':
          bucket = 'AVATARS';
          path = `${options.userId}/avatar.webp`;
          break;
        case 'character-cover':
          if (!options.characterId) throw new Error('Character ID is required for cover upload');
          bucket = 'CHARACTER_COVERS';
          path = `${options.userId}/${options.characterId}/cover.webp`;
          break;
        case 'model-preview':
          if (!options.characterId) throw new Error('Character ID is required for preview upload');
          bucket = 'MODEL_PREVIEWS';
          path = `${options.userId}/${options.characterId}/preview.webp`;
          break;
        default:
          throw new Error('Invalid storage type');
      }

      const result = await uploadToSupabase(STORAGE_BUCKETS[bucket], path, file);
      return { storage: 'supabase' as StorageType, key: path, result };
    }
  },

  // Delete file from appropriate storage
  delete: async (
    options: {
      type: 'avatar' | 'character-cover' | 'model-preview' | 'model' | 'export' | 'texture';
      userId: string;
      characterId?: string;
      modelId?: string;
      textureName?: string;
      exportFileName?: string;
      exportTimestamp?: string;
    }
  ) => {
    if (options.type === 'model' || options.type === 'export' || options.type === 'texture') {
      // Delete from R2
      let key: string;

      switch (options.type) {
        case 'model':
          if (!options.characterId) throw new Error('Character ID is required for model deletion');
          key = r2Path.model.getPath(options.userId, options.characterId, 'glb');
          break;
        case 'export':
          if (!options.exportFileName || !options.exportTimestamp) {
            throw new Error('Export file name and timestamp are required');
          }
          key = r2Path.export.getPath(options.userId, options.exportTimestamp, options.exportFileName);
          break;
        case 'texture':
          if (!options.characterId || !options.textureName) {
            throw new Error('Character ID and texture name are required');
          }
          // Assuming texture extension is png for simplicity
          key = r2Path.texture.getPath(options.userId, options.characterId, options.textureName, 'png');
          break;
        default:
          throw new Error('Invalid storage type');
      }

      const result = await deleteFromR2(key);
      return { storage: 'r2' as StorageType, result };
    } else {
      // Delete from Supabase
      let bucket: keyof typeof STORAGE_BUCKETS;
      let path: string;

      switch (options.type) {
        case 'avatar':
          bucket = 'AVATARS';
          path = `${options.userId}/avatar.webp`;
          break;
        case 'character-cover':
          if (!options.characterId) throw new Error('Character ID is required for cover deletion');
          bucket = 'CHARACTER_COVERS';
          path = `${options.userId}/${options.characterId}/cover.webp`;
          break;
        case 'model-preview':
          if (!options.characterId) throw new Error('Character ID is required for preview deletion');
          bucket = 'MODEL_PREVIEWS';
          path = `${options.userId}/${options.characterId}/preview.webp`;
          break;
        default:
          throw new Error('Invalid storage type');
      }

      const result = await deleteFromSupabase(STORAGE_BUCKETS[bucket], path);
      return { storage: 'supabase' as StorageType, result };
    }
  },

  // Get file URL from appropriate storage
  getUrl: async (
    options: {
      type: 'avatar' | 'character-cover' | 'model-preview' | 'model' | 'export' | 'texture';
      userId: string;
      characterId?: string;
      textureName?: string;
      exportFileName?: string;
      exportTimestamp?: string;
      expiresIn?: number;
    }
  ): Promise<string> => {
    if (options.type === 'model' || options.type === 'export' || options.type === 'texture') {
      // Get URL from R2
      switch (options.type) {
        case 'model':
          if (!options.characterId) throw new Error('Character ID is required for model URL');
          return await r2Path.model.getUrl(options.userId, options.characterId, 'glb', options.expiresIn);
        case 'export':
          if (!options.exportFileName || !options.exportTimestamp) {
            throw new Error('Export file name and timestamp are required');
          }
          return await r2Path.export.getUrl(options.userId, options.exportTimestamp, options.exportFileName, options.expiresIn);
        case 'texture':
          if (!options.characterId || !options.textureName) {
            throw new Error('Character ID and texture name are required');
          }
          // Assuming texture extension is png for simplicity
          return await r2Path.texture.getUrl(options.userId, options.characterId, options.textureName, 'png', options.expiresIn);
        default:
          throw new Error('Invalid storage type');
      }
    } else {
      // Get URL from Supabase storage using existing path helpers
      switch (options.type) {
        case 'avatar':
          return await (await import('@/lib/supabase/storage')).storagePath.avatar.getUrl(options.userId, 'webp');
        case 'character-cover':
          if (!options.characterId) throw new Error('Character ID is required for cover URL');
          return await (await import('@/lib/supabase/storage')).storagePath.characterCover.getUrl(options.userId, options.characterId, 'webp');
        case 'model-preview':
          if (!options.characterId) throw new Error('Character ID is required for preview URL');
          return await (await import('@/lib/supabase/storage')).storagePath.modelPreview.getUrl(options.userId, options.characterId, 'webp');
        default:
          throw new Error('Invalid storage type');
      }
    }
  },
};

// Storage constants
export const STORAGE_LIMITS = {
  MAX_MODEL_SIZE: 12 * 1024 * 1024, // 12 MB
  MAX_AVATAR_SIZE: 512 * 1024, // 512 KB
  MAX_COVER_SIZE: 800 * 1024, // 800 KB
  MAX_PREVIEW_SIZE: 600 * 1024, // 600 KB
  MAX_EXPORT_SIZE: 20 * 1024 * 1024, // 20 MB per character
};

// Storage validation
export const validateStorageFile = (file: File, type: 'avatar' | 'character-cover' | 'model-preview' | 'model' | 'export') => {
  let maxSize: number;
  let allowedTypes: string[];

  switch (type) {
    case 'avatar':
      maxSize = STORAGE_LIMITS.MAX_AVATAR_SIZE;
      allowedTypes = ['image/webp', 'image/png', 'image/jpeg'];
      break;
    case 'character-cover':
      maxSize = STORAGE_LIMITS.MAX_COVER_SIZE;
      allowedTypes = ['image/webp', 'image/png', 'image/jpeg'];
      break;
    case 'model-preview':
      maxSize = STORAGE_LIMITS.MAX_PREVIEW_SIZE;
      allowedTypes = ['image/webp', 'image/png', 'image/jpeg'];
      break;
    case 'model':
      maxSize = STORAGE_LIMITS.MAX_MODEL_SIZE;
      allowedTypes = ['model/gltf-binary', 'application/octet-stream'];
      break;
    case 'export':
      maxSize = STORAGE_LIMITS.MAX_EXPORT_SIZE;
      allowedTypes = ['application/zip'];
      break;
    default:
      throw new Error('Invalid storage type');
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size must be less than ${(maxSize / 1024 / 1024).toFixed(1)} MB`,
    };
  }

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`,
    };
  }

  return { valid: true };
};