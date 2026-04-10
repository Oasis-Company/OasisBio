import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, handleApiError } from '@/lib/auth-utils';
import { exportService } from '@/services/exportService';
import { prisma } from '@/lib/prisma';

// POST /api/export
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const userId = user.id;
    const body = await request.json();
    const { type, characterIds, include } = body;

    if (!type || !['single', 'batch'].includes(type)) {
      return NextResponse.json({ error: 'Invalid export type' }, { status: 400 });
    }

    if (type === 'single' && (!characterIds || characterIds.length !== 1)) {
      return NextResponse.json({ error: 'Single export requires exactly one character ID' }, { status: 400 });
    }

    if (type === 'batch' && (!characterIds || characterIds.length === 0)) {
      return NextResponse.json({ error: 'Batch export requires at least one character ID' }, { status: 400 });
    }

    // Verify all characterIds belong to the current user
    const ownedBios = await prisma.oasisBio.findMany({
      where: { id: { in: characterIds }, userId },
      select: { id: true },
    });

    if (ownedBios.length !== characterIds.length) {
      return NextResponse.json(
        { error: 'One or more character IDs do not belong to you' },
        { status: 403 }
      );
    }

    const result = await exportService.exportCharacters({
      userId,
      characterIds,
      type,
      include: include || {
        character: true,
        dcos: true,
        references: true,
        world: true,
        model: true,
        cover: true,
        preview: true,
      },
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}

// GET /api/export — export history
export async function GET() {
  try {
    const user = await requireAuth();
    const exportHistory = await exportService.getExportHistory(user.id);
    return NextResponse.json(exportHistory, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}
