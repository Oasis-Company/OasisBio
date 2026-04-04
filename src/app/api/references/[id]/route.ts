import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireReferenceOwnership, handleApiError } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';

// PUT /api/references/[id] - Update reference
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = await params;
    const body = await request.json();

    // Verify ownership
    await requireReferenceOwnership(id, session.user.id);

    const { title, url, description, type } = body;

    const updates: any = {};
    if (title) updates.title = title;
    if (url) updates.url = url;
    if (description) updates.description = description;
    if (type) updates.type = type;

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
    const session = await requireAuth();
    const { id } = await params;

    // Verify ownership
    await requireReferenceOwnership(id, session.user.id);

    await prisma.referenceItem.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Reference deleted successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}
