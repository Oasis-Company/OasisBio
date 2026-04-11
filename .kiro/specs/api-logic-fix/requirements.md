# Requirements Document: API Logic Fix

## Introduction

`requireAuth()` 在 auth-fix 中已更新为直接返回 Supabase `User` 对象，但全项目 24 个 API 路由文件仍使用旧的 `session.user.id` 模式，导致所有这些路由在运行时崩溃（`session.user` 为 undefined）。同时存在错误响应格式不统一、export/import 缺少所有权校验等问题。本次修复目标是让所有 API 路由正确运行。

## Requirements

### Requirement 1: 修复 requireAuth 调用模式

所有 API 路由必须将 `const session = await requireAuth()` 改为 `const user = await requireAuth()`，并将所有 `session.user.id` 改为 `user.id`。

### Requirement 2: 统一错误响应格式

所有 API 路由的错误响应统一使用 `handleApiError()` 处理，内联的 `{ error: string }` 格式改为结构化格式。

### Requirement 3: 修复 export/import 所有权校验

export 路由需要验证 characterIds 中的每个 ID 都属于当前用户，import 路由需要防止数据覆盖攻击。

### Requirement 4: 清理废弃的 register API 路由

`/api/auth/register` 路由使用密码注册模式，与新的 OTP 流程不符，应删除或重定向。
