import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireOasisBioOwnership, handleApiError } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';

// GET /api/oasisbios/[id] - Get specific OasisBio
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    // Single query: fetch with all relations and verify ownership in one shot
    const oasisBio = await prisma.oasisBio.findUnique({
      where: { id },
      include: {
        abilities: true,
        eras: true,
        dcosFiles: true,
        references: true,
        worlds: true,
        models: true,
      },
    });

    if (!oasisBio) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'OasisBio not found' } },
        { status: 404 }
      );
    }
    if (oasisBio.userId !== user.id) {
      return NextResponse.json(
        { error: { code: 'FORBIDDEN', message: 'You do not own this OasisBio' } },
        { status: 403 }
      );
    }

    return NextResponse.json(oasisBio);
  } catch (error) {
    return handleApiError(error);
  }
}

// PUT /api/oasisbios/[id] - Update OasisBio
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const body = await request.json();

    // requireOasisBioOwnership already confirms existence + ownership
    await requireOasisBioOwnership(id, user.id);

    const { title, tagline, summary, identityMode, birthDate, gender, pronouns, placeOfOrigin, currentEra, species, status, description, visibility } = body;

    const updates: Record<string, unknown> = {};
    if (title !== undefined) updates.title = title;
    if (tagline !== undefined) updates.tagline = tagline || null;
    if (summary !== undefined) updates.summary = summary || null;
    if (identityMode !== undefined) updates.identityMode = identityMode;
    if (birthDate !== undefined) updates.birthDate = birthDate ? new Date(birthDate) : null;
    if (gender !== undefined) updates.gender = gender || null;
    if (pronouns !== undefined) updates.pronouns = pronouns || null;
    if (placeOfOrigin !== undefined) updates.placeOfOrigin = placeOfOrigin || null;
    if (currentEra !== undefined) updates.currentEra = currentEra || null;
    if (species !== undefined) updates.species = species || null;
    if (status !== undefined) updates.status = status;
    if (description !== undefined) updates.description = description || null;
    if (visibility !== undefined) updates.visibility = visibility;

    const oasisBio = await prisma.oasisBio.update({
      where: { id },
      data: updates,
    });

    return NextResponse.json(oasisBio);
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/oasisbios/[id] - Delete OasisBio
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    await requireOasisBioOwnership(id, user.id);

    await prisma.oasisBio.delete({ where: { id } });

    return NextResponse.json({ message: 'OasisBio deleted successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}
