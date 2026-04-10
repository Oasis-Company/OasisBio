import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireWorldOwnership, handleApiError } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import { serializeGenreTone } from '@/lib/world-utils';

// PUT /api/worlds/[id] — Update world (all fields)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const body = await request.json();

    await requireWorldOwnership(id, user.id);

    // Build update payload — only include fields that were sent
    const updates: Record<string, unknown> = {};

    const textFields = [
      'name', 'summary', 'timeSetting', 'timeline',
      'physicsRules', 'rules', 'socialStructure', 'factions',
      'geography', 'majorConflict', 'visibility',
    ] as const;

    for (const field of textFields) {
      if (field in body) updates[field] = body[field];
    }

    // Serialize genre + tone into aestheticKeywords
    if ('genre' in body || 'tone' in body) {
      // Fetch current value to merge
      const current = await prisma.worldItem.findUnique({
        where: { id },
        select: { aestheticKeywords: true },
      });
      const existing = current?.aestheticKeywords
        ? (() => { try { return JSON.parse(current.aestheticKeywords); } catch { return {}; } })()
        : {};
      updates.aestheticKeywords = JSON.stringify({
        genre: 'genre' in body ? body.genre : (existing.genre ?? ''),
        tone: 'tone' in body ? body.tone : (existing.tone ?? ''),
      });
    }

    const world = await prisma.worldItem.update({
      where: { id },
      data: updates,
    });

    return NextResponse.json(world);
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/worlds/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    await requireWorldOwnership(id, user.id);

    await prisma.worldItem.delete({ where: { id } });

    return NextResponse.json({ message: 'World deleted successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}

// GET /api/worlds/[id] — Get single world with linked characters
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    const world = await prisma.worldItem.findUnique({
      where: { id },
      include: {
        oasisBio: {
          select: {
            id: true,
            userId: true,
            title: true,
            coverImageUrl: true,
            slug: true,
          },
        },
      },
    });

    if (!world) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'World not found' } },
        { status: 404 }
      );
    }

    if (world.oasisBio.userId !== user.id) {
      return NextResponse.json(
        { error: { code: 'FORBIDDEN', message: 'Forbidden' } },
        { status: 403 }
      );
    }

    return NextResponse.json(world);
  } catch (error) {
    return handleApiError(error);
  }
}
