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

    const references = await prisma.referenceItem.findMany({
      where: { oasisBioId },
      orderBy: { title: 'asc' },
    });

    return NextResponse.json(references);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();

    const { oasisBioId, title, url, description, sourceType, tags } = body;

    if (!oasisBioId || !title || !url) {
      return NextResponse.json({ error: 'OasisBio ID, title, and URL are required' }, { status: 400 });
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

    const reference = await prisma.referenceItem.create({
      data: {
        oasisBioId,
        title,
        url,
        description,
        sourceType: sourceType || 'website',
        tags: tags || '',
      },
    });

    return NextResponse.json(reference, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
