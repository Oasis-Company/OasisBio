import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireWorldDocumentOwnership, handleApiError } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';

// PUT /api/worlds/[id]/documents/[docId] — update a specific document
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; docId: string }> }
) {
  try {
    const user = await requireAuth();
    const { docId } = await params;
    const body = await request.json();

    // Verify document ownership via its parent world
    await requireWorldDocumentOwnership(docId, user.id);

    const updateData: Record<string, unknown> = {};
    if (body.title !== undefined) updateData.title = body.title;
    if (body.docType !== undefined) updateData.docType = body.docType;
    if (body.slug !== undefined) updateData.slug = body.slug;
    if (body.content !== undefined) updateData.content = body.content;
    if (body.folderPath !== undefined) updateData.folderPath = body.folderPath;
    if (body.sortOrder !== undefined) updateData.sortOrder = body.sortOrder;

    const document = await prisma.worldDocument.update({
      where: { id: docId },
      data: updateData,
    });

    return NextResponse.json(document);
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/worlds/[id]/documents/[docId] — delete a specific document
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; docId: string }> }
) {
  try {
    const user = await requireAuth();
    const { docId } = await params;

    await requireWorldDocumentOwnership(docId, user.id);

    await prisma.worldDocument.delete({
      where: { id: docId },
    });

    return NextResponse.json({ message: 'Document deleted successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}
