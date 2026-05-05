import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, handleApiError } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';

// GET /api/abilities - Get abilities for a specific OasisBio
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const searchParams = request.nextUrl.searchParams;
    const oasisBioId = searchParams.get('oasisBioId');

    if (!oasisBioId) {
      return NextResponse.json({ error: 'OasisBio ID is required' }, { status: 400 });
    }

    // Verify ownership of the OasisBio
    const oasisBio = await prisma.oasisBio.findUnique({
      where: { id: oasisBioId },
    });

    if (!oasisBio) {
      return NextResponse.json({ error: 'OasisBio not found' }, { status: 404 });
    }

    if (oasisBio.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const abilities = await prisma.ability.findMany({
      where: { oasisBioId },
    });

    return NextResponse.json(abilities);
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/abilities - Create new ability
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();

    const { oasisBioId, name, description, category, level } = body;

    if (!oasisBioId || !name) {
      return NextResponse.json({ error: 'OasisBio ID and name are required' }, { status: 400 });
    }

    // Verify ownership of the OasisBio
    const oasisBio = await prisma.oasisBio.findUnique({
      where: { id: oasisBioId },
    });

    if (!oasisBio) {
      return NextResponse.json({ error: 'OasisBio not found' }, { status: 404 });
    }

    if (oasisBio.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const ability = await prisma.ability.create({
      data: {
        oasisBioId,
        name,
        description,
        category: category || 'general',
        level: level || 1,
      },
    });

    return NextResponse.json(ability, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
