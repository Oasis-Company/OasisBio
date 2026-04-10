import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, handleApiError } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';

// GET /api/dcos - Get DCOS files for a specific OasisBio
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

    const dcosFiles = await prisma.dcosFile.findMany({
      where: { oasisBioId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(dcosFiles);
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/dcos - Create new DCOS file
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();

    const { oasisBioId, title, content } = body;

    if (!oasisBioId || !title || !content) {
      return NextResponse.json({ error: 'OasisBio ID, title, and content are required' }, { status: 400 });
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

    const dcosFile = await prisma.dcosFile.create({
      data: {
        oasisBioId,
        title,
        content,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
        folderPath: '/',
      },
    });

    return NextResponse.json(dcosFile, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
