import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireAbilityOwnership, handleApiError } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';

// PUT /api/abilities/[id] - Update ability
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const body = await request.json();

    // Verify ownership
    await requireAbilityOwnership(id, user.id);

    const { name, description, category, level, isActive } = body;

    const updates: Record<string, unknown> = {};
    if (name !== undefined) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (category !== undefined) updates.category = category;
    if (level !== undefined) updates.level = Number(level);
    if (isActive !== undefined) updates.isActive = isActive;

    const ability = await prisma.ability.update({
      where: { id },
      data: updates as any,
    });

    return NextResponse.json(ability);
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/abilities/[id] - Delete ability
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    // Verify ownership
    await requireAbilityOwnership(id, user.id);

    await prisma.ability.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Ability deleted successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}
