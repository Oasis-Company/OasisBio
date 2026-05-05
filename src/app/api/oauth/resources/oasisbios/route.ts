import { NextRequest, NextResponse } from 'next/server';
import { requireOAuthToken } from '@/lib/oauth/middleware';
import { prisma } from '@/lib/prisma';
import { handleApiError } from '@/lib/auth-utils';

// GET /api/oauth/resources/oasisbios — list user's public characters
export async function GET(request: NextRequest) {
  try {
    const result = await requireOAuthToken(request, 'oasisbios:read');
    if ('error' in result) return result.error;

    const { userId } = result.context;

    const oasisBios = await prisma.oasisBio.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        tagline: true,
        coverImageUrl: true,
        visibility: true,
        status: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ data: oasisBios, count: oasisBios.length });
  } catch (error) {
    return handleApiError(error);
  }
}
