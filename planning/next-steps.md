# OasisBio 下一步计划

> 文档更新时间：2026-05-06
> 状态：OAuth Provider 功能闭环已完成，下一步聚焦女娲 Skill 集成
> 部署平台：**Vercel**（非 Cloudflare Pages）

---

## ✅ 已完成（本阶段）

### 功能闭环验证
- [x] 全部 9 个模块闭环验证（OasisBio、World、Ability、DCOS、Reference、Model、Era、OAuth、Publish）
- [x] 问题分级：P0（0个）、P1（0个）、P2（0个）— 全部清零

### OAuth Provider 完整实现
- [x] 数据库 3 张表（oauth_apps, authorization_codes, tokens）+ RLS
- [x] 核心库：crypto / scopes / validate / middleware
- [x] 开发者门户 API（apps CRUD + secret 轮换）
- [x] OAuth 端点：authorize、token（授权码 + refresh）、revoke、OIDC discovery + JWKS
- [x] 资源 API：userinfo、oasisbios 列表/详情/DCOS 文档
- [x] 开发者门户页面（列表/创建/详情/集成文档）
- [x] 16 个测试文件覆盖

### 女娲 Skill 初始化
- [x] 安装 huashu-nuwa Skill 到用户级 `~/.workbuddy/skills/女娲`
- [x] 安全审计通过（Agent Trust Hub ✓, Socket ✓, Snyk ⚠ 无严重风险）
- [ ] 设计 OasisBio × 女娲 数据流与 API 集成方案
- [ ] 实现女娲增强 API 端点
- [ ] 前端集成（角色编辑页添加「深化」入口）

---

## 🔜 下一步（当前焦点）

### 🎯 P0 — 女娲 Skill 集成

**目标**：让女娲帮助用户深度完善 OasisBio 角色资料库。

#### 集成架构

```
用户编辑角色 → 点击「女娲深化」→ API 调用女娲思维框架 → 结构化输出 → 自动填充字段
```

| OasisBio 字段 | 女娲输出 | 说明 |
|---------------|---------|------|
| `description` | 心智模型 (3-7个) | 角色的核心认知框架 |
| `description` | 决策启发式 (5-10条) | 角色的直觉判断规则 |
| `abilities` | 表达DNA分析 | 从行为反推能力树 |
| `worlds` | 世界深层矛盾 | 推演世界观下的典型逻辑 |
| `references` | 参考素材推荐 | 相关书籍/论文/作品 |
| `eras` | 时间线关键节点 | 角色成长建议 |

#### 待完成任务
- [ ] **设计 API 方案**
  - 新建 `/api/nuwa/enhance` 端点
  - 输入：角色现有数据（title, description, abilities, world 等）
  - 输出：结构化的增强数据（心智模型、决策启发、表达DNA等）
  - 支持增量合并（用户可逐条采纳/拒绝）
  
- [ ] **前端交互设计**
  - 角色编辑页 `/bio/[id]/edit` 添加「🧬 深化资料」按钮
  - 弹出侧边面板展示女娲生成的增强建议
  - 用户一键采纳或手动调整后保存

- [ ] **女娲适配改造**
  - 将女娲的「人物蒸馏」流程改为「角色资料增强」模式
  - 输入从「人名搜索」变为「已有角色数据」
  - Phase 1 的 6 Agent 改为基于角色数据的单次推理

---

### 🟡 上线前运维

#### Vercel 部署配置
- [ ] 配置 Vercel 项目环境变量（Supabase、R2 等）
- [ ] Git push 本地 commit（7 个待推送）
- [ ] Supabase 数据库脚本执行（6 个 SQL，按顺序）
- [ ] Supabase Storage Buckets 创建（avatars / character-covers / model-previews）
- [ ] Supabase Auth Site URL + Redirect URLs 配置

> ⚠️ 注意：代码中的 `next.config.js` 和 `open-next.config.ts` 当前仍为 Cloudflare Pages 配置。
> 若已迁移至 Vercel，需清理 open-next/wrangler 依赖并更新部署配置。待确认。

---

### 🟢 未来规划（暂缓）

以下项目优先级低于女娲集成，等主线完成后再推进：

- Supabase Edge Functions（4 个：asset-token, auth-profile-sync, publish-bio, reference-enrich）
- Domain Events 消费者（OG 图片、搜索索引、revalidate）
- 测试覆盖率提升（World Builder 组件测试、OAuth E2E）
- storageUsed 真实计算（R2 + Supabase 用量统计）
- 前端表单字段补全（References eraId/worldId/tags）
- 路由去重评估

---

## 📁 关键文档路径

| 文档 | 路径 | 用途 |
|------|------|------|
| 技术文档 | `docs/technical.md` | 完整技术参考 |
| OAuth 规格 | `.kiro/specs/oauth-provider/tasks.md` | OAuth 实现任务清单 |
| **下一步计划** | **`planning/next-steps.md`** | **本文档** |
| 女娲 Skill | `~/.workbuddy/skills/女娲/SKILL.md` | 女娲造人完整 SOP |

---

## 🚀 快速参考

### 常用命令
```bash
npm run dev          # 本地开发
npm run build        # 构建
npm test            # 运行测试
npx prisma generate # 生成 Prisma Client
npx prisma db push  # 推送 schema 到数据库
```

### 端口说明
- 本地开发：`localhost:3000`
- Supabase Pooler：`port 6543`（Prisma 运行时）
- Supabase Direct：`port 5432`（迁移专用）
