import { NextResponse } from 'next/server';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://oasisbio.com';

// GET /oauth/.well-known/openid-configuration — OIDC discovery document
export async function GET() {
  return NextResponse.json({
    issuer: BASE_URL,
    authorization_endpoint: `${BASE_URL}/oauth/authorize`,
    token_endpoint: `${BASE_URL}/api/oauth/token`,
    userinfo_endpoint: `${BASE_URL}/api/oauth/userinfo`,
    revocation_endpoint: `${BASE_URL}/api/oauth/revoke`,
    jwks_uri: `${BASE_URL}/api/oauth/.well-known/jwks.json`,
    response_types_supported: ['code'],
    grant_types_supported: ['authorization_code', 'refresh_token'],
    subject_types_supported: ['public'],
    id_token_signing_alg_values_supported: ['HS256'],
    scopes_supported: ['profile', 'email', 'oasisbios:read', 'oasisbios:full', 'dcos:read'],
    token_endpoint_auth_methods_supported: ['client_secret_post'],
    code_challenge_methods_supported: ['S256'],
    claims_supported: ['sub', 'username', 'display_name', 'avatar_url', 'email'],
  });
}
