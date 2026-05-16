---
title: "OAuth Integration Guide"
description: "Technical guide for developers integrating with OasisBio's OAuth 2.0 provider for identity verification."
category: "guides"
---

# OAuth Integration Guide

This guide explains how to integrate with OasisBio's OAuth 2.0 provider to use it as an identity layer for your application.

## Overview

OasisBio provides OAuth 2.0 with OpenID Connect (OIDC) support, allowing you to:

- Authenticate users with their OasisBio identity
- Access character data with user permission
- Build applications that trust OasisBio identities

## OAuth Endpoints

| Endpoint | URL |
|----------|-----|
| Authorization | `https://oasisbio.oasiscompany.org/oauth/authorize` |
| Token | `https://oasisbio.oasiscompany.org/api/oauth/token` |
| UserInfo | `https://oasisbio.oasiscompany.org/api/oauth/userinfo` |
| JWKS | `https://oasisbio.oasiscompany.org/oauth/.well-known/jwks.json` |
| OpenID Config | `https://oasisbio.oasiscompany.org/oauth/.well-known/openid-configuration` |

## Available Scopes

| Scope | Access |
|-------|--------|
| `profile` | Username, display name, avatar |
| `email` | Email address |
| `oasisbios:read` | List of public characters |
| `oasisbios:full` | Full character data |
| `dcos:read` | DCOS document content |

## Integration Steps

### 1. Register Your Application

Create an OAuth app in the OasisBio developer portal:

1. Go to `/developer/apps`
2. Click **"New App"**
3. Provide:
   - App name
   - Redirect URI(s)
   - Logo (optional)
4. Copy your `client_id` and `client_secret`

### 2. Implement Authorization Flow

#### Step 2.1: Redirect to Authorization

```
GET https://oasisbio.oasiscompany.org/oauth/authorize
  ?client_id=YOUR_CLIENT_ID
  &redirect_uri=https://yourapp.com/callback
  &response_type=code
  &scope=profile email oasisbios:read
  &state=RANDOM_STATE_STRING
```

#### Step 2.2: Handle the Callback

After user consent, OasisBio redirects to:

```
GET https://yourapp.com/callback
  ?code=AUTHORIZATION_CODE
  &state=RANDOM_STATE_STRING
```

#### Step 2.3: Exchange Code for Tokens

```bash
curl -X POST https://oasisbio.oasiscompany.org/api/oauth/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=authorization_code" \
  -d "code=AUTHORIZATION_CODE" \
  -d "redirect_uri=https://yourapp.com/callback" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET"
```

Response:

```json
{
  "access_token": "eyJhbGc...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "dGhpcyBpcy...",
  "scope": "profile email oasisbios:read"
}
```

### 3. Use the Access Token

```bash
curl https://oasisbio.oasiscompany.org/api/oauth/userinfo \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

Response:

```json
{
  "sub": "user_123",
  "username": "johndoe",
  "display_name": "John Doe",
  "avatar_url": "https://oasisbio.oasiscompany.org/avatars/johndoe.png",
  "email": "john@example.com"
}
```

### 4. Refresh Tokens (Optional)

```bash
curl -X POST https://oasisbio.oasiscompany.org/api/oauth/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=refresh_token" \
  -d "refresh_token=REFRESH_TOKEN" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET"
```

## Example Applications

### Node.js Example

```typescript
import axios from 'axios';

const clientId = process.env.OASIS_CLIENT_ID;
const clientSecret = process.env.OASIS_CLIENT_SECRET;

async function getUserInfo(accessToken: string) {
  const response = await axios.get(
    'https://oasisbio.oasiscompany.org/api/oauth/userinfo',
    {
      headers: { Authorization: `Bearer ${accessToken}` }
    }
  );
  return response.data;
}
```

### Python Example

```python
import requests

def get_user_info(access_token):
    response = requests.get(
        'https://oasisbio.oasiscompany.org/api/oauth/userinfo',
        headers={'Authorization': f'Bearer {access_token}'}
    )
    return response.json()
```

## Security Best Practices

1. **Never expose `client_secret`** in client-side code
2. **Validate state parameter** to prevent CSRF attacks
3. **Use HTTPS** for all OAuth communications
4. **Store tokens securely** (encrypted, not in localStorage)
5. **Implement token rotation** for long-lived sessions

## Error Handling

| Error | Description |
|-------|-------------|
| `invalid_grant` | Authorization code expired or invalid |
| `invalid_client` | Client authentication failed |
| `access_denied` | User denied the authorization request |
| `invalid_scope` | Requested scope is not allowed |

## Resources

- [Getting Started](getting-started) - User guide
- [Nuwa AI](using-nuwa-ai) - Character AI features
- [OasisBio Features](../features/oasisbio) - Platform capabilities
