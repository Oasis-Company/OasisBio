import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireWorldDocumentOwnership, handleApiError } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';

// PUT /api/worlddocuments/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id: documentId } = await params;
    const body = await request.json();

    await requireWorldDocumentOwnership(documentId, session.user.id);

    const updatedDocument = await prisma.worldDocument.update({
      where: { id: documentId },
      data: {
        title: body.title,
        docType: body.docType,
        slug: body.slug || body.title.toLowerCase().replace(/\s+/g, '-'),
        content: body.content,
        folderPath: body.folderPath,
        sortOrder: body.sortOrder,
      },
    });

    return NextResponse.json(updatedDocument);
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/worlddocuments/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id: documentId } = await params;

    await requireWorldDocumentOwnership(documentId, session.user.id);

    await prisma.worldDocument.delete({
      where: { id: documentId },
    });

    return NextResponse.json({ message: 'World document deleted successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}
