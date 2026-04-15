import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireOasisBioOwnership, handleApiError } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';

// GET /api/oasisbios/[id]/abilities
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id: oasisBioId } = await params;

    await requireOasisBioOwnership(oasisBioId, user.id);

    const abilities = await prisma.ability.findMany({
      where: { oasisBioId },
      orderBy: { id: 'desc' },
    });

    return NextResponse.json(abilities);
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/oasisbios/[id]/abilities
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id: oasisBioId } = await params;
    const body = await request.json();

    if (!body.name || !body.category) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Name and category are required' } },
        { status: 400 }
      );
    }

    await requireOasisBioOwnership(oasisBioId, user.id);

    const ability = await prisma.ability.create({
      data: {
        name: body.name,
        category: body.category,
        level: body.level || 1,
        description: body.description || null,
        relatedWorldId: body.relatedWorldId || null,
        relatedEraId: body.relatedEraId || null,
        oasisBioId,
      },
    });

    return NextResponse.json(ability, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
