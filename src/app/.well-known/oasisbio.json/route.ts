import { NextResponse } from 'next/server';

/**
 * GET /.well-known/oasisbio.json
 *
 * Machine-discovery endpoint. AI agents and developer tools use this to
 * automatically discover OasisBio Fetch API + OAuth endpoints.
 */
export async function GET(request: Request) {
  const baseUrl = new URL(request.url).origin;

  const contextDescriptor = {
    name: 'OasisBio',
    description: 'Open Identity Context Infrastructure for the AI Era',
    version: '1.0',
    protocols: {
      rest: {
        endpoint: `${baseUrl}/api/context/{slug}`,
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        example: `curl ${baseUrl}/api/context/your-slug`,
        note: 'Only public OasisBio identities are accessible without authentication.',
      },
      oauth: {
        authorizationEndpoint: `${baseUrl}/api/oauth/authorize`,
        tokenEndpoint: `${baseUrl}/api/oauth/token`,
        revocationEndpoint: `${baseUrl}/api/oauth/revoke`,
        scopes: {
          'profile': 'username, display name, avatar URL',
          'email': 'email address',
          'oasisbios:read': 'Character list (title, slug, cover)',
          'oasisbios:full': 'Full character data (abilities, worlds, eras, references)',
          'dcos:read': 'DCOS document content',
        },
        grantTypes: ['authorization_code', 'refresh_token'],
        pkceRequired: true,
      },
    },
    discovery: {
      type: 'application/json',
      url: `${baseUrl}/.well-known/oasisbio.json`,
    },
    links: {
      documentation: `${baseUrl}/developer/docs`,
      developerPortal: `${baseUrl}/developer`,
      createIdentity: `${baseUrl}/dashboard`,
      explore: `${baseUrl}/explore`,
    },
  };

  return NextResponse.json(contextDescriptor, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
    },
  });
}