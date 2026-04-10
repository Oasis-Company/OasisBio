import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireDcosFileOwnership, handleApiError } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';

// PUT /api/dcos/[id] - Update DCOS file
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const body = await request.json();

    // Verify ownership
    await requireDcosFileOwnership(id, user.id);

    const { name, content, type } = body;

    const updates: any = {};
    if (name) updates.name = name;
    if (content) updates.content = content;
    if (type) updates.type = type;

    const dcosFile = await prisma.dcosFile.update({
      where: { id },
      data: updates,
    });

    return NextResponse.json(dcosFile);
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/dcos/[id] - Delete DCOS file
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    // Verify ownership
    await requireDcosFileOwnership(id, user.id);

    await prisma.dcosFile.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'DCOS file deleted successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}
