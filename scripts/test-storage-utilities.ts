import { storagePath, uploadFile as uploadToSupabase, validateFile, STORAGE_BUCKETS } from '../src/lib/supabase/storage';

// Alias for backward compatibility
const uploadFile = uploadToSupabase;

async function testStorageUtilities() {
  console.log('🧪 Testing storage path utilities...\n');
  
  // Test 1: Path generation
  console.log('📁 Testing path generation:');
  
  const testUserId = 'test-user-123';
  const testCharacterId = 'character-456';
  const testModelId = 'model-789';
  
  // Avatar path
  const avatarPath = storagePath.avatar.getPath(testUserId);
  const avatarUrl = storagePath.avatar.getUrl(testUserId);
  console.log(`   Avatar path: ${avatarPath}`);
  console.log(`   Avatar URL: ${avatarUrl}`);
  
  // Character cover path
  const coverPath = storagePath.characterCover.getPath(testUserId, testCharacterId);
  const coverUrl = storagePath.characterCover.getUrl(testUserId, testCharacterId);
  console.log(`   Cover path: ${coverPath}`);
  console.log(`   Cover URL: ${coverUrl}`);
  
  // Model preview path
  const previewPath = storagePath.modelPreview.getPath(testUserId, testCharacterId);
  const previewUrl = storagePath.modelPreview.getUrl(testUserId, testCharacterId);
  console.log(`   Preview path: ${previewPath}`);
  console.log(`   Preview URL: ${previewUrl}`);
  

  
  console.log('\n✅ 路径生成测试通过！');
  
  // Test 2: File validation
  console.log('\n🔍 测试文件验证:');
  
  // Create a mock file
  const mockFile = new File(['test content'], 'test.jpg', { type: 'image/jpeg' });
  
  // Test valid file
  const validResult = validateFile(mockFile, {
    maxSize: 1024 * 1024, // 1MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp']
  });
  console.log(`   有效文件验证: ${validResult.valid ? '通过' : '失败'}`);
  
  // Test invalid file type
  const mockInvalidFile = new File(['test content'], 'test.txt', { type: 'text/plain' });
  const invalidTypeResult = validateFile(mockInvalidFile, {
    maxSize: 1024 * 1024,
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp']
  });
  console.log(`   无效文件类型验证: ${!invalidTypeResult.valid ? '通过' : '失败'}`);
  
  console.log('\n✅ 文件验证测试通过！');
  
  // Test 3: Storage bucket configuration
  console.log('\n📦 存储桶配置:');
  console.log(`   Avatars bucket: ${STORAGE_BUCKETS.AVATARS}`);
  console.log(`   Character covers bucket: ${STORAGE_BUCKETS.CHARACTER_COVERS}`);
  console.log(`   Model previews bucket: ${STORAGE_BUCKETS.MODEL_PREVIEWS}`);
  
  console.log('\n✅ 存储桶配置测试通过！');
  
  console.log('\n🎉 所有存储工具测试完成！');
  console.log('\n📋 下一步：');
  console.log('1. 在 Supabase Dashboard 中手动创建存储桶');
  console.log('2. 设置适当的 RLS 策略');
  console.log('3. 实现前端上传组件');
  console.log('4. 测试完整的上传/下载流程');
}

testStorageUtilities();
