import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, handleApiError } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';

type ModelUpdateInput = {
  name?: string;
  filePath?: string;
  previewImage?: string | null;
  relatedWorldId?: string | null;
  relatedEraId?: string | null;
  modelFormat?: string;
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    const model = await prisma.modelItem.findUnique({
      where: { id },
      include: { oasisBio: true },
    });

    if (!model) {
      return NextResponse.json({ error: 'Model not found' }, { status: 404 });
    }

    if (model.oasisBio.userId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    return NextResponse.json(model);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const body = await request.json();

    const model = await prisma.modelItem.findUnique({
      where: { id },
      include: { oasisBio: true },
    });

    if (!model) {
      return NextResponse.json({ error: 'Model not found' }, { status: 404 });
    }

    if (model.oasisBio.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { name, filePath, previewImage, relatedWorldId, relatedEraId, modelFormat } = body;

    const updates: ModelUpdateInput = {};
    if (name !== undefined) updates.name = name;
    if (filePath !== undefined) updates.filePath = filePath;
    if (previewImage !== undefined) updates.previewImage = previewImage;
    if (relatedWorldId !== undefined) updates.relatedWorldId = relatedWorldId;
    if (relatedEraId !== undefined) updates.relatedEraId = relatedEraId;
    if (modelFormat !== undefined) updates.modelFormat = modelFormat;

    const updatedModel = await prisma.modelItem.update({
      where: { id },
      data: updates,
    });

    return NextResponse.json(updatedModel);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    const model = await prisma.modelItem.findUnique({
      where: { id },
      include: { oasisBio: true },
    });

    if (!model) {
      return NextResponse.json({ error: 'Model not found' }, { status: 404 });
    }

    if (model.oasisBio.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.modelItem.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Model deleted successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}
