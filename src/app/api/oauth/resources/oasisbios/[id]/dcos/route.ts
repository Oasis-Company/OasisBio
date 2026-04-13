import { NextRequest, NextResponse } from 'next/server';
import { requireOAuthToken } from '@/lib/oauth/middleware';
import { prisma } from '@/lib/prisma';

// GET /api/oauth/resources/oasisbios/[id]/dcos — DCOS documents
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const result = await requireOAuthToken(request, 'dcos:read');
  if ('error' in result) return result.error;

  const { userId } = result.context;
  const { id: oasisBioId } = await params;

  // Verify ownership
  const oasisBio = await prisma.oasisBio.findUnique({
    where: { id: oasisBioId },
    select: { userId: true },
  });

  if (!oasisBio) {
    return NextResponse.json(
      { error: 'not_found', error_description: 'Character not found' },
      { status: 404 }
    );
  }

  if (oasisBio.userId !== userId) {
    return NextResponse.json(
      { error: 'forbidden', error_description: 'You do not have access to this character' },
      { status: 403 }
    );
  }

  const dcosFiles = await prisma.dcosFile.findMany({
    where: { oasisBioId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      slug: true,
      content: true,
      folderPath: true,
      status: true,
      version: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return NextResponse.json({ data: dcosFiles, count: dcosFiles.length });
}
