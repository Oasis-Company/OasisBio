# Design Document: Supabase Auth Fix

## Overview

将 OasisBio 的认证系统从错误的 `supabaseAdmin.auth.getUser(rawCookieString)` 模式迁移到基于 `@supabase/ssr` 的标准 SSR 认证架构。同时修复 middleware、统一客户端/服务端 session 管理、分离登录注册流程、增强用户同步可靠性。

核心原则：
- 服务端用 `createServerClient`（读写 Next.js cookies）
- 客户端用 `createBrowserClient`（自动 cookie 同步）
- Middleware 用 `updateSession` proxy 模式刷新 token
- 用户同步：webhook 为主，API 请求时 fallback 为辅

## Architecture

```mermaid
graph TD
    A[Browser] -->|Request with cookies| B[Next.js Middleware]
    B -->|updateSession - refresh token| C[Supabase Auth]
    C -->|Updated session cookies| B
    B -->|Forward with fresh cookies| D[Route Handler / Server Component]
    D -->|createServerClient| E[SSR Supabase Client]
    E -->|getClaims / getUser| C
    D -->|Authenticated user| F[Prisma DB]
    
    G[Client Component] -->|createBrowserClient| H[Browser Supabase Client]
    H -->|onAuthStateChange| I[React Auth Context]
    I -->|user / session state| G
    
    J[Supabase Auth Events] -->|webhook| K[/api/auth/supabase-webhook]
    K -->|upsert| F
    D -->|fallback sync| L[syncUserToPrisma]
    L -->|upsert| F
```

## Components and Interfaces

### 1. `src/lib/supabase/client.ts` — Browser Client

```typescript
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

单例模式，供所有客户端组件使用。替换现有的 `src/lib/supabase.ts` 和 `src/lib/supabase-client.ts`。

### 2. `src/lib/supabase/server.ts` — Server Client

```typescript
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from Server Component - middleware handles refresh
          }
        },
      },
    }
  );
}
```

### 3. `src/lib/supabase/middleware.ts` — Session Proxy

```typescript
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
          Object.entries(headers).forEach(([key, value]) =>
            supabaseResponse.headers.set(key, value)
          );
        },
      },
    }
  );

  // CRITICAL: Do not add code between createServerClient and getClaims()
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  return { supabaseResponse, user };
}
```

### 4. `src/middleware.ts` — Updated Middleware

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

const PROTECTED_ROUTES = ['/dashboard', '/api/oasisbios', '/api/worlds'];
const AUTH_ROUTES = ['/auth/login', '/auth/register'];

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request);
  const pathname = request.nextUrl.pathname;

  const isProtected = PROTECTED_ROUTES.some(r => pathname.startsWith(r));
  const isAuthRoute = AUTH_ROUTES.some(r => pathname.startsWith(r));

  if (isProtected && !user) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return supabaseResponse;
}
```

### 5. `src/lib/auth.ts` — Updated Server Auth Utilities

```typescript
import 'server-only';
import { createClient } from '@/lib/supabase/server';
import { syncUserToPrisma } from '@/lib/user-sync';

export async function getServerUser() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  return user;
}

export async function getServerUserWithProfile() {
  const user = await getServerUser();
  if (!user) return null;
  // Fallback sync: ensure user exists in Prisma
  return await syncUserToPrisma(user);
}
```

### 6. `src/lib/user-sync.ts` — User Sync Service

```typescript
interface SyncResult {
  userId: string;
  profileId: string;
  username: string;
  isNewUser: boolean;
}

export async function syncUserToPrisma(supabaseUser: SupabaseUser): Promise<SyncResult>
export async function generateUniqueUsername(base: string): Promise<string>
```

**同步规则：**
- User 记录：upsert by `id`，更新 `email`、`name`（仅当 name 为空时）
- Profile 记录：若不存在则创建；若存在，只补充空字段，不覆盖用户已编辑的 `displayName`、`bio`、`website`

### 7. Auth Context — `src/components/auth/AuthProvider.tsx`

```typescript
interface AuthContextValue {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  supabase: SupabaseClient;
}
```

使用 `createBrowserClient` 创建单例，通过 `onAuthStateChange` 监听状态变化。

## Data Models

无 schema 变更。现有 Prisma 模型已满足需求。

关键字段映射：
- `User.id` ← Supabase `user.id`（UUID）
- `User.email` ← Supabase `user.email`
- `Profile.username` ← 由 `generateUniqueUsername` 生成
- `Profile.displayName` ← Supabase `user_metadata.display_name` 或 email prefix

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

Property 1: Protected routes always redirect unauthenticated users
*For any* path under `/dashboard`, `/api/oasisbios`, or `/api/worlds`, a request without a valid session should result in a redirect to `/auth/login` with the original path as `callbackUrl`.
**Validates: Requirements 3.2, 3.5**

Property 2: Username uniqueness invariant
*For any* set of existing usernames and any new user input (display name or email), `generateUniqueUsername` should return a username that does not exist in the current set.
**Validates: Requirements 5.5**

Property 3: syncUserToPrisma preserves user-edited fields
*For any* existing Profile with non-null `displayName`, `bio`, or `website`, calling `syncUserToPrisma` again with different Supabase metadata should leave those fields unchanged.
**Validates: Requirements 5.3**

Property 4: syncUserToPrisma is idempotent
*For any* Supabase user, calling `syncUserToPrisma` multiple times with the same data should produce the same result as calling it once.
**Validates: Requirements 5.2**

Property 5: Auth state change propagates to context
*For any* auth state change event (sign-in, sign-out, token refresh), the React auth context should reflect the new user/session state after the event fires.
**Validates: Requirements 2.5**

Property 6: Login redirect uses callbackUrl
*For any* `callbackUrl` query parameter present after OTP verification succeeds, the user should be redirected to that URL (or `/dashboard` if absent).
**Validates: Requirements 4.5**

## Error Handling

| 场景 | 错误来源 | 处理方式 |
|------|---------|---------|
| OTP 发送失败 | Supabase error.message | 直接展示给用户 |
| OTP 验证失败（无效码） | Supabase `otp_expired` / `invalid` | 显示 "Invalid or expired verification code" + 重发按钮 |
| 网络错误 | fetch 异常 | 显示 "Network error, please try again" |
| 用户已存在（注册时） | Supabase user exists | 显示 "Email already registered, please sign in" |
| syncUserToPrisma 失败 | Prisma error | 记录日志，不阻断用户登录流程 |
| Webhook 签名验证失败 | HMAC mismatch | 返回 401，记录日志 |

**关键原则：** 用户同步失败不应阻断登录。用户可以登录，同步在后台重试。

## Testing Strategy

### 工具选择
- 单元测试：Jest（已配置）
- 属性测试：`fast-check`（需安装）
- React 组件测试：`@testing-library/react`（需安装）

### 单元测试覆盖
- `generateUniqueUsername`：空输入、特殊字符、冲突递增
- `syncUserToPrisma`：新用户创建、已有用户更新、字段保护
- Middleware 路由逻辑：各路径的重定向行为
- Webhook handler：各事件类型处理

### 属性测试覆盖（fast-check，每个属性最少 100 次迭代）

每个属性测试必须注释标注对应的设计属性：
- **Feature: supabase-auth-fix, Property 2**: Username uniqueness
- **Feature: supabase-auth-fix, Property 3**: Field preservation
- **Feature: supabase-auth-fix, Property 4**: Idempotency
- **Feature: supabase-auth-fix, Property 1**: Route protection

### 测试文件结构
```
src/lib/
  supabase/
    client.ts
    server.ts
    middleware.ts
  user-sync.ts
  user-sync.test.ts        ← 单元 + 属性测试
src/middleware.ts
src/middleware.test.ts     ← 路由保护属性测试
src/components/auth/
  AuthProvider.tsx
  AuthProvider.test.tsx    ← 状态变化属性测试
```
