import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireOasisBioOwnership, handleApiError } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';

// GET /api/oasisbios/[id]/eras
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id: oasisBioId } = await params;

    await requireOasisBioOwnership(oasisBioId, user.id);

    const eras = await prisma.eraIdentity.findMany({
      where: { oasisBioId },
      orderBy: { sortOrder: 'asc' },
    });

    return NextResponse.json(eras);
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/oasisbios/[id]/eras
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id: oasisBioId } = await params;
    const body = await request.json();

    if (!body.name || !body.eraType) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Name and eraType are required' } },
        { status: 400 }
      );
    }

    await requireOasisBioOwnership(oasisBioId, user.id);

    // sortOrder = current max + 1
    const maxOrder = await prisma.eraIdentity.aggregate({
      where: { oasisBioId },
      _max: { sortOrder: true },
    });

    const era = await prisma.eraIdentity.create({
      data: {
        oasisBioId,
        name: body.name,
        eraType: body.eraType,
        description: body.description ?? null,
        startYear: body.startYear ? Number(body.startYear) : null,
        endYear: body.endYear ? Number(body.endYear) : null,
        sortOrder: (maxOrder._max.sortOrder ?? 0) + 1,
      },
    });

    return NextResponse.json(era, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
