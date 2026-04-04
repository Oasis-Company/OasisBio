import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireOasisBioOwnership, handleApiError } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';

// GET /api/oasisbios/[id]/worlds
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id: oasisBioId } = await params;

    await requireOasisBioOwnership(oasisBioId, session.user.id);

    const worlds = await prisma.worldItem.findMany({
      where: { oasisBioId },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(worlds);
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/oasisbios/[id]/worlds
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id: oasisBioId } = await params;
    const body = await request.json();

    if (!body.name || !body.summary) {
      return NextResponse.json({ error: 'Name and summary are required' }, { status: 400 });
    }

    await requireOasisBioOwnership(oasisBioId, session.user.id);

    const world = await prisma.worldItem.create({
      data: {
        name: body.name,
        summary: body.summary,
        timeSetting: body.timeSetting,
        geography: body.geography,
        physicsRules: body.physicsRules,
        socialStructure: body.socialStructure,
        aestheticKeywords: body.aestheticKeywords,
        majorConflict: body.majorConflict,
        visibility: body.visibility || 'private',
        timeline: body.timeline,
        rules: body.rules,
        factions: body.factions,
        oasisBioId,
      },
    });

    return NextResponse.json(world, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
