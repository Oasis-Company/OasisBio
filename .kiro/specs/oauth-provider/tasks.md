# Implementation Plan: OasisBio OAuth Provider

## Overview

按依赖顺序实现：数据库 → 核心库 → API 端点 → 页面。每步可独立验证。

## Tasks

- [x] 1. 数据库：创建 OAuth 表
  - 生成 `scripts/db/07_oauth_tables.sql`，包含 `oauth_apps`、`oauth_authorization_codes`、`oauth_tokens` 三张表
  - 添加 RLS 策略：oauth_apps owner 可 CRUD；authorization_codes 和 tokens 仅 service role
  - 添加必要索引：`oauth_apps(client_id)`、`oauth_authorization_codes(code)`、`oauth_tokens(refresh_token_hash)`
  - _Requirements: 1.2, 1.3, 2.6, 3.3_

- [-] 2. 核心库：`src/lib/oauth/`
  - [x] 2.1 创建 `src/lib/oauth/crypto.ts`
    - `generateSecret(bytes?)` — crypto.randomBytes → hex
    - `hashClientSecret(secret)` — bcrypt hash
    - `verifyClientSecret(secret, hash)` — bcrypt compare
    - `verifyPKCE(codeVerifier, codeChallenge)` — SHA-256 + base64url
    - `signAccessToken(payload)` — JWT sign with HS256 + `OAUTH_JWT_SECRET`
    - `verifyAccessToken(token)` — JWT verify, return payload or null
    - _Requirements: 5.1, 5.3, 5.4, 5.5_

  - [ ] 2.2 为 crypto.ts 编写属性测试
    - **Property 3: PKCE verification correctness**
    - **Property 4: Access token contains correct claims**
    - **Validates: Requirements 5.1, 5.3, 5.4**

  - [x] 2.3 创建 `src/lib/oauth/scopes.ts`
    - `SCOPES` 常量定义（5 个 scope）
    - `parseScopes(scopeString)` — 解析并验证 scope 字符串
    - `hasScope(tokenScope, required)` — 检查 token 是否有指定 scope
    - _Requirements: 4.6, 5.1_

  - [x] 2.4 创建 `src/lib/oauth/validate.ts`
    - `validateRedirectUri(uri)` — 验证 HTTPS 或 localhost
    - `validateAuthorizationParams(params)` — 验证 /oauth/authorize 参数
    - `validateTokenParams(params)` — 验证 /oauth/token 参数
    - _Requirements: 1.4, 2.1, 3.1_

  - [ ] 2.5 为 validate.ts 编写属性测试
    - **Property 1: Client credential generation uniqueness**
    - **Property 2: Redirect URI validation**
    - **Validates: Requirements 1.2, 1.4**

- [x] 3. 新增环境变量
  - 在 `.env.example` 添加 `OAUTH_JWT_SECRET`（用于签名 access token）
  - 在 `docs/technical.md` 更新环境变量表
  - _Requirements: 5.4_

- [-] 4. 开发者门户 API
  - [-] 4.1 创建 `src/app/api/developer/apps/route.ts`
    - GET: 列出当前用户的所有 OAuth apps
    - POST: 创建新 app（生成 client_id + client_secret，存哈希）
    - 限制每用户最多 10 个 app
    - _Requirements: 1.2, 1.3, 1.7_

  - [ ] 4.2 创建 `src/app/api/developer/apps/[id]/route.ts`
    - GET: 获取单个 app（不返回 client_secret）
    - PUT: 更新 app（name, description, homepage_url, redirect_uris, logo_url）
    - DELETE: 删除 app + 撤销所有 token
    - _Requirements: 1.4, 1.5, 1.6_

  - [ ] 4.3 创建 `src/app/api/developer/apps/[id]/secret/route.ts`
    - POST: 轮换 client_secret（生成新的，返回明文一次，存哈希）
    - _Requirements: 1.2_

- [ ] 5. OAuth 核心端点
  - [ ] 5.1 创建 `src/app/oauth/authorize/page.tsx`
    - GET: 验证参数，显示 Consent Screen
    - POST: 处理用户授权决定（Authorize / Deny）
    - 生成 Authorization Code，重定向到 redirect_uri
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

  - [ ] 5.2 创建 `src/app/api/oauth/token/route.ts`
    - POST: 处理 authorization_code 和 refresh_token 两种 grant type
    - 验证 PKCE code_verifier
    - 签发 JWT access_token + 随机 refresh_token
    - Refresh token 轮换
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 5.7_

  - [ ] 5.3 为 token 端点编写属性测试
    - **Property 6: Refresh token rotation**
    - **Property 7: Authorization code is single-use**
    - **Validates: Requirements 3.4, 5.7, 2.4**

  - [ ] 5.4 创建 `src/app/api/oauth/revoke/route.ts`
    - POST: 撤销 access_token 或 refresh_token
    - _Requirements: 3.6_

  - [ ] 5.5 创建 `src/app/api/oauth/.well-known/openid-configuration/route.ts`
    - GET: 返回 OIDC discovery document
    - _Requirements: 4.8_

- [ ] 6. 资源 API
  - [ ] 6.1 创建 `src/lib/oauth/middleware.ts`
    - `requireOAuthToken(scope)` — 验证 Bearer token，检查 scope，返回 user_id
    - _Requirements: 4.6, 4.7_

  - [ ] 6.2 创建 `src/app/api/oauth/userinfo/route.ts`
    - GET: 返回 profile + email（根据 scope）
    - _Requirements: 4.1, 4.2_

  - [ ] 6.3 创建 `src/app/api/oauth/resources/oasisbios/route.ts`
    - GET: 返回用户角色列表（`oasisbios:read` scope）
    - _Requirements: 4.3_

  - [ ] 6.4 创建 `src/app/api/oauth/resources/oasisbios/[id]/route.ts`
    - GET: 返回角色完整数据（`oasisbios:full` scope）
    - _Requirements: 4.4_

  - [ ] 6.5 创建 `src/app/api/oauth/resources/oasisbios/[id]/dcos/route.ts`
    - GET: 返回 DCOS 文档列表和内容（`dcos:read` scope）
    - _Requirements: 4.5_

  - [ ] 6.6 为资源 API 编写属性测试
    - **Property 5: Scope enforcement — insufficient scope returns 403**
    - **Validates: Requirements 4.6**

- [ ] 7. 开发者门户页面
  - [ ] 7.1 创建 `src/app/developer/apps/page.tsx` — 应用列表页
  - [ ] 7.2 创建 `src/app/developer/apps/new/page.tsx` — 创建应用表单
  - [ ] 7.3 创建 `src/app/developer/apps/[id]/page.tsx` — 应用详情/编辑页
  - [ ] 7.4 创建 `src/app/developer/docs/page.tsx` — 集成文档页（含代码示例）
  - _Requirements: 1.1, 6.1, 6.2, 6.3_

- [ ] 8. 数据库脚本执行
  - 在 Supabase SQL Editor 执行 `scripts/db/07_oauth_tables.sql`
  - 更新 `docs/README.md` 添加新脚本说明

- [ ] 9. Checkpoint — 确保所有测试通过
  - 运行所有测试，确保 Property 1-7 全部通过
  - 验证完整 OAuth 流程：注册 app → 授权 → 换 token → 访问资源

## Notes

- `OAUTH_JWT_SECRET` 需要添加到 `.env` 和 Cloudflare Pages 环境变量
- 所有 OAuth 错误遵循 RFC 6749 格式：`{ error, error_description }`
- client_secret 只在创建时返回明文一次，之后只存 bcrypt hash
- Access Token 是 JWT（不存数据库），Refresh Token 是随机 hex（存 hash）
- 属性测试使用 fast-check，每个属性最少 100 次迭代
