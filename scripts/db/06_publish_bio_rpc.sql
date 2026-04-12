-- ============================================================
-- OasisBio: publish_bio RPC functions
-- 
-- 执行方式: Supabase 控制台 → SQL Editor → 粘贴执行
-- 
-- 包含两个函数:
--   1. validate_publishable_bio(bio_id, actor_id) → { ok, errors }
--   2. publish_bio(bio_id, actor_id, request_id, visibility) → { ok, slug, published_at }
-- ============================================================

-- ============================================================
-- 1. validate_publishable_bio
--    检查一个 OasisBio 是否满足发布条件，返回校验结果。
--    不做任何写操作，纯读。
-- ============================================================

CREATE OR REPLACE FUNCTION public.validate_publishable_bio(
  p_bio_id   text,
  p_actor_id text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER  -- 以函数 owner 权限运行，绕过 RLS
AS $$
DECLARE
  v_bio        record;
  v_errors     text[] := '{}';
BEGIN
  -- 查找 bio
  SELECT * INTO v_bio
  FROM public.oasis_bios
  WHERE id = p_bio_id;

  -- 不存在
  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'errors', ARRAY['Bio not found']);
  END IF;

  -- 所有权校验
  IF v_bio.user_id != p_actor_id THEN
    RETURN jsonb_build_object('ok', false, 'errors', ARRAY['You do not own this bio']);
  END IF;

  -- 必填字段校验
  IF v_bio.title IS NULL OR trim(v_bio.title) = '' THEN
    v_errors := array_append(v_errors, 'Title is required');
  END IF;

  IF v_bio.summary IS NULL OR trim(v_bio.summary) = '' THEN
    v_errors := array_append(v_errors, 'Summary is required');
  END IF;

  -- 返回结果
  IF array_length(v_errors, 1) > 0 THEN
    RETURN jsonb_build_object('ok', false, 'errors', v_errors);
  END IF;

  RETURN jsonb_build_object('ok', true, 'errors', '[]'::jsonb);
END;
$$;

-- ============================================================
-- 2. publish_bio
--    原子事务：校验 → 状态切换 → publication upsert →
--    审计日志 → domain_events 插入。
--    所有操作在一个事务内完成，任何失败都回滚。
-- ============================================================

CREATE OR REPLACE FUNCTION public.publish_bio(
  p_bio_id     text,
  p_actor_id   text,
  p_request_id text,
  p_visibility text DEFAULT 'public'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_bio          record;
  v_validation   jsonb;
  v_pub_slug     text;
  v_published_at timestamptz;
BEGIN
  -- 1. 校验
  v_validation := public.validate_publishable_bio(p_bio_id, p_actor_id);
  IF NOT (v_validation->>'ok')::boolean THEN
    RETURN v_validation;
  END IF;

  -- 2. 获取 bio
  SELECT * INTO v_bio FROM public.oasis_bios WHERE id = p_bio_id;

  -- 3. 生成 public slug（使用 bio slug，确保唯一）
  v_pub_slug := v_bio.slug;

  -- 4. 设置 published_at
  v_published_at := COALESCE(v_bio.published_at, now());

  -- 5. 更新 oasis_bio 状态
  UPDATE public.oasis_bios
  SET
    visibility   = p_visibility,
    status       = 'active',
    published_at = v_published_at,
    updated_at   = now()
  WHERE id = p_bio_id;

  -- 6. Upsert publication 记录
  INSERT INTO public.oasisbio_publications (
    oasis_bio_id,
    public_slug,
    is_searchable,
    published_at,
    updated_at
  )
  VALUES (
    p_bio_id,
    v_pub_slug,
    true,
    v_published_at,
    now()
  )
  ON CONFLICT (oasis_bio_id) DO UPDATE SET
    public_slug   = EXCLUDED.public_slug,
    is_searchable = EXCLUDED.is_searchable,
    published_at  = EXCLUDED.published_at,
    updated_at    = now();

  -- 7. 写入审计日志
  INSERT INTO public.audit_logs (
    actor_user_id,
    action,
    target_type,
    target_id,
    request_id,
    metadata
  ) VALUES (
    p_actor_id,
    'bio.publish',
    'oasis_bio',
    p_bio_id,
    p_request_id,
    jsonb_build_object(
      'visibility', p_visibility,
      'slug', v_pub_slug
    )
  );

  -- 8. 写入 domain_events（供异步消费）
  INSERT INTO public.domain_events (
    event_type,
    aggregate_type,
    aggregate_id,
    payload
  ) VALUES (
    'bio.published',
    'oasis_bio',
    p_bio_id,
    jsonb_build_object(
      'actor_user_id', p_actor_id,
      'visibility',    p_visibility,
      'slug',          v_pub_slug,
      'request_id',    p_request_id,
      'published_at',  v_published_at
    )
  );

  -- 9. 返回成功结果
  RETURN jsonb_build_object(
    'ok',           true,
    'slug',         v_pub_slug,
    'published_at', v_published_at,
    'visibility',   p_visibility
  );

EXCEPTION WHEN OTHERS THEN
  -- 任何异常都回滚并返回错误
  RETURN jsonb_build_object(
    'ok',    false,
    'errors', ARRAY[SQLERRM]
  );
END;
$$;

-- ============================================================
-- 3. unpublish_bio（配套函数）
-- ============================================================

CREATE OR REPLACE FUNCTION public.unpublish_bio(
  p_bio_id     text,
  p_actor_id   text,
  p_request_id text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_bio record;
BEGIN
  SELECT * INTO v_bio FROM public.oasis_bios WHERE id = p_bio_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'errors', ARRAY['Bio not found']);
  END IF;

  IF v_bio.user_id != p_actor_id THEN
    RETURN jsonb_build_object('ok', false, 'errors', ARRAY['You do not own this bio']);
  END IF;

  -- 更新状态
  UPDATE public.oasis_bios
  SET visibility = 'private', status = 'draft', updated_at = now()
  WHERE id = p_bio_id;

  -- 更新 publication
  UPDATE public.oasisbio_publications
  SET is_searchable = false, updated_at = now()
  WHERE oasis_bio_id = p_bio_id;

  -- 审计日志
  INSERT INTO public.audit_logs (actor_user_id, action, target_type, target_id, request_id)
  VALUES (p_actor_id, 'bio.unpublish', 'oasis_bio', p_bio_id, p_request_id);

  -- domain_events
  INSERT INTO public.domain_events (event_type, aggregate_type, aggregate_id, payload)
  VALUES (
    'bio.unpublished', 'oasis_bio', p_bio_id,
    jsonb_build_object('actor_user_id', p_actor_id, 'request_id', p_request_id)
  );

  RETURN jsonb_build_object('ok', true);

EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('ok', false, 'errors', ARRAY[SQLERRM]);
END;
$$;

-- ============================================================
-- 完成！
-- 验证方式（在 SQL Editor 测试）:
--   SELECT public.validate_publishable_bio('bio_id_here', 'user_id_here');
--   SELECT public.publish_bio('bio_id_here', 'user_id_here', 'req_001', 'public');
-- ============================================================
