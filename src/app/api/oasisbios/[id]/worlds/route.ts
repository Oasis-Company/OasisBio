import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireOasisBioOwnership, handleApiError } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import { serializeGenreTone } from '@/lib/world-utils';

// GET /api/oasisbios/[id]/worlds
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id: oasisBioId } = await params;

    await requireOasisBioOwnership(oasisBioId, user.id);

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
    const user = await requireAuth();
    const { id: oasisBioId } = await params;
    const body = await request.json();

    if (!body.name?.trim() || !body.summary?.trim()) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Name and summary are required' } },
        { status: 400 }
      );
    }

    await requireOasisBioOwnership(oasisBioId, user.id);

    // Serialize genre + tone into aestheticKeywords
    const aestheticKeywords =
      body.genre || body.tone
        ? serializeGenreTone(body.genre ?? '', body.tone ?? '')
        : (body.aestheticKeywords ?? null);

    const world = await prisma.worldItem.create({
      data: {
        name: body.name.trim(),
        summary: body.summary.trim(),
        timeSetting: body.timeSetting ?? null,
        geography: body.geography ?? null,
        physicsRules: body.physicsRules ?? null,
        socialStructure: body.socialStructure ?? null,
        aestheticKeywords,
        majorConflict: body.majorConflict ?? null,
        visibility: body.visibility ?? 'private',
        timeline: body.timeline ?? null,
        rules: body.rules ?? null,
        factions: body.factions ?? null,
        oasisBioId,
      },
    });

    return NextResponse.json(world, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
