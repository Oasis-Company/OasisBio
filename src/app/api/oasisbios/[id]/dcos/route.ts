import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireOasisBioOwnership, handleApiError } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';

// GET /api/oasisbios/[id]/dcos
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id: oasisBioId } = await params;

    await requireOasisBioOwnership(oasisBioId, user.id);

    const dcosFiles = await prisma.dcosFile.findMany({
      where: { oasisBioId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(dcosFiles);
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/oasisbios/[id]/dcos
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id: oasisBioId } = await params;
    const body = await request.json();

    if (!body.title || !body.content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    await requireOasisBioOwnership(oasisBioId, user.id);

    const dcosFile = await prisma.dcosFile.create({
      data: {
        title: body.title,
        slug: body.slug || body.title.toLowerCase().replace(/\s+/g, '-'),
        content: body.content,
        folderPath: body.folderPath || '/',
        status: body.status || 'draft',
        eraId: body.eraId,
        oasisBioId,
      },
    });

    return NextResponse.json(dcosFile, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
