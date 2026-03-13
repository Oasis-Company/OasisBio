const { createClient } = require('@supabase/supabase-js');
const path = require('path');

// 加载环境变量
if (require('fs').existsSync(path.resolve(__dirname, '..', '.env'))) {
  require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
}

// 获取环境变量
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase configuration');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl);
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? 'Set' : 'Not set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const STORAGE_BUCKETS = {
  MODELS: 'oasisbio-models',
  IMAGES: 'oasisbio-images',
  DOCUMENTS: 'oasisbio-documents',
};

async function createBucket(bucketName, public = false) {
  try {
    const { data, error } = await supabase.storage.createBucket(bucketName, {
      public,
      allowedMimeTypes: public ? ['image/*'] : ['*/*'],
      fileSizeLimit: 50 * 1024 * 1024, // 50MB
    });

    if (error) {
      if (error.code === 'DuplicateBucketName') {
        console.log(`Bucket ${bucketName} already exists`);
        return true;
      }
      console.error(`Error creating bucket ${bucketName}:`, error);
      return false;
    }

    console.log(`Successfully created bucket ${bucketName}`);
    return true;
  } catch (error) {
    console.error(`Exception creating bucket ${bucketName}:`, error);
    return false;
  }
}

async function main() {
  console.log('Initializing Supabase storage...');

  // 创建模型存储桶（私有的，需要认证）
  await createBucket(STORAGE_BUCKETS.MODELS, false);

  // 创建图像存储桶（公共的，用于封面图等）
  await createBucket(STORAGE_BUCKETS.IMAGES, true);

  // 创建文档存储桶（私有的，需要认证）
  await createBucket(STORAGE_BUCKETS.DOCUMENTS, false);

  console.log('Storage initialization completed');
  console.log('Note: RLS policies should be set up manually in Supabase Dashboard');
}

main().catch(console.error);
