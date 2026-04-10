import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, handleApiError } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const searchParams = request.nextUrl.searchParams;
    const oasisBioId = searchParams.get('oasisBioId');

    if (!oasisBioId) {
      return NextResponse.json({ error: 'OasisBio ID is required' }, { status: 400 });
    }

    const oasisBio = await prisma.oasisBio.findUnique({
      where: { id: oasisBioId },
    });

    if (!oasisBio) {
      return NextResponse.json({ error: 'OasisBio not found' }, { status: 404 });
    }

    if (oasisBio.userId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const worlds = await prisma.worldItem.findMany({
      where: { oasisBioId },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(worlds);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();

    const { oasisBioId, name, summary, timeSetting, geography, physicsRules, socialStructure, aestheticKeywords, majorConflict } = body;

    if (!oasisBioId || !name || !summary) {
      return NextResponse.json({ error: 'OasisBio ID, name, and summary are required' }, { status: 400 });
    }

    const oasisBio = await prisma.oasisBio.findUnique({
      where: { id: oasisBioId },
    });

    if (!oasisBio) {
      return NextResponse.json({ error: 'OasisBio not found' }, { status: 404 });
    }

    if (oasisBio.userId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const world = await prisma.worldItem.create({
      data: {
        oasisBioId,
        name,
        summary,
        timeSetting,
        geography,
        physicsRules,
        socialStructure,
        aestheticKeywords,
        majorConflict,
      },
    });

    return NextResponse.json(world, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
