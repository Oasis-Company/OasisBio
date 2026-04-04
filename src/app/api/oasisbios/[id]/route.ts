import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireOasisBioOwnership, handleApiError } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';

// GET /api/oasisbios/[id] - Get specific OasisBio
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = await params;

    await requireOasisBioOwnership(id, session.user.id);

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
      return NextResponse.json({ error: 'OasisBio not found' }, { status: 404 });
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
    const session = await requireAuth();
    const { id } = await params;
    const body = await request.json();

    await requireOasisBioOwnership(id, session.user.id);

    const { title, tagline, identityMode, birthDate, gender, pronouns, placeOfOrigin, currentEra, species, status, description, visibility } = body;

    const updates: any = {};
    if (title) updates.title = title;
    if (tagline) updates.tagline = tagline;
    if (identityMode) updates.identityMode = identityMode;
    if (birthDate) updates.birthDate = new Date(birthDate);
    if (gender) updates.gender = gender;
    if (pronouns) updates.pronouns = pronouns;
    if (placeOfOrigin) updates.placeOfOrigin = placeOfOrigin;
    if (currentEra) updates.currentEra = currentEra;
    if (species) updates.species = species;
    if (status) updates.status = status;
    if (description) updates.description = description;
    if (visibility) updates.visibility = visibility;

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
    const session = await requireAuth();
    const { id } = await params;

    await requireOasisBioOwnership(id, session.user.id);

    await prisma.oasisBio.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'OasisBio deleted successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}
