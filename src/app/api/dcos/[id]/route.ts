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

    const { title, content, status, folderPath, eraId } = body;

    const updates: Record<string, unknown> = {};
    if (title !== undefined) updates.title = title;
    if (content !== undefined) updates.content = content;
    if (status !== undefined) updates.status = status;
    if (folderPath !== undefined) updates.folderPath = folderPath;
    if (eraId !== undefined) updates.eraId = eraId || null;

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
