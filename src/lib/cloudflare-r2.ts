import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, GetObjectCommandOutput } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { r2Config } from '@/lib/config';

// Create S3 client for Cloudflare R2
const s3Client = new S3Client({
  region: 'auto',
  credentials: {
    accessKeyId: r2Config.accessKeyId,
    secretAccessKey: r2Config.secretAccessKey,
  },
  endpoint: r2Config.endpoint,
});

// R2 bucket names
export const R2_BUCKETS = {
  MODELS: 'models',
  EXPORTS: 'exports',
  TEXTURES: 'textures',
} as const;

// R2 path utilities
export const r2Path = {
  // 3D model paths
  model: {
    /**
     * Get 3D model file path
     * @param userId - User ID
     * @param characterId - Character ID
     * @param extension - File extension (default: glb)
     */
    getPath: (userId: string, characterId: string, extension: string = 'glb'): string => {
      return `${R2_BUCKETS.MODELS}/${userId}/${characterId}/model.${extension}`;
    },

    /**
     * Get 3D model history file path
     * @param userId - User ID
     * @param characterId - Character ID
     * @param timestamp - Timestamp
     * @param extension - File extension (default: glb)
     */
    getHistoryPath: (userId: string, characterId: string, timestamp: string, extension: string = 'glb'): string => {
      return `${R2_BUCKETS.MODELS}/${userId}/${characterId}/history/${timestamp}/model.${extension}`;
    },

    /**
     * Get 3D model URL (signed URL)
     * @param userId - User ID
     * @param characterId - Character ID
     * @param extension - File extension (default: glb)
     * @param expiresIn - Expiration time in seconds (default: 3600)
     */
    getUrl: async (userId: string, characterId: string, extension: string = 'glb', expiresIn: number = 3600): Promise<string> => {
      const path = r2Path.model.getPath(userId, characterId, extension);
      const command = new GetObjectCommand({
        Bucket: r2Config.bucketName,
        Key: path,
      });

      const signedUrl = await getSignedUrl(s3Client, command, { expiresIn });
      return signedUrl;
    },
  },

  // Export paths
  export: {
    /**
     * Get export file path
     * @param userId - User ID
     * @param timestamp - Timestamp
     * @param fileName - File name
     */
    getPath: (userId: string, timestamp: string, fileName: string): string => {
      return `${R2_BUCKETS.EXPORTS}/${userId}/${timestamp}/${fileName}`;
    },

    /**
     * Get export URL (signed URL)
     * @param userId - User ID
     * @param timestamp - Timestamp
     * @param fileName - File name
     * @param expiresIn - Expiration time in seconds (default: 3600)
     */
    getUrl: async (userId: string, timestamp: string, fileName: string, expiresIn: number = 3600): Promise<string> => {
      const path = r2Path.export.getPath(userId, timestamp, fileName);
      const command = new GetObjectCommand({
        Bucket: r2Config.bucketName,
        Key: path,
      });

      const signedUrl = await getSignedUrl(s3Client, command, { expiresIn });
      return signedUrl;
    },
  },

  // Texture paths
  texture: {
    /**
     * Get texture file path
     * @param userId - User ID
     * @param characterId - Character ID
     * @param textureName - Texture name
     * @param extension - File extension
     */
    getPath: (userId: string, characterId: string, textureName: string, extension: string): string => {
      return `${R2_BUCKETS.TEXTURES}/${userId}/${characterId}/${textureName}.${extension}`;
    },

    /**
     * Get texture URL (signed URL)
     * @param userId - User ID
     * @param characterId - Character ID
     * @param textureName - Texture name
     * @param extension - File extension
     * @param expiresIn - Expiration time in seconds (default: 3600)
     */
    getUrl: async (userId: string, characterId: string, textureName: string, extension: string, expiresIn: number = 3600): Promise<string> => {
      const path = r2Path.texture.getPath(userId, characterId, textureName, extension);
      const command = new GetObjectCommand({
        Bucket: r2Config.bucketName,
        Key: path,
      });

      const signedUrl = await getSignedUrl(s3Client, command, { expiresIn });
      return signedUrl;
    },
  },
};

// Upload file to R2
export const uploadToR2 = async (
  key: string,
  file: Buffer | File | Blob,
  contentType: string
) => {
  const command = new PutObjectCommand({
    Bucket: r2Config.bucketName,
    Key: key,
    Body: file,
    ContentType: contentType,
  });

  const response = await s3Client.send(command);
  return response;
};

// Download file from R2
export const downloadFromR2 = async (key: string): Promise<GetObjectCommandOutput> => {
  const command = new GetObjectCommand({
    Bucket: r2Config.bucketName,
    Key: key,
  });

  const response = await s3Client.send(command);
  return response;
};

// Delete file from R2
export const deleteFromR2 = async (key: string) => {
  const command = new DeleteObjectCommand({
    Bucket: r2Config.bucketName,
    Key: key,
  });

  const response = await s3Client.send(command);
  return response;
};

export default s3Client;