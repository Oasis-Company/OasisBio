-- ============================================================
-- OasisBio Database: Additional Indexes
-- 
-- 执行方式: Supabase 控制台 → SQL Editor → 粘贴执行
-- 
-- 说明:
--   Prisma schema 已定义了基础索引，这里补充一些
--   高频查询场景需要的复合索引和缺失索引。
-- ============================================================

-- world_items: updatedAt 索引（用于排序）
CREATE INDEX IF NOT EXISTS idx_world_items_updated_at
  ON public.world_items (oasis_bio_id, updated_at DESC);

-- oasis_bios: 公开探索页面的复合索引
CREATE INDEX IF NOT EXISTS idx_oasis_bios_public_explore
  ON public.oasis_bios (visibility, status, "updatedAt" DESC)
  WHERE visibility = 'public';

-- profiles: 用户名搜索（已有 unique index，补充 lower() 索引支持大小写不敏感搜索）
CREATE INDEX IF NOT EXISTS idx_profiles_username_lower
  ON public.profiles (lower(username));

-- dcos_files: 按 oasisBio + status 过滤（常见查询）
CREATE INDEX IF NOT EXISTS idx_dcos_files_oasis_bio_status
  ON public.dcos_files (oasis_bio_id, status);

-- export_history: 用户最近导出记录
CREATE INDEX IF NOT EXISTS idx_export_history_user_created
  ON public.export_history (user_id, created_at DESC);

-- ============================================================
-- 完成！
-- ============================================================
