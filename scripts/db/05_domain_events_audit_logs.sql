-- ============================================================
-- OasisBio: domain_events + audit_logs tables
-- 
-- 执行方式: Supabase 控制台 → SQL Editor → 粘贴执行
-- ============================================================

-- ============================================================
-- 1. domain_events
--    用于异步事件驱动：publish_bio 成功后写入事件，
--    后续 OG 图生成、搜索索引、通知等异步消费。
-- ============================================================

CREATE TABLE IF NOT EXISTS public.domain_events (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type    text        NOT NULL,           -- e.g. 'bio.published', 'asset.uploaded'
  aggregate_type text       NOT NULL,           -- e.g. 'oasis_bio', 'world_item'
  aggregate_id  text        NOT NULL,           -- 对应实体的 ID
  payload       jsonb       NOT NULL DEFAULT '{}',
  status        text        NOT NULL DEFAULT 'pending'
                            CHECK (status IN ('pending', 'processing', 'done', 'failed')),
  retry_count   int         NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now(),
  processed_at  timestamptz
);

-- 索引：消费者按 status + created_at 拉取待处理事件
CREATE INDEX IF NOT EXISTS idx_domain_events_status_created
  ON public.domain_events (status, created_at)
  WHERE status IN ('pending', 'failed');

-- 索引：按 aggregate 查询事件历史
CREATE INDEX IF NOT EXISTS idx_domain_events_aggregate
  ON public.domain_events (aggregate_type, aggregate_id, created_at DESC);

-- RLS
ALTER TABLE public.domain_events ENABLE ROW LEVEL SECURITY;

-- 只有 service role 可以读写（应用层通过 Prisma/service role 操作）
-- 普通用户不能直接访问
CREATE POLICY "domain_events: service role only"
  ON public.domain_events
  FOR ALL
  USING (false)
  WITH CHECK (false);

-- ============================================================
-- 2. audit_logs
--    记录所有重要操作：谁发布了什么、谁申请了 token、
--    谁修改了 visibility、哪次请求失败了。
-- ============================================================

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id text,                           -- 操作者 user ID（可为 null，如系统操作）
  action        text        NOT NULL,           -- e.g. 'bio.publish', 'asset.token.request'
  target_type   text        NOT NULL,           -- e.g. 'oasis_bio', 'world_item'
  target_id     text        NOT NULL,
  request_id    text,                           -- 透传的 request_id，用于追踪
  metadata      jsonb       NOT NULL DEFAULT '{}',
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- 索引：按用户查询操作历史
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_created
  ON public.audit_logs (actor_user_id, created_at DESC);

-- 索引：按 target 查询操作历史
CREATE INDEX IF NOT EXISTS idx_audit_logs_target
  ON public.audit_logs (target_type, target_id, created_at DESC);

-- 索引：按 action 类型查询
CREATE INDEX IF NOT EXISTS idx_audit_logs_action_created
  ON public.audit_logs (action, created_at DESC);

-- RLS
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 用户只能查看自己的操作日志
CREATE POLICY "audit_logs: owner read"
  ON public.audit_logs
  FOR SELECT
  USING (actor_user_id = auth.uid()::text);

-- 只有 service role 可以写入（应用层写入，不允许客户端直接写）
CREATE POLICY "audit_logs: service role write"
  ON public.audit_logs
  FOR INSERT
  WITH CHECK (false);

-- ============================================================
-- 完成！
-- ============================================================
