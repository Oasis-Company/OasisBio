import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireWorldOwnership, handleApiError } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';

// GET /api/worlds/[id]/documents — list documents for a world
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id: worldId } = await params;

    await requireWorldOwnership(worldId, user.id);

    const documents = await prisma.worldDocument.findMany({
      where: { worldId },
      orderBy: { sortOrder: 'asc' },
    });

    return NextResponse.json(documents);
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/worlds/[id]/documents — create a new document
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id: worldId } = await params;
    const body = await request.json();

    if (!body.title || !body.content || !body.docType) {
      return NextResponse.json({ error: 'Title, content, and document type are required' }, { status: 400 });
    }

    await requireWorldOwnership(worldId, user.id);

    const document = await prisma.worldDocument.create({
      data: {
        title: body.title,
        docType: body.docType,
        slug: body.slug || body.title.toLowerCase().replace(/\s+/g, '-'),
        content: body.content,
        folderPath: body.folderPath ?? '/',
        sortOrder: body.sortOrder ?? 0,
        worldId,
      },
    });

    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
