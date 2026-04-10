import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireOasisBioOwnership, handleApiError } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';

// GET /api/oasisbios/[id]/references
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id: oasisBioId } = await params;

    await requireOasisBioOwnership(oasisBioId, user.id);

    const references = await prisma.referenceItem.findMany({
      where: { oasisBioId },
      orderBy: { id: 'desc' },
    });

    return NextResponse.json(references);
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/oasisbios/[id]/references
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id: oasisBioId } = await params;
    const body = await request.json();

    if (!body.url || !body.title) {
      return NextResponse.json({ error: 'URL and title are required' }, { status: 400 });
    }

    await requireOasisBioOwnership(oasisBioId, user.id);

    const reference = await prisma.referenceItem.create({
      data: {
        url: body.url,
        title: body.title,
        description: body.description,
        sourceType: body.sourceType || 'article',
        provider: body.provider,
        coverImage: body.coverImage,
        metadata: body.metadata,
        eraId: body.eraId,
        worldId: body.worldId,
        tags: body.tags || '',
        oasisBioId,
      },
    });

    return NextResponse.json(reference, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
