import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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
        headers: {
          'Content-Type': 'application/json',
        },
      },
      oauth: {
        authorizationEndpoint: `${baseUrl}/api/oauth/authorize`,
        tokenEndpoint: `${baseUrl}/api/oauth/token`,
        scopes: {
          'context:read': 'Read identity context information',
          'context:full': 'Full access to identity context',
        },
      },
    },
    discovery: {
      type: 'application/json',
      url: `${baseUrl}/.well-known/oasisbio.json`,
    },
    links: {
      documentation: `${baseUrl}/docs`,
      developerPortal: `${baseUrl}/developer`,
      createIdentity: `${baseUrl}/create`,
    },
  };

  return NextResponse.json(contextDescriptor, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
    },
  });
}