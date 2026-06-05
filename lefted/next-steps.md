# 🔒 OasisBio 下一步计划 [已归档]

> ⚠️ 此文档已归档（2026-05-19）
> 状态：四条并行主线——女娲 Skill 集成 / 上线前运维 / UX P0 改善 / 疯传增长
> **已被新的「注意力迁移 + 每日写作」计划取代**



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

### 女娲 Skill 集成（Phase 1+2+3 ✅ 已完成）
- [x] 安装 huashu-nuwa Skill 到用户级 `~/.workbuddy/skills/女娲`
- [x] 安全审计通过（Agent Trust Hub ✓, Socket ✓, Snyk ⚠ 无严重风险）
- [x] Prisma 模型：`NuwaRun` + `NuwaSuggestion`（已同步到 DB）
- [x] 核心库：`types.ts` + `source-snapshot.ts` + `orchestrator.ts` + `apply.ts` + `llm.ts`
- [x] API 路由：`POST/GET /api/nuwa/runs` + `GET /api/nuwa/runs/[runId]` + `POST /api/nuwa/runs/[runId]/apply` + `POST /api/nuwa/runs/[runId]/reject`
- [x] 前端工作台：`/dashboard/oasisbios/[id]/nuwa` 页面（建议审阅 UI、轮询、批量操作）
- [x] 认知框架输出全覆盖映射（Phase 3：mentalModels/heuristics/antiPatterns/tensions/honestLimits/expressionDNA → dcos scope）
- [x] 英文技术文档：`docs/nuwa-integration.md`
- [x] 16+ 个英文 commit，已全部 pushed 到 GitHub

#### Phase 4 待做
- [ ] 异步 worker 化（Nuwa 运行改为后台任务，不阻塞 UI）
- [ ] `audit_logs` 表 + 写入逻辑
- [ ] `domain_events` 消费者（OG 图生成、搜索索引、revalidate）
- [ ] LLM 调用优化（真实 LLM 接入，当前为 mock）

---

### 🟡 上线前运维

#### Vercel 部署配置
- [ ] 配置 Vercel 项目环境变量（Supabase、R2 等）
- [ ] Supabase 数据库脚本执行（6 个 SQL，按顺序）
- [ ] Supabase Storage Buckets 创建（avatars / character-covers / model-previews）
- [ ] Supabase Auth Site URL + Redirect URLs 配置

> ⚠️ 待清理：`open-next.config.ts` 仍存在（Cloudflare 配置），`next.config.js` 的 webpack fallback 仍是 Cloudflare 版本。两者需清理或适配 Vercel。

#### 技术债清理（已过时，来自 Cloudflare 迁移阶段）
- [ ] 删除 `open-next.config.ts`
- [ ] 清理 `next.config.js` 中的 Cloudflare webpack fallback 配置
- [ ] 卸载 `@opennextjs/cloudflare` 和 `wrangler`（仍在 dependencies 中）

---

## 🟡 UX 改善（P0 优先级）

> 详见 `planning/ux-strategy.md`（用户分层 / Explore 策略 / 漏斗基准 / 执行清单完整版）

### 用户分层假设（工作假设）
| 层级 | 占比 | 路径目标 |
|------|------|---------|
| 轻度用户 | 65% | 浏览 → 快速创建第一个角色骨架 |
| 中度用户 | 25% | 完成 → 第一次发布 |
| 重度用户 | 10% | 深度工具 → 版本历史 / OAuth / API |

### 三大核心洞察
1. **「完成感陷阱」**：6 步向导 Step 4-6 无 API，用户以为完成全部，实际只有 Step 1 被保存
2. **「身份深度 vs 工具感」**：Nuwa 输出缺翻译层，用户无法理解 AI 思考过程的价值
3. **「Explore 即门面」**：`/explore` 无搜索/分页，未登录用户无法预览内容，注册动机弱

### P0 执行清单

| # | 行动 | 成功指标 |
|---|------|---------|
| 1 | **Explore 搜索 + 分页** | Explore→注册转化 +15% |
| 2 | **向导压缩到 3 步**（其余步骤降为「继续完善」Panel） | 创建→发布完成率 +30% |
| 3 | **首次保存后 → Publish CTA**（不是继续填表） | 首次发布率 +10% |
| 4 | **OTP 错误细化** | 认证错误率 -20% |
| 5 | **Nuwa 改为「草稿后触发」**（不是空白页介入） | Nuwa 采用率提升 |
| 6 | **Explore 精选卡 + Fork 入口** | Explore→Register 转化 +10% |
| 7 | **埋点**：`first_bio_saved` / `first_bio_published` / `return_day_7` | 建立激活可观测性 |

### 竞品参照
- Character.AI：消费先行 + Quick/Advanced 双轨 → 顶部漏斗参考
- WorldAnvil：用途分流 + 深度分层 → 中后段路径参考
- Campfire：模块化分层 + 按需解锁 → 功能边界参考

---

## 🔴 安全 P0（疯传前置，必须先修）

> 来源：`prepare_home/OasisBio 疯传潜力深度研究与增长策略报告.md`

### 7 个必须修复的安全问题

| # | 问题 | 严重程度 | 修复方向 |
|---|------|---------|---------|
| 1 | **OAuth HS256 对称签名，JWKS 直接暴露 `k` 值** | P0 生产漏洞 | 迁移到 EdDSA/RS256，只公开公钥；使用 `jose` 库 |
| 2 | **Supabase webhook 缺少 `SUPABASE_WEBHOOK_SECRET` 时跳过签名校验** | P0 生产漏洞 | 缺失时直接 reject，不是 skip |
| 3 | **`asset-token` Edge Function 未上线，存在绕过所有权检查的直接上传** | P0 生产漏洞 | 上线正式上传入口，关闭绕过路径 |
| 4 | **模型删除只删 DB 记录，不删 R2 文件** | P1 成本/隐私 | 删除时同步清理 R2 对象 |
| 5 | **部署文档在 Vercel 与 Cloudflare 之间漂移** | P1 可信度 | 统一 README/technical.md 部署说明 |
| 6 | **`@supabase/auth-helpers-nextjs` 废弃包残留** | P1 技术债 | 清理依赖，统一到 `@supabase/ssr` |
| 7 | **`next lint` 脚本而非 ESLint CLI（Next.js 16 升级要求）** | P1 技术债 | 迁移到 ESLint CLI 或 ESLint flat config |

### 产品本体优化建议（来自 UX 研究）

#### 信息架构 & 首页

| 问题 | 建议 | 优先级 |
|------|------|--------|
| 官网导航 5 项对新用户信息过散 | 首屏改为「创建身份」+「探索模板」两个主入口，其余收进次级导航 | P1 |
| 价值主张有但行动路径不明确 | 页面结构：一句话价值 → 15 秒 Demo → Use Cases → 模板墙 → 开发者入口 | P1 |
| 全黑白设计，可传播模块淹没在灰度里 | 只对「分享/Remix/OAuth/Nuwa insight」4 类元素引入极少量强调色（建议：Graphite + Electric Violet + Pale Gold） | P2 |

#### 关键路径文案 & 微交互

| 场景 | 当前问题 | 建议改法 | 优先级 |
|------|---------|---------|--------|
| 空状态文案 | 像「你还没填表」 | 改成「你还没有过去或未来版本。先写一个 2035 的你。」→ 点击直接进 Era 向导 | P1 |
| 发布后反馈 | 发布 Toast 消失就结束，无后续 | 改成「发布并生成分享卡」→ 发布成功后右下角出现分享预览抽屉（替代 Toast） | P0 |
| Nuwa 结果展示 | 像后台 JSON 输出 | 卡片标题改成「Nuwa 看到的你：XXX」→ 每张卡片可一键保存为图片 | P1 |
| Developer CTA | 纯文档页入口 | 改成「把 Oasis 接进你的产品」→ 点击进 Playground，而不是文档页 | P1 |

#### 性能问题（传播放大后会爆）

| 问题 | 严重性 | 修法 | 优先级 |
|------|--------|------|--------|
| Session 中间层 `matcher` 覆盖几乎所有非静态请求 | 公开流量一上来先被中间层放大延迟 | 缩窄 matcher 到 `/dashboard/*`、`/developer/*`、`/api/*` | P1 |
| Three.js 不懒加载，3D 模型默认首屏加载 | 页面首屏重，传播不利 | 默认 poster 图 + 用户触发加载；控制模型体积 + R2 缓存 | P1 |

---

### 疯传产品化新增功能

| 功能 | 说明 | 优先级 |
|------|------|--------|
| **身份分享卡** | 发布后自动生成可转发 OG 卡：身份名+时代轴+3能力+1 Nuwa insight+1世界标签 | P0 |
| **Remix 模板市场** | 公开 OasisBio / World 可被 Fork/Remix，保留来源 | P0 |
| **OAuth Playground** | `/developer/docs` 加在线试玩，走通 OAuth 流程并实时看 JSON | P1 |
| **关系图谱 UI** | `CharacterRelationship` 可视化为 force-graph，支持截图传播 | P1 |
| **过去/未来对照页** | 选两个 Era 生成 Before/After 对比视图 | P1 |
| **Nuwa 认知雷达** | Nuwa 结果可视化成 ECharts 雷达图，可一键保存为图 | P1 |
| **`/u/[username]` 公开用户页** | 战略文档定义的社会传播入口点 | P1 |

### 30 天疯传冲刺（4 周）

```
Week 1（基础修复）：
  Day1-2 → 统一部署文档 + 仓库卫生清理（.gitignore、dev.db 移出）
  Day3-5 → OAuth 安全改造（HS256→EdDSA）、webhook 签名强制、asset-token 上线
  Day6-7 → Explore 搜索+分页 + 修 CTA

Week 2（分享资产）：
  Day8-10 → OG 图/分享卡生成 + domain_events 消费者
  Day11-14 → GitHub Topics/Preview/Releases + Discussions 开启

Week 3（传播飞轮）：
  Day15-17 → 时代对照 Demo + Nuwa 认知雷达 + Remix 模板
  Day18-21 → 关系图谱最小版 + 内容矩阵第一篇

Week 4（社区沉淀）：
  Day22-24 → OAuth Playground + Ship Friday 发 Release
  Day25-28 → 内容矩阵（3篇长文）+ 给自己写 README 挑战
  Day29-30 → 复盘：Star/Fork/公开发布数/分享点击率/Remix 次数
```

### 核心传播口号

> **把你的过去、现在与未来，编译成一个可分享的身份宇宙。**

### 四层受众与渠道

| 受众 | 渠道 | 核心钩子 |
|------|------|---------|
| 独立开发者 / AI 团队 | GitHub / HN / X | OAuth/OIDC Playground + Continue with Oasis |
| 世界观创作者 / 游戏编剧 / OC 圈 | X / Reddit / B站 / 小红书 | 世界构建器 + Remix 模板 + 关系图谱 |
| 个人品牌 / 知识工作者 | LinkedIn / 公众号 / 即刻 | 过去-现在-未来对照 + 能力树公开化 |
| 研究 / 教育 / 数字人实验者 | 学术博客 / 播客 / LinkedIn | 数字身份结构化 + 叙事与世界建模 |

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
