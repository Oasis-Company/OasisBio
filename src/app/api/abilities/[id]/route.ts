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

    const updates: any = {};
    if (name) updates.name = name;
    if (description) updates.description = description;
    if (category) updates.category = category;
    if (level) updates.level = level;
    if (isActive !== undefined) updates.isActive = isActive;

    const ability = await prisma.ability.update({
      where: { id },
      data: updates,
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
