# Requirements Document

## Introduction

OasisBio 当前使用 Supabase Auth 作为认证系统，但存在多个关键问题：服务端 session 读取方式错误（使用 admin client 而非 SSR client）、middleware cookie 检测逻辑脆弱、注册与登录流程混乱、用户同步依赖 webhook 且缺乏容错机制。本次修复目标是建立一套生产级的、基于 `@supabase/ssr` 的完整认证体系，确保服务端/客户端 session 一致性，并为后续 OAuth 供应商功能打好基础。

## Glossary

- **Auth_System**: OasisBio 的认证模块，包含登录、注册、session 管理、middleware 保护
- **SSR_Client**: 使用 `@supabase/ssr` 创建的服务端 Supabase 客户端，能正确读取 cookie 中的 session
- **Browser_Client**: 使用 `@supabase/ssr` 创建的浏览器端 Supabase 客户端，自动管理 cookie 同步
- **Session**: Supabase 颁发的用户会话，存储在 cookie 中
- **Profile**: 与 Supabase User 关联的 Prisma Profile 记录，包含 username、displayName 等
- **OTP**: 一次性密码，通过邮件发送用于无密码登录
- **Webhook**: Supabase 触发的用户事件回调，用于同步用户数据到 Prisma 数据库
- **Middleware**: Next.js 中间件，负责保护需要认证的路由

## Requirements

### Requirement 1: 服务端 Session 正确读取

**User Story:** As a developer, I want the server-side session to be correctly read from cookies, so that API routes and server components can reliably authenticate users.

#### Acceptance Criteria

1. THE Auth_System SHALL use `@supabase/ssr` `createServerClient` to read sessions in API routes and server components
2. WHEN a request contains a valid Supabase session cookie, THE SSR_Client SHALL return the authenticated user without calling `supabaseAdmin.auth.getUser(rawCookieString)`
3. THE Auth_System SHALL expose a `createClient` utility for server context that reads and writes cookies via Next.js `cookies()` API
4. WHEN the session cookie is missing or expired, THE SSR_Client SHALL return `null` user without throwing an error
5. THE Auth_System SHALL NOT pass raw cookie strings to `supabaseAdmin.auth.getUser()` as this is an incorrect API usage

### Requirement 2: 浏览器端 Session 自动同步

**User Story:** As a user, I want my login state to persist correctly across page navigations and refreshes, so that I don't get unexpectedly logged out.

#### Acceptance Criteria

1. THE Auth_System SHALL use `@supabase/ssr` `createBrowserClient` for all client-side Supabase operations
2. WHEN a user logs in, THE Browser_Client SHALL automatically store the session in cookies (not just localStorage)
3. WHEN the session is about to expire, THE Browser_Client SHALL automatically refresh it
4. THE Auth_System SHALL provide a single `useSupabaseClient` hook that returns the browser client instance
5. WHEN `onAuthStateChange` fires, THE Auth_System SHALL update the React context state immediately

### Requirement 3: Middleware 路由保护

**User Story:** As a system, I want protected routes to redirect unauthenticated users to login, so that unauthorized access is prevented.

#### Acceptance Criteria

1. THE Middleware SHALL use `@supabase/ssr` `createServerClient` to validate sessions, not manual cookie name detection
2. WHEN a user accesses a protected route without a valid session, THE Middleware SHALL redirect to `/auth/login?callbackUrl={originalPath}`
3. WHEN a user accesses `/auth/login` or `/auth/register` with a valid session, THE Middleware SHALL redirect to `/dashboard`
4. THE Middleware SHALL refresh the session token in the response cookies if it was refreshed during the request
5. THE Middleware SHALL protect all routes matching `/dashboard/:path*` and `/api/oasisbios/:path*` and `/api/worlds/:path*`

### Requirement 4: 登录与注册流程分离

**User Story:** As a user, I want clear and separate login and registration flows, so that I understand what action I'm taking.

#### Acceptance Criteria

1. THE Auth_System SHALL provide a login page at `/auth/login` that supports OTP email login
2. THE Auth_System SHALL provide a registration page at `/auth/register` that collects email and display name, then sends OTP
3. WHEN a user registers, THE Auth_System SHALL pass `displayName` in `user_metadata` during OTP sign-up
4. WHEN OTP verification succeeds on the registration flow, THE Auth_System SHALL redirect to `/dashboard` with a welcome state
5. WHEN OTP verification succeeds on the login flow, THE Auth_System SHALL redirect to the `callbackUrl` or `/dashboard`
6. IF the email is already registered and user attempts to register again, THEN THE Auth_System SHALL show a clear message directing them to login

### Requirement 5: 用户数据同步可靠性

**User Story:** As a system, I want user data to be reliably synced to the Prisma database when users sign up or log in, so that the application always has a valid user record.

#### Acceptance Criteria

1. WHEN a user successfully authenticates for the first time, THE Auth_System SHALL ensure a corresponding User and Profile record exists in Prisma
2. THE Auth_System SHALL implement a `syncUserToPrisma` function that upserts User and Profile records based on Supabase user data
3. WHEN `syncUserToPrisma` is called and the Profile already exists, THE Auth_System SHALL NOT overwrite user-edited fields (displayName, bio, website)
4. IF the Supabase webhook fails to deliver, THEN THE Auth_System SHALL fall back to syncing on the first authenticated API request
5. THE Auth_System SHALL generate a unique username from the user's display name or email prefix, appending a numeric suffix if needed
6. WHEN a user is deleted from Supabase, THE Webhook SHALL cascade delete the User record from Prisma

### Requirement 6: 错误处理与用户反馈

**User Story:** As a user, I want clear error messages when authentication fails, so that I know what went wrong and how to fix it.

#### Acceptance Criteria

1. WHEN OTP sending fails, THE Auth_System SHALL display the specific error message from Supabase
2. WHEN OTP verification fails due to invalid code, THE Auth_System SHALL display "Invalid or expired verification code"
3. WHEN OTP verification fails due to expired code, THE Auth_System SHALL display a resend option
4. IF a network error occurs during authentication, THEN THE Auth_System SHALL display "Network error, please try again"
5. THE Auth_System SHALL clear error messages when the user starts typing a new input
