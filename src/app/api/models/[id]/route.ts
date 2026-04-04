import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, handleApiError } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = await params;

    const model = await prisma.modelItem.findUnique({
      where: { id },
      include: { oasisBio: true },
    });

    if (!model) {
      return NextResponse.json({ error: 'Model not found' }, { status: 404 });
    }

    if (model.oasisBio.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
    const session = await requireAuth();
    const { id } = await params;
    const body = await request.json();

    const model = await prisma.modelItem.findUnique({
      where: { id },
      include: { oasisBio: true },
    });

    if (!model) {
      return NextResponse.json({ error: 'Model not found' }, { status: 404 });
    }

    if (model.oasisBio.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, filePath, previewImage, relatedWorldId, relatedEraId, modelFormat } = body;

    const updates: any = {};
    if (name) updates.name = name;
    if (filePath) updates.filePath = filePath;
    if (previewImage !== undefined) updates.previewImage = previewImage;
    if (relatedWorldId !== undefined) updates.relatedWorldId = relatedWorldId;
    if (relatedEraId !== undefined) updates.relatedEraId = relatedEraId;
    if (modelFormat) updates.modelFormat = modelFormat;

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
    const session = await requireAuth();
    const { id } = await params;

    const model = await prisma.modelItem.findUnique({
      where: { id },
      include: { oasisBio: true },
    });

    if (!model) {
      return NextResponse.json({ error: 'Model not found' }, { status: 404 });
    }

    if (model.oasisBio.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.modelItem.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Model deleted successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}
