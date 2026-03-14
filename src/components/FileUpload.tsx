'use client';

import React, { useState, useRef } from 'react';
import { Button } from './Button';
import { storagePath, uploadFile, validateFile, STORAGE_BUCKETS } from '@/lib/supabase';

interface FileUploadProps {
  bucket: keyof typeof STORAGE_BUCKETS;
  pathGenerator: (...args: any[]) => string;
  allowedTypes: string[];
  maxSize: number;
  onSuccess?: (url: string) => void;
  onError?: (error: string) => void;
  buttonText?: string;
  accept?: string;
}

export function FileUpload({
  bucket,
  pathGenerator,
  allowedTypes,
  maxSize,
  onSuccess,
  onError,
  buttonText = 'Upload File',
  accept = '*',
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      handleFileSelect(droppedFile);
    }
  };

  const handleFileSelect = (selectedFile: File) => {
    // Validate file
    const validation = validateFile(selectedFile, {
      maxSize,
      allowedTypes,
    });

    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      onError?.(validation.error || 'Invalid file');
      return;
    }

    setFile(selectedFile);
    setError('');
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      setIsUploading(true);
      setProgress(0);
      setError('');

      // Generate file path
      const path = pathGenerator();

      // Upload file
      const result = await uploadFile(STORAGE_BUCKETS[bucket], path, file, {
        cacheControl: '3600',
        upsert: true,
      });

      // Get file URL
      let url = '';
      if (bucket === 'models') {
        // For private bucket, get signed URL
        // This would require additional logic to get signed URL
        // For now, we'll return the path
        url = path;
      } else {
        // For public buckets, get public URL
        switch (bucket) {
          case 'avatars':
            url = storagePath.avatar.getUrl(path.split('/')[0]);
            break;
          case 'character-covers':
            url = storagePath.characterCover.getUrl(path.split('/')[0], path.split('/')[1]);
            break;
          case 'model-previews':
            url = storagePath.modelPreview.getUrl(path.split('/')[0], path.split('/')[1]);
            break;
          default:
            url = path;
        }
      }

      setProgress(100);
      onSuccess?.(url);
      setFile(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsUploading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  return (
    <div className="w-full">
      <div
        className={`border-2 border-dashed rounded-lg p-6 transition-colors ${isDragging ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-gray-400'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          className="hidden"
        />

        {!file ? (
          <div className="text-center">
            <p className="text-gray-500 mb-4">
              Drag and drop your file here, or
            </p>
            <Button onClick={handleButtonClick}>
              {buttonText}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <Button
                onClick={() => setFile(null)}
                variant="outline"
                size="sm"
              >
                Remove
              </Button>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              {isUploading && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}
              <Button
                onClick={handleUpload}
                disabled={isUploading || !!error}
                className="w-full"
              >
                {isUploading ? 'Uploading...' : 'Upload'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function AvatarUpload({ userId, onSuccess, onError }: {
  userId: string;
  onSuccess?: (url: string) => void;
  onError?: (error: string) => void;
}) {
  return (
    <FileUpload
      bucket="AVATARS"
      pathGenerator={() => storagePath.avatar.getPath(userId, 'webp')}
      allowedTypes={['image/webp', 'image/png', 'image/jpeg']}
      maxSize={512 * 1024} // 512 KB
      onSuccess={onSuccess}
      onError={onError}
      buttonText="Upload Avatar"
      accept="image/*"
    />
  );
}

export function CharacterCoverUpload({
  userId,
  characterId,
  onSuccess,
  onError,
}: {
  userId: string;
  characterId: string;
  onSuccess?: (url: string) => void;
  onError?: (error: string) => void;
}) {
  return (
    <FileUpload
      bucket="CHARACTER_COVERS"
      pathGenerator={() => storagePath.characterCover.getPath(userId, characterId, 'webp')}
      allowedTypes={['image/webp', 'image/png', 'image/jpeg']}
      maxSize={800 * 1024} // 800 KB
      onSuccess={onSuccess}
      onError={onError}
      buttonText="Upload Cover"
      accept="image/*"
    />
  );
}

export function ModelPreviewUpload({
  userId,
  characterId,
  onSuccess,
  onError,
}: {
  userId: string;
  characterId: string;
  onSuccess?: (url: string) => void;
  onError?: (error: string) => void;
}) {
  return (
    <FileUpload
      bucket="MODEL_PREVIEWS"
      pathGenerator={() => storagePath.modelPreview.getPath(userId, characterId, 'webp')}
      allowedTypes={['image/webp', 'image/png', 'image/jpeg']}
      maxSize={600 * 1024} // 600 KB
      onSuccess={onSuccess}
      onError={onError}
      buttonText="Upload Preview"
      accept="image/*"
    />
  );
}

export function ModelUpload({
  userId,
  characterId,
  modelId,
  onSuccess,
  onError,
}: {
  userId: string;
  characterId: string;
  modelId: string;
  onSuccess?: (url: string) => void;
  onError?: (error: string) => void;
}) {
  return (
    <FileUpload
      bucket="MODELS"
      pathGenerator={() => storagePath.model.getPath(userId, characterId, modelId, 'glb')}
      allowedTypes={['model/gltf-binary', 'application/octet-stream']}
      maxSize={10 * 1024 * 1024} // 10 MB
      onSuccess={onSuccess}
      onError={onError}
      buttonText="Upload 3D Model"
      accept=".glb"
    />
  );
}
