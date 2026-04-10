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
