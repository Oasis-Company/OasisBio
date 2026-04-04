import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireWorldOwnership, handleApiError } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';

// PUT /api/worlds/[id] - Update world
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = await params;
    const body = await request.json();

    // Verify ownership
    await requireWorldOwnership(id, session.user.id);

    const { name, description, type, setting } = body;

    const updates: any = {};
    if (name) updates.name = name;
    if (description) updates.description = description;
    if (type) updates.type = type;
    if (setting) updates.setting = setting;

    const world = await prisma.worldItem.update({
      where: { id },
      data: updates,
    });

    return NextResponse.json(world);
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/worlds/[id] - Delete world
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = await params;

    // Verify ownership
    await requireWorldOwnership(id, session.user.id);

    await prisma.worldItem.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'World deleted successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}
