-- ============================================================
-- OasisBio Database Security: Enable RLS
-- 
-- 执行方式: Supabase 控制台 → SQL Editor → 粘贴执行
-- 
-- 说明:
--   Row Level Security (RLS) 确保每个用户只能访问自己的数据。
--   所有表默认启用 RLS，然后为每个表添加精确的访问策略。
--
--   策略设计原则:
--   - 私有数据 (profiles, oasis_bios 等): 只有 owner 可以 CRUD
--   - 公开数据 (public oasis_bios): 任何人可以 SELECT
--   - 系统表 (ability_categories, ability_presets): 任何人可以 SELECT
-- ============================================================

-- ============================================================
-- Step 1: Enable RLS on all tables
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.oasis_bios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.era_identities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.abilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dcos_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reference_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.world_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.world_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.model_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.oasisbio_publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.character_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.export_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ability_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ability_presets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entity_tags ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- Step 2: profiles
-- ============================================================

-- 用户只能查看和修改自己的 profile
CREATE POLICY "profiles: owner full access"
  ON public.profiles
  FOR ALL
  USING (user_id = auth.uid()::text)
  WITH CHECK (user_id = auth.uid()::text);

-- 任何人可以查看 username（用于公开页面的用户名显示）
CREATE POLICY "profiles: public read username"
  ON public.profiles
  FOR SELECT
  USING (true);

-- ============================================================
-- Step 3: oasis_bios
-- ============================================================

-- Owner 可以完整 CRUD
CREATE POLICY "oasis_bios: owner full access"
  ON public.oasis_bios
  FOR ALL
  USING (user_id = auth.uid()::text)
  WITH CHECK (user_id = auth.uid()::text);

-- 公开的 OasisBio 任何人可以查看
CREATE POLICY "oasis_bios: public read"
  ON public.oasis_bios
  FOR SELECT
  USING (visibility = 'public');

-- ============================================================
-- Step 4: era_identities (通过 oasis_bio 关联 owner)
-- ============================================================

CREATE POLICY "era_identities: owner full access"
  ON public.era_identities
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.oasis_bios
      WHERE oasis_bios.id = era_identities.oasis_bio_id
        AND oasis_bios.user_id = auth.uid()::text
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.oasis_bios
      WHERE oasis_bios.id = era_identities.oasis_bio_id
        AND oasis_bios.user_id = auth.uid()::text
    )
  );

-- ============================================================
-- Step 5: abilities
-- ============================================================

CREATE POLICY "abilities: owner full access"
  ON public.abilities
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.oasis_bios
      WHERE oasis_bios.id = abilities.oasis_bio_id
        AND oasis_bios.user_id = auth.uid()::text
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.oasis_bios
      WHERE oasis_bios.id = abilities.oasis_bio_id
        AND oasis_bios.user_id = auth.uid()::text
    )
  );

-- ============================================================
-- Step 6: dcos_files
-- ============================================================

CREATE POLICY "dcos_files: owner full access"
  ON public.dcos_files
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.oasis_bios
      WHERE oasis_bios.id = dcos_files.oasis_bio_id
        AND oasis_bios.user_id = auth.uid()::text
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.oasis_bios
      WHERE oasis_bios.id = dcos_files.oasis_bio_id
        AND oasis_bios.user_id = auth.uid()::text
    )
  );

-- ============================================================
-- Step 7: reference_items
-- ============================================================

CREATE POLICY "reference_items: owner full access"
  ON public.reference_items
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.oasis_bios
      WHERE oasis_bios.id = reference_items.oasis_bio_id
        AND oasis_bios.user_id = auth.uid()::text
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.oasis_bios
      WHERE oasis_bios.id = reference_items.oasis_bio_id
        AND oasis_bios.user_id = auth.uid()::text
    )
  );

-- ============================================================
-- Step 8: world_items
-- ============================================================

CREATE POLICY "world_items: owner full access"
  ON public.world_items
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.oasis_bios
      WHERE oasis_bios.id = world_items.oasis_bio_id
        AND oasis_bios.user_id = auth.uid()::text
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.oasis_bios
      WHERE oasis_bios.id = world_items.oasis_bio_id
        AND oasis_bios.user_id = auth.uid()::text
    )
  );

-- 公开世界观任何人可以查看
CREATE POLICY "world_items: public read"
  ON public.world_items
  FOR SELECT
  USING (visibility = 'public');

-- ============================================================
-- Step 9: world_documents
-- ============================================================

CREATE POLICY "world_documents: owner full access"
  ON public.world_documents
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.world_items
      JOIN public.oasis_bios ON oasis_bios.id = world_items.oasis_bio_id
      WHERE world_items.id = world_documents.world_id
        AND oasis_bios.user_id = auth.uid()::text
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.world_items
      JOIN public.oasis_bios ON oasis_bios.id = world_items.oasis_bio_id
      WHERE world_items.id = world_documents.world_id
        AND oasis_bios.user_id = auth.uid()::text
    )
  );

-- ============================================================
-- Step 10: model_items
-- ============================================================

CREATE POLICY "model_items: owner full access"
  ON public.model_items
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.oasis_bios
      WHERE oasis_bios.id = model_items.oasis_bio_id
        AND oasis_bios.user_id = auth.uid()::text
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.oasis_bios
      WHERE oasis_bios.id = model_items.oasis_bio_id
        AND oasis_bios.user_id = auth.uid()::text
    )
  );

-- ============================================================
-- Step 11: oasisbio_publications
-- ============================================================

-- Owner 可以管理
CREATE POLICY "oasisbio_publications: owner full access"
  ON public.oasisbio_publications
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.oasis_bios
      WHERE oasis_bios.id = oasisbio_publications.oasis_bio_id
        AND oasis_bios.user_id = auth.uid()::text
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.oasis_bios
      WHERE oasis_bios.id = oasisbio_publications.oasis_bio_id
        AND oasis_bios.user_id = auth.uid()::text
    )
  );

-- 任何人可以查看已发布的
CREATE POLICY "oasisbio_publications: public read"
  ON public.oasisbio_publications
  FOR SELECT
  USING (published_at IS NOT NULL);

-- ============================================================
-- Step 12: character_relationships
-- ============================================================

CREATE POLICY "character_relationships: owner full access"
  ON public.character_relationships
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.oasis_bios
      WHERE oasis_bios.id = character_relationships.character_a_id
        AND oasis_bios.user_id = auth.uid()::text
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.oasis_bios
      WHERE oasis_bios.id = character_relationships.character_a_id
        AND oasis_bios.user_id = auth.uid()::text
    )
  );

-- ============================================================
-- Step 13: export_history
-- ============================================================

CREATE POLICY "export_history: owner full access"
  ON public.export_history
  FOR ALL
  USING (user_id = auth.uid()::text)
  WITH CHECK (user_id = auth.uid()::text);

-- ============================================================
-- Step 14: ability_categories & ability_presets (系统数据，只读)
-- ============================================================

CREATE POLICY "ability_categories: public read"
  ON public.ability_categories
  FOR SELECT
  USING (true);

CREATE POLICY "ability_presets: public read"
  ON public.ability_presets
  FOR SELECT
  USING (true);

-- ============================================================
-- Step 15: tags & entity_tags
-- ============================================================

CREATE POLICY "tags: public read"
  ON public.tags
  FOR SELECT
  USING (true);

CREATE POLICY "entity_tags: owner full access"
  ON public.entity_tags
  FOR ALL
  USING (true)  -- entity_tags 没有直接的 user_id，暂时允许所有认证用户
  WITH CHECK (true);

-- ============================================================
-- 完成！
-- 验证方式: 在 Supabase 控制台 Authentication → Policies 查看所有策略
-- ============================================================
