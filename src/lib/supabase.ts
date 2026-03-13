import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dhkgfdllgtmbkwcbubqt.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '*********************************************************************************************************************************************************************************************************';

export const supabase = createClient(supabaseUrl, supabaseKey);

// 存储桶名称
export const STORAGE_BUCKETS = {
  MODELS: 'oasisbio-models',
  IMAGES: 'oasisbio-images',
  DOCUMENTS: 'oasisbio-documents',
};

// 存储路径规则
export const getModelFilePath = (userId: string, modelId: string, format: string = 'glb') => {
  return `models/${userId}/${modelId}.${format}`;
};

export const getModelPreviewPath = (userId: string, modelId: string, extension: string = 'png') => {
  return `models/${userId}/previews/${modelId}.${extension}`;
};

export const getImageFilePath = (userId: string, imageId: string, extension: string = 'png') => {
  return `images/${userId}/${imageId}.${extension}`;
};

export const getCoverImagePath = (userId: string, oasisBioId: string, extension: string = 'png') => {
  return `images/${userId}/covers/${oasisBioId}.${extension}`;
};

export const getDocumentFilePath = (userId: string, documentId: string, extension: string = 'md') => {
  return `documents/${userId}/${documentId}.${extension}`;
};

// 文件命名规范
export const generateFileName = (prefix: string, extension: string) => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${prefix}_${timestamp}_${random}.${extension}`;
};

// 验证文件类型
export const validateFileType = (fileName: string, allowedTypes: string[]) => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  return extension ? allowedTypes.includes(extension) : false;
};

// 生成唯一的文件ID
export const generateFileId = () => {
  return crypto.randomUUID();
};
