import { NextRequest, NextResponse } from 'next/server';
import { requireOAuthToken } from '@/lib/oauth/middleware';
import { prisma } from '@/lib/prisma';
import { handleApiError } from '@/lib/auth-utils';

// GET /api/oauth/resources/oasisbios/[id] — full character data
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const result = await requireOAuthToken(request, 'oasisbios:full');
    if ('error' in result) return result.error;

    const { userId } = result.context;
    const { id } = await params;

    const oasisBio = await prisma.oasisBio.findUnique({
      where: { id },
      include: {
        abilities: {
          select: { id: true, name: true, category: true, level: true, description: true, sourceType: true },
        },
        eras: {
          select: { id: true, name: true, eraType: true, startYear: true, endYear: true, description: true, sortOrder: true },
          orderBy: { sortOrder: 'asc' },
        },
        worlds: {
          select: { id: true, name: true, summary: true, visibility: true },
        },
        references: {
          select: { id: true, url: true, title: true, description: true, sourceType: true, provider: true, tags: true },
        },
        models: {
          select: { id: true, name: true, modelFormat: true, isPrimary: true },
        },
      },
    });

    if (!oasisBio) {
      return NextResponse.json(
        { error: 'not_found', error_description: 'Character not found' },
        { status: 404 }
      );
    }

    // Verify ownership
    if (oasisBio.userId !== userId) {
      return NextResponse.json(
        { error: 'forbidden', error_description: 'You do not have access to this character' },
        { status: 403 }
      );
    }

    return NextResponse.json(oasisBio);
  } catch (error) {
    return handleApiError(error);
  }
}
