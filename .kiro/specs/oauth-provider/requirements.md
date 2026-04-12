# Requirements Document: OasisBio OAuth Provider

## Introduction

让 OasisBio 成为标准 OAuth 2.0 授权服务器，使第三方应用（包括 OasisBio 自己的其他产品）可以通过 "Continue with Oasis" 按钮接入，并在授权后访问用户的身份信息、角色数据和 DCOS 文档内容。

实现标准 OAuth 2.0 Authorization Code Flow，支持 PKCE，提供开发者门户用于应用注册管理。

## Glossary

- **OAuth_Server**: OasisBio 的 OAuth 2.0 授权服务器
- **OAuth_App**: 第三方开发者注册的应用，持有 `client_id` 和 `client_secret`
- **Developer**: 注册并管理 OAuth_App 的 OasisBio 用户
- **Resource_Owner**: 被请求授权的 OasisBio 用户
- **Authorization_Code**: 短期一次性授权码，用于换取 access_token
- **Access_Token**: 第三方访问 OasisBio API 的凭证，有效期 1 小时
- **Refresh_Token**: 用于刷新 Access_Token 的长期凭证，有效期 30 天
- **Scope**: 授权范围，控制第三方可访问的数据类型
- **Consent_Screen**: 用户授权确认页面，显示应用信息和请求的权限
- **Developer_Portal**: 开发者注册和管理 OAuth_App 的界面

## Scope Definitions

| Scope | 数据范围 |
|-------|---------|
| `profile` | userId, username, displayName, avatarUrl |
| `email` | 用户邮箱地址 |
| `oasisbios:read` | 用户的公开角色列表（title, slug, tagline, coverImageUrl） |
| `oasisbios:full` | 角色完整数据（abilities, worlds, eras, references） |
| `dcos:read` | 角色的 DCOS 文档内容（title, content, folderPath） |

## Requirements

### Requirement 1: OAuth 应用注册（开发者门户）

**User Story:** As a developer, I want to register my application with OasisBio, so that I can implement "Continue with Oasis" in my product.

#### Acceptance Criteria

1. THE Developer_Portal SHALL be accessible at `/developer/apps`
2. WHEN a developer creates an OAuth_App, THE OAuth_Server SHALL generate a unique `client_id` (UUID) and `client_secret` (32-byte random hex)
3. THE OAuth_App SHALL store: name, description, homepage_url, redirect_uris (array), logo_url (optional), owner_user_id
4. WHEN a developer saves redirect URIs, THE OAuth_Server SHALL validate each URI is a valid HTTPS URL (or `http://localhost` for development)
5. THE Developer_Portal SHALL allow developers to view, update, and delete their OAuth_Apps
6. WHEN an OAuth_App is deleted, THE OAuth_Server SHALL revoke all active tokens issued for that app
7. THE OAuth_Server SHALL allow a maximum of 10 OAuth_Apps per developer account

### Requirement 2: Authorization Code Flow

**User Story:** As a resource owner, I want to see a clear consent screen before authorizing a third-party app, so that I know exactly what data I'm sharing.

#### Acceptance Criteria

1. WHEN a third-party app redirects to `/oauth/authorize`, THE OAuth_Server SHALL validate `client_id`, `redirect_uri`, `scope`, `state`, and `code_challenge` (PKCE)
2. IF any required parameter is missing or invalid, THEN THE OAuth_Server SHALL return an error to the redirect_uri with `error=invalid_request`
3. WHEN parameters are valid, THE OAuth_Server SHALL display the Consent_Screen showing: app name, app logo, app homepage, requested scopes in human-readable form, and the authorizing user's identity
4. WHEN a Resource_Owner clicks "Authorize", THE OAuth_Server SHALL generate an Authorization_Code (valid for 10 minutes, single-use) and redirect to the redirect_uri with `code` and `state`
5. WHEN a Resource_Owner clicks "Deny", THE OAuth_Server SHALL redirect to the redirect_uri with `error=access_denied`
6. THE Authorization_Code SHALL be bound to: client_id, user_id, redirect_uri, scope, code_challenge

### Requirement 3: Token Exchange

**User Story:** As a third-party app, I want to exchange an authorization code for tokens, so that I can access the user's data.

#### Acceptance Criteria

1. WHEN a POST request is made to `/oauth/token` with `grant_type=authorization_code`, THE OAuth_Server SHALL validate: client_id, client_secret, code, redirect_uri, code_verifier (PKCE)
2. IF the Authorization_Code is expired or already used, THEN THE OAuth_Server SHALL return `error=invalid_grant`
3. WHEN validation succeeds, THE OAuth_Server SHALL return: `access_token`, `token_type=Bearer`, `expires_in=3600`, `refresh_token`, `scope`
4. WHEN a POST request is made to `/oauth/token` with `grant_type=refresh_token`, THE OAuth_Server SHALL issue a new Access_Token and rotate the Refresh_Token
5. IF the Refresh_Token is expired or revoked, THEN THE OAuth_Server SHALL return `error=invalid_grant`
6. THE OAuth_Server SHALL support token revocation at `POST /oauth/revoke`

### Requirement 4: Protected Resource API

**User Story:** As a third-party app, I want to access the authorized user's OasisBio data using the access token, so that I can build features on top of their identity.

#### Acceptance Criteria

1. THE OAuth_Server SHALL expose `GET /oauth/userinfo` returning profile data for the `profile` scope
2. THE OAuth_Server SHALL expose `GET /oauth/userinfo` including email for the `email` scope
3. THE OAuth_Server SHALL expose `GET /oauth/resources/oasisbios` returning character list for the `oasisbios:read` scope
4. THE OAuth_Server SHALL expose `GET /oauth/resources/oasisbios/[id]` returning full character data for the `oasisbios:full` scope
5. THE OAuth_Server SHALL expose `GET /oauth/resources/oasisbios/[id]/dcos` returning DCOS documents for the `dcos:read` scope
6. IF a request uses a token without the required scope, THEN THE OAuth_Server SHALL return `error=insufficient_scope` with HTTP 403
7. IF a request uses an expired or invalid token, THEN THE OAuth_Server SHALL return `error=invalid_token` with HTTP 401
8. THE OAuth_Server SHALL expose `GET /oauth/.well-known/openid-configuration` for OIDC discovery

### Requirement 5: Security

**User Story:** As a system, I want the OAuth implementation to follow security best practices, so that user data is protected.

#### Acceptance Criteria

1. THE OAuth_Server SHALL require PKCE (code_challenge + code_verifier) for all authorization requests
2. THE OAuth_Server SHALL validate the `state` parameter to prevent CSRF attacks
3. THE OAuth_Server SHALL use `code_challenge_method=S256` (SHA-256)
4. THE Access_Token SHALL be a signed JWT containing: sub (user_id), client_id, scope, iat, exp
5. THE OAuth_Server SHALL store only the hash of client_secret, never the plaintext
6. THE OAuth_Server SHALL rate-limit token endpoint requests to 10 per minute per client_id
7. WHEN a Refresh_Token is used, THE OAuth_Server SHALL rotate it (issue new, invalidate old)

### Requirement 6: "Continue with Oasis" Button

**User Story:** As a third-party developer, I want a ready-to-use "Continue with Oasis" button component, so that I can quickly integrate OasisBio login.

#### Acceptance Criteria

1. THE OAuth_Server SHALL provide documentation at `/developer/docs` explaining the integration flow
2. THE OAuth_Server SHALL provide a JavaScript SDK snippet that generates the authorization URL
3. THE Developer_Portal SHALL display the exact redirect URL format and required parameters for each registered app
