# Implementation Plan: Supabase Auth Fix

## Overview

将认证系统从错误的 `supabaseAdmin.auth.getUser(rawCookieString)` 模式迁移到基于 `@supabase/ssr` 的标准 SSR 架构。按依赖顺序逐步替换，确保每步可独立验证。

## Tasks

- [x] 1. 安装依赖并创建 Supabase SSR 客户端工具层
  - 安装 `@supabase/ssr` 包（替代已废弃的 `@supabase/auth-helpers-nextjs`）
  - 安装 `fast-check` 用于属性测试
  - 创建 `src/lib/supabase/client.ts`：使用 `createBrowserClient`
  - 创建 `src/lib/supabase/server.ts`：使用 `createServerClient` + Next.js `cookies()` API
  - 创建 `src/lib/supabase/middleware.ts`：实现 `updateSession` proxy 函数，使用 `getClaims()` 刷新 token
  - _Requirements: 1.1, 1.2, 1.3, 2.1_

- [x] 2. 实现用户同步服务
  - [x] 2.1 创建 `src/lib/user-sync.ts`
    - 实现 `generateUniqueUsername(base: string): Promise<string>`：从 displayName 或 email prefix 生成唯一 username，冲突时追加数字后缀
    - 实现 `syncUserToPrisma(supabaseUser): Promise<SyncResult>`：upsert User 记录；若 Profile 不存在则创建；若存在则只补充空字段，不覆盖 displayName、bio、website
    - _Requirements: 5.1, 5.2, 5.3, 5.5_

  - [x] 2.2 为 `generateUniqueUsername` 编写属性测试
    - **Property 2: Username uniqueness invariant**
    - 生成随机的已有 username 集合和随机输入，验证返回值不在集合中
    - **Validates: Requirements 5.5**

  - [x] 2.3 为 `syncUserToPrisma` 编写属性测试
    - **Property 3: syncUserToPrisma preserves user-edited fields**
    - 生成随机的已有 Profile（含非空 displayName/bio/website），调用 sync，验证字段未被覆盖
    - **Property 4: syncUserToPrisma is idempotent**
    - 对同一用户调用两次 sync，验证结果相同
    - **Validates: Requirements 5.2, 5.3**

- [x] 3. 重写 Middleware
  - 更新 `src/middleware.ts`：使用 `updateSession` 替代手动 cookie 名称检测
  - 实现保护路由逻辑：`/dashboard`、`/api/oasisbios`、`/api/worlds` 未认证时重定向到 `/auth/login?callbackUrl=...`
  - 实现反向重定向：已认证用户访问 `/auth/login` 或 `/auth/register` 时跳转到 `/dashboard`
  - 更新 `config.matcher` 包含所有需要 session 刷新的路由
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

  - [x] 3.1 为 Middleware 编写属性测试
    - **Property 1: Protected routes always redirect unauthenticated users**
    - 生成随机的受保护路径，验证无 session 时均重定向到 `/auth/login`，且 callbackUrl 正确
    - **Validates: Requirements 3.2, 3.5**

- [x] 4. 更新服务端认证工具
  - 重写 `src/lib/auth.ts`：
    - `getServerUser()`：使用 `createClient()` from `server.ts`，调用 `supabase.auth.getUser()`
    - `getServerUserWithProfile()`：调用 `getServerUser()` 后执行 `syncUserToPrisma` fallback
  - 更新 `src/lib/auth-utils.ts`：`requireAuth()` 改用 `getServerUser()`，移除 `cookies().toString()` 传参
  - _Requirements: 1.1, 1.2, 1.4, 5.4_

- [x] 5. 更新客户端认证 Context
  - 重写 `src/lib/auth.client.ts`（或新建 `src/components/auth/AuthProvider.tsx`）：
    - 使用 `createClient()` from `client.ts` 创建 browser client
    - `useEffect` 中调用 `supabase.auth.onAuthStateChange` 更新 user/session 状态
    - 提供 `useAuth()` hook 返回 `{ user, session, isLoading, supabase }`
  - 更新 `src/components/SessionProviderWrapper.tsx` 使用新的 AuthProvider
  - _Requirements: 2.1, 2.4, 2.5_

  - [x] 5.1 为 AuthProvider 编写属性测试
    - **Property 5: Auth state change propagates to context**
    - 模拟 `onAuthStateChange` 触发不同事件，验证 context 状态正确更新
    - **Validates: Requirements 2.5**

- [x] 6. 重写登录页面
  - 更新 `src/app/auth/login/page.tsx`：
    - 使用 `useAuth()` hook 获取 supabase client
    - 读取 `searchParams.callbackUrl` 用于登录后重定向
    - OTP 发送：`supabase.auth.signInWithOtp({ email })`
    - OTP 验证：`supabase.auth.verifyOtp({ email, token, type: 'email' })`
    - 验证成功后重定向到 `callbackUrl || '/dashboard'`
    - 错误处理：区分 invalid code、expired code（显示重发按钮）、网络错误
    - 输入变化时清除错误状态
  - _Requirements: 4.1, 4.5, 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 7. 重写注册页面
  - 更新 `src/app/auth/register/page.tsx`：
    - 添加 `displayName` 输入字段
    - OTP 发送时传入 `options.data: { display_name: displayName }`
    - 处理 "user already exists" 错误，显示引导登录的提示
    - 验证成功后重定向到 `/dashboard`
  - _Requirements: 4.2, 4.3, 4.4, 4.6_

- [x] 8. 更新 Webhook 处理器
  - 更新 `src/app/api/auth/supabase-webhook/route.ts`：
    - 使用 `syncUserToPrisma` 替代内联的 upsert 逻辑
    - 确保 `user.deleted` 事件正确级联删除 Prisma User 记录
    - 改进错误日志，记录 request_id
  - _Requirements: 5.6_

- [x] 9. Checkpoint — 确保所有测试通过
  - 运行 `npm test -- --run` 确保所有测试通过
  - 验证以下关键路径：
    - 未登录访问 `/dashboard` → 重定向到 `/auth/login?callbackUrl=/dashboard`
    - 已登录访问 `/auth/login` → 重定向到 `/dashboard`
    - API 路由中 `requireAuth()` 正确返回用户
  - 如有问题，向用户说明并请求指导

- [x] 10. 清理旧文件
  - 删除或重构 `src/lib/supabase.ts`（保留 storage 相关工具函数，迁移到 `src/lib/storage.ts`）
  - 删除 `src/lib/supabase-client.ts`（功能已由 `src/lib/supabase/client.ts` 替代）
  - 更新所有 import 路径：将 `from '@/lib/supabase'` 和 `from '@/lib/supabase-client'` 替换为新路径
  - _Requirements: 1.5_

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- Middleware 中 `createServerClient` 和 `getClaims()` 之间不能插入任何代码（官方要求）
- `syncUserToPrisma` 失败不应阻断用户登录，需要 try/catch 隔离
- 属性测试使用 `fast-check`，每个属性最少 100 次迭代
