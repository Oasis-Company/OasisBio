import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, handleApiError } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const userId = user.id;

    const models = await prisma.modelItem.findMany({
      where: { 
        oasisBio: { userId } 
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(models);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const userId = user.id;

    const { name, filePath, previewImage, oasisBioId, relatedWorldId, relatedEraId, modelFormat } = body;

    if (!name || !filePath) {
      return NextResponse.json({ error: 'Name and filePath are required' }, { status: 400 });
    }

    let targetOasisBioId = oasisBioId;

    if (!targetOasisBioId) {
      const firstOasisBio = await prisma.oasisBio.findFirst({
        where: { userId },
        orderBy: { createdAt: 'asc' },
      });

      if (!firstOasisBio) {
        return NextResponse.json({ error: 'No OasisBio found. Please create one first.' }, { status: 400 });
      }

      targetOasisBioId = firstOasisBio.id;
    } else {
      const oasisBio = await prisma.oasisBio.findUnique({
        where: { id: targetOasisBioId },
      });

      if (!oasisBio) {
        return NextResponse.json({ error: 'OasisBio not found' }, { status: 404 });
      }

      if (oasisBio.userId !== userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    const model = await prisma.modelItem.create({
      data: {
        name,
        filePath,
        previewImage,
        oasisBioId: targetOasisBioId,
        relatedWorldId,
        relatedEraId,
        modelFormat: modelFormat || 'glb',
      },
    });

    return NextResponse.json(model, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
