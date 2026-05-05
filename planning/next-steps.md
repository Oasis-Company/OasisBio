# OasisBio 下一步计划

> 文档更新时间：2026-05-05
> 状态：功能闭环验证完成，P0/P1 问题已修复

---

## ✅ 已完成（本阶段）

### 功能闭环验证
- [x] 全部 9 个模块闭环验证（OasisBio、World、Ability、DCOS、Reference、Model、Era、OAuth、Publish）
- [x] 问题分级：P0（0个）、P1（0个）、P2（0个）— 全部清零

### P0 修复
- [x] `storage.getUrl()` 占位符替换为真实实现
- [x] OAuth 端点添加 try-catch + handleApiError
- [x] `/api/oauth/authorize` 输入验证（clientId/redirectUri/scope/PKCE）
- [x] OIDC JWKS 端点实现（`.well-known/jwks.json`）

### P1 修复
- [x] API 路由 `any` 类型替换为具体类型
- [x] 统一使用 `handleApiError` 处理错误
- [x] WorldDocuments CRUD 闭环（PUT/DELETE 端点）
- [x] 权限错误码统一：401 → 403（非所有权情况）

### P2 优化
- [x] `middleware.ts` PROTECTED_PREFIXES 补全（5项 → 15项）
- [x] `rate-limit.ts` 添加多实例迁移注释
- [x] `docs/route.ts` 同步 API 改为异步

### Git 提交
- [x] 6 个英文 commit 已提交（未 push）
  - `50524b9` fix: replace storage.getUrl placeholder with real implementation
  - `27f7acb` fix: add input validation and error handling to OAuth authorize endpoint
  - `aa027a8` feat: implement OIDC JWKS endpoint for OAuth
  - `aa29e1a` refactor: replace any types with explicit types in API routes
  - `5fc6ef0` feat: complete WorldDocuments CRUD and fix permission codes
  - `0e3f9df` docs: add multi-instance migration guide to rate-limiter

---

## 🔜 下一步（按优先级排序）

### 高优先级 — 上线前必须

#### 1. 环境变量配置（Cloudflare Pages）
- [ ] 添加 `OAUTH_JWT_SECRET`（生成：`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`）
- [ ] 修正 `SUPABASE_SERVICE_ROLE_KEY`（必须为 `eyJ...` JWT 格式）
- [ ] 填写 Cloudflare R2 凭证（5个变量）
  - `CLOUDFLARE_R2_BUCKET_NAME`
  - `CLOUDFLARE_R2_ACCOUNT_ID`
  - `CLOUDFLARE_R2_ACCESS_KEY_ID`
  - `CLOUDFLARE_R2_SECRET_ACCESS_KEY`
  - `CLOUDFLARE_R2_ENDPOINT`
- [ ] 在 Cloudflare Pages 控制台确认所有环境变量已填写

#### 2. Git Push
- [ ] `git push origin main`（推送 7 个本地 commit）

#### 3. Supabase 数据库脚本执行（仅需执行一次）
按顺序在 Supabase SQL Editor 执行：
- [ ] `scripts/db/01_enable_rls.sql`
- [ ] `scripts/db/02_add_indexes.sql`
- [ ] `scripts/db/04_storage_policies.sql`
- [ ] `scripts/db/05_domain_events_audit_logs.sql`
- [ ] `scripts/db/06_publish_bio_rpc.sql`
- [ ] `scripts/db/07_oauth_tables.sql`

#### 4. Supabase Storage Buckets 创建
- [ ] `avatars`（Public）
- [ ] `character-covers`（Public）
- [ ] `model-previews`（Public）

#### 5. Supabase Auth 配置
- [ ] Site URL 设置为生产域名
- [ ] Redirect URLs 添加生产回调地址

---

### 中优先级 — 功能完善

#### 6. 前端表单字段补全
- [ ] References 表单：添加 `eraId`、`worldId`、`tags` 字段
- [ ] Abilities 表单：添加 `relatedWorldId`、`relatedEraId` 字段
- [ ] 确保前端字段与 API 支持字段一致

#### 7. storageUsed 真实计算
- [ ] 实现 R2 用量统计（list objects → sum size）
- [ ] 实现 Supabase Storage 用量统计
- [ ] 更新 `/api/settings` 返回真实用量

#### 8. 路由去重
- [ ] 评估扁平路由 vs 嵌套路由（OAuth resources）
- [ ] 决定保留哪套路由，删除另一套

---

### 低优先级 — 未来规划

#### 9. Supabase Edge Functions（见 `prepare_home/supabase edge function规划.md`）
- [ ] `asset-token` — 签名上传/下载 URL
- [ ] `auth-profile-sync` — Edge 端用户同步
- [ ] `publish-bio` — 发布命令入口
- [ ] `reference-enrich` — URL 元数据抓取

#### 10. Domain Events 消费者
- [ ] OG 图片生成（bio.published 事件）
- [ ] 搜索索引更新
- [ ] 页面重新验证（revalidate）

#### 11. 测试覆盖率提升
- [ ] World Builder 组件测试
- [ ] OAuth 流程端到端测试
- [ ] API 集成测试

---

## 📋 换设备迁移清单

如果从新设备继续工作，按顺序执行：

1. **克隆仓库**
   ```bash
   git clone <repo-url> OasisBio
   cd OasisBio
   npm install
   ```

2. **环境变量**（从旧设备或密码管理器获取 `.env` 文件）
   - 必须：`DATABASE_URL`、`DIRECT_URL`、`NEXT_PUBLIC_SUPABASE_URL`、`NEXT_PUBLIC_SUPABASE_ANON_KEY`、`SUPABASE_SERVICE_ROLE_KEY`
   - OAuth：`OAUTH_JWT_SECRET`
   - R2：`CLOUDFLARE_R2_*` 全部 5 个变量

3. **Prisma 生成**
   ```bash
   npx prisma generate
   ```

4. **本地开发**
   ```bash
   npm run dev
   ```

5. **如需本地数据库**，执行 Supabase SQL 脚本（见上方"高优先级"第3条）

---

## 📁 关键文档路径

| 文档 | 路径 | 用途 |
|------|------|------|
| 技术文档 | `docs/technical.md` | 完整技术参考 |
| OAuth 集成 | `docs/features/oauth.md` | 第三方开发者指南 |
| 功能规格 | `docs/features/*.md` | 各模块详细规格 |
| 战略计划 | `docs/OasisBio Strategic Plan.md` | 长期规划 |
| Edge Functions 规划 | `prepare_home/supabase edge function规划.md` | Edge Functions 设计 |
| 待完成任务 | `prepare_home/待完成任务.md` | 环境配置待办 |
| **下一步计划** | **`planning/next-steps.md`** | **本文档** |

---

## 🚀 快速参考

### 常用命令
```bash
npm run dev          # 本地开发
npm run build        # 构建（Cloudflare Pages 使用）
npm test            # 运行测试
npx prisma generate # 生成 Prisma Client
npx prisma db push  # 推送 schema 到数据库
```

### 端口说明
- 本地开发：`localhost:3000`
- Supabase Pooler：`port 6543`（Prisma 运行时）
- Supabase Direct：`port 5432`（迁移专用）

### 关键注意事项
- **`OAUTH_JWT_SECRET` 设置后不可更改**，否则所有已颁发 token 失效
- **`SUPABASE_SERVICE_ROLE_KEY` 必须 `eyJ...` 开头**，不是 `sb_secret_...`
- **Git commit 已就绪**，只需 `git push`
- **Cloudflare R2 bucket 已创建**，只需填写凭证
