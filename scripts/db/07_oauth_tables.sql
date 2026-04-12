-- ============================================================
-- OasisBio OAuth Provider: Tables, Indexes, and RLS
--
-- 执行方式: Supabase 控制台 → SQL Editor → 粘贴执行
-- ============================================================

-- ============================================================
-- 1. oauth_apps — registered third-party applications
-- ============================================================

CREATE TABLE IF NOT EXISTS public.oauth_apps (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id    text        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name             text        NOT NULL,
  description      text,
  homepage_url     text        NOT NULL,
  logo_url         text,
  redirect_uris    text[]      NOT NULL DEFAULT '{}',
  client_id        text        UNIQUE NOT NULL,  -- UUID, public identifier
  client_secret_hash text      NOT NULL,         -- bcrypt hash, never plaintext
  is_active        boolean     NOT NULL DEFAULT true,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_oauth_apps_owner
  ON public.oauth_apps (owner_user_id);

CREATE INDEX IF NOT EXISTS idx_oauth_apps_client_id
  ON public.oauth_apps (client_id);

-- ============================================================
-- 2. oauth_authorization_codes — short-lived, single-use codes
-- ============================================================

CREATE TABLE IF NOT EXISTS public.oauth_authorization_codes (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  code           text        UNIQUE NOT NULL,  -- 32-byte random hex
  client_id      text        NOT NULL,
  user_id        text        NOT NULL,
  redirect_uri   text        NOT NULL,
  scope          text        NOT NULL,         -- space-separated
  code_challenge text        NOT NULL,         -- S256 PKCE challenge
  used_at        timestamptz,                  -- null = unused
  expires_at     timestamptz NOT NULL,         -- now() + 10 minutes
  created_at     timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_oauth_codes_code
  ON public.oauth_authorization_codes (code);

CREATE INDEX IF NOT EXISTS idx_oauth_codes_expires
  ON public.oauth_authorization_codes (expires_at)
  WHERE used_at IS NULL;

-- ============================================================
-- 3. oauth_tokens — refresh tokens (access tokens are JWTs)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.oauth_tokens (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id           text        NOT NULL,
  user_id             text        NOT NULL,
  scope               text        NOT NULL,
  jti                 text        UNIQUE NOT NULL,  -- JWT ID for access token revocation
  refresh_token_hash  text        UNIQUE NOT NULL,  -- bcrypt hash of refresh token
  revoked_at          timestamptz,
  expires_at          timestamptz NOT NULL,          -- refresh token expiry (30 days)
  created_at          timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_oauth_tokens_client_user
  ON public.oauth_tokens (client_id, user_id);

CREATE INDEX IF NOT EXISTS idx_oauth_tokens_jti
  ON public.oauth_tokens (jti);

CREATE INDEX IF NOT EXISTS idx_oauth_tokens_refresh_hash
  ON public.oauth_tokens (refresh_token_hash);

-- ============================================================
-- 4. RLS
-- ============================================================

ALTER TABLE public.oauth_apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.oauth_authorization_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.oauth_tokens ENABLE ROW LEVEL SECURITY;

-- oauth_apps: owner can CRUD their own apps
CREATE POLICY "oauth_apps: owner full access"
  ON public.oauth_apps
  FOR ALL
  USING (owner_user_id = auth.uid()::text)
  WITH CHECK (owner_user_id = auth.uid()::text);

-- authorization_codes: service role only (Prisma bypasses RLS)
CREATE POLICY "oauth_authorization_codes: no direct access"
  ON public.oauth_authorization_codes
  FOR ALL
  USING (false)
  WITH CHECK (false);

-- tokens: service role only
CREATE POLICY "oauth_tokens: no direct access"
  ON public.oauth_tokens
  FOR ALL
  USING (false)
  WITH CHECK (false);

-- ============================================================
-- 5. Auto-update updated_at on oauth_apps
-- ============================================================

CREATE OR REPLACE FUNCTION public.update_oauth_apps_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER oauth_apps_updated_at
  BEFORE UPDATE ON public.oauth_apps
  FOR EACH ROW EXECUTE FUNCTION public.update_oauth_apps_updated_at();

-- ============================================================
-- 完成！在 Supabase SQL Editor 执行此脚本后，
-- 在 .env 和 Cloudflare Pages 添加 OAUTH_JWT_SECRET 环境变量。
-- ============================================================
