-- ============================================================
-- OasisBio Storage: Bucket Policies
-- 
-- 执行方式: Supabase 控制台 → SQL Editor → 粘贴执行
-- 
-- 前提: 需要先在 Supabase 控制台 Storage 页面创建以下 bucket:
--   - avatars (public)
--   - character-covers (public)
--   - model-previews (public)
-- ============================================================

-- ============================================================
-- avatars bucket
-- ============================================================

-- 任何人可以查看头像（public bucket）
CREATE POLICY "avatars: public read"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'avatars');

-- 用户只能上传/更新/删除自己的头像
-- 路径格式: {userId}/avatar.{ext}
CREATE POLICY "avatars: owner write"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "avatars: owner update"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "avatars: owner delete"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- ============================================================
-- character-covers bucket
-- ============================================================

CREATE POLICY "character-covers: public read"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'character-covers');

-- 路径格式: {userId}/{characterId}/cover.{ext}
CREATE POLICY "character-covers: owner write"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'character-covers'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "character-covers: owner update"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'character-covers'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "character-covers: owner delete"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'character-covers'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- ============================================================
-- model-previews bucket
-- ============================================================

CREATE POLICY "model-previews: public read"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'model-previews');

CREATE POLICY "model-previews: owner write"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'model-previews'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "model-previews: owner update"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'model-previews'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "model-previews: owner delete"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'model-previews'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- ============================================================
-- 完成！
-- ============================================================
