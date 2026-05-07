# OasisBio 项目长期记忆

## 项目概况
- **项目**：OasisBio — 跨代际身份协议系统 / 角色资料库平台
- **框架**：Next.js 16.2 (App Router) + TypeScript 5.4 + Tailwind CSS
- **数据库**：PostgreSQL via Supabase + Prisma 6 ORM
- **认证**：Supabase Auth（OTP 无密码）
- **存储**：Supabase Storage (图片) + Cloudflare R2 (3D模型/导出)
- **部署目标**：**Vercel**

## 已完成的核心模块
1. OasisBio Builder — 角色创建/编辑完整 CRUD
2. Era Timeline — 过去/现在/未来/平行时代系统
3. World Builder — 6 模块引导式世界观构建
4. Ability Pool — 分类技能 + era/world 绑定
5. DCOS Repository — 叙事文档（版本控制、文件夹路径）
6. References Library — 外部链接资源库 + 元数据抓取 API
7. 3D Model Viewer — Three.js GLB 渲染
8. Import/Export — ZIP 打包导入导出
9. Publish System — 原子发布/撤销（DB RPC）
10. OAuth Provider — 完整 Authorization Code + PKCE 流程（含开发者门户）
11. Tag 系统 — 通用标签 + 多态关联
12. CharacterRelationship — 双向角色关系

## 当前开发焦点（2026-05-07 起）
- **女娲 Skill 集成 Phase 1+2 已完成并推送到 GitHub**：
  - Prisma 模型：NuwaRun + NuwaSuggestion（已同步到 DB）
  - 核心库：types.ts + source-snapshot.ts + orchestrator.ts + apply.ts + llm.ts（真实 LLM 调用）
  - API 路由：POST/GET runs、GET run detail、POST apply、POST reject
  - 前端工作台：/dashboard/oasisbios/[id]/nuwa 页面（建议审阅 UI、轮询、批量操作）
  - 技术债务清理：next.config.js open-next 残留已移除
  - 英文技术文档：docs/nuwa-integration.md
  - 共 15 个英文 commit，全部 pushed
- Phase 3 待做：扩展 worlds + references scope
- Phase 4 待做：异步 worker 化 + audit_logs + domain_events + LLM 真正调用优化

## 用户偏好
- 中文母语，沟通风格直接简洁，要求可执行的结构化输出
- 偏好「以代码为准」——文档过时则以代码实际状态为准
- 喜欢表格化信息呈现
- 授权 AI 自主执行操作（install/build/edit 等）
- 工作流：先厘清全局架构再局部执行

## 待注意的技术债务
- OAuth 属性测试有 4 处缺口（crypto/validate/token/scope-enforcement 各缺 Property 测试）
- prepare_home/ 下有 3 个过时规划文档（内容已被 planning/next-steps.md 覆盖）
- @opennextjs/cloudflare 和 wrangler 包仍存在于 dependencies 中，可后续移除
