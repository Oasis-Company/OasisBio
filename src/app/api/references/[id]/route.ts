import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireReferenceOwnership, handleApiError } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';

type ReferenceUpdateInput = {
  title?: string;
  url?: string;
  description?: string;
  type?: string;
};

// PUT /api/references/[id] - Update reference
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const body = await request.json();

    // Verify ownership
    await requireReferenceOwnership(id, user.id);

    const { title, url, description, type } = body;

    const updates: ReferenceUpdateInput = {};
    if (title !== undefined) updates.title = title;
    if (url !== undefined) updates.url = url;
    if (description !== undefined) updates.description = description;
    if (type !== undefined) updates.type = type;

    const reference = await prisma.referenceItem.update({
      where: { id },
      data: updates,
    });

    return NextResponse.json(reference);
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/references/[id] - Delete reference
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    // Verify ownership
    await requireReferenceOwnership(id, user.id);

    await prisma.referenceItem.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Reference deleted successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}
