import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, handleApiError } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';

// PUT /api/eras/[id] - Update era
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const body = await request.json();

    // Verify ownership
    const era = await prisma.eraIdentity.findUnique({
      where: { id },
      include: { oasisBio: true },
    });

    if (!era) {
      return NextResponse.json({ error: 'Era not found' }, { status: 404 });
    }

    if (era.oasisBio.userId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, eraType, description, startYear, endYear } = body;

    const updates: any = {};
    if (name) updates.name = name;
    if (eraType) updates.eraType = eraType;
    if (description) updates.description = description;
    if (startYear !== undefined) updates.startYear = startYear;
    if (endYear !== undefined) updates.endYear = endYear;

    const updatedEra = await prisma.eraIdentity.update({
      where: { id },
      data: updates,
    });

    return NextResponse.json(updatedEra);
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/eras/[id] - Delete era
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    // Verify ownership
    const era = await prisma.eraIdentity.findUnique({
      where: { id },
      include: { oasisBio: true },
    });

    if (!era) {
      return NextResponse.json({ error: 'Era not found' }, { status: 404 });
    }

    if (era.oasisBio.userId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.eraIdentity.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Era deleted successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}
