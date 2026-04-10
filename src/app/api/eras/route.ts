import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, handleApiError } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';

// GET /api/eras - Get eras for a specific OasisBio
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
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const eras = await prisma.eraIdentity.findMany({
      where: { oasisBioId },
      orderBy: { startYear: 'asc' },
    });

    return NextResponse.json(eras);
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/eras - Create new era
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();

    const { oasisBioId, name, eraType, description, startYear, endYear } = body;

    if (!oasisBioId || !name || !eraType || startYear === undefined) {
      return NextResponse.json({ error: 'OasisBio ID, name, eraType, and startYear are required' }, { status: 400 });
    }

    // Verify ownership of the OasisBio
    const oasisBio = await prisma.oasisBio.findUnique({
      where: { id: oasisBioId },
    });

    if (!oasisBio) {
      return NextResponse.json({ error: 'OasisBio not found' }, { status: 404 });
    }

    if (oasisBio.userId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const era = await prisma.eraIdentity.create({
      data: {
        oasisBioId,
        name,
        eraType,
        description,
        startYear,
        endYear,
      },
    });

    return NextResponse.json(era, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
