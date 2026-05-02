import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, requireOasisBioOwnership, handleApiError } from '@/lib/auth-utils';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth();
    const { id: oasisBioId } = params;

    await requireOasisBioOwnership(oasisBioId, user.id);

    const relationships = await prisma.characterRelationship.findMany({
      where: {
        OR: [
          { characterAId: oasisBioId },
          { characterBId: oasisBioId },
        ],
      },
      include: {
        characterA: {
          select: {
            id: true,
            title: true,
            slug: true,
            visibility: true,
          },
        },
        characterB: {
          select: {
            id: true,
            title: true,
            slug: true,
            visibility: true,
          },
        },
      },
    });

    const formattedRelationships = relationships.map(rel => ({
      id: rel.id,
      characterAId: rel.characterAId,
      characterBId: rel.characterBId,
      relationType: rel.relationType,
      description: rel.description,
      characterA: rel.characterA,
      characterB: rel.characterB,
      targetCharacter: rel.characterAId === oasisBioId ? rel.characterB : rel.characterA,
      createdAt: rel.createdAt,
    }));

    return NextResponse.json(formattedRelationships);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth();
    const { id: oasisBioId } = params;
    const body = await request.json();

    await requireOasisBioOwnership(oasisBioId, user.id);

    const { characterBId, relationType, description } = body;

    if (!characterBId || !relationType) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'characterBId and relationType are required' } },
        { status: 400 }
      );
    }

    const targetBio = await prisma.oasisBio.findUnique({
      where: { id: characterBId },
      select: { userId: true },
    });

    if (!targetBio) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Target character not found' } },
        { status: 404 }
      );
    }

    const existingRelationship = await prisma.characterRelationship.findFirst({
      where: {
        OR: [
          { characterAId: oasisBioId, characterBId },
          { characterAId: characterBId, characterBId: oasisBioId },
        ],
      },
    });

    if (existingRelationship) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Relationship already exists' } },
        { status: 400 }
      );
    }

    const relationship = await prisma.characterRelationship.create({
      data: {
        characterAId: oasisBioId,
        characterBId,
        relationType,
        description,
      },
      include: {
        characterA: {
          select: {
            id: true,
            title: true,
            slug: true,
            visibility: true,
          },
        },
        characterB: {
          select: {
            id: true,
            title: true,
            slug: true,
            visibility: true,
          },
        },
      },
    });

    return NextResponse.json({
      ...relationship,
      targetCharacter: relationship.characterB,
    }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth();
    const { id: oasisBioId } = params;
    const { searchParams } = new URL(request.url);
    const relationshipId = searchParams.get('relationshipId');

    if (!relationshipId) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'relationshipId is required' } },
        { status: 400 }
      );
    }

    await requireOasisBioOwnership(oasisBioId, user.id);

    const relationship = await prisma.characterRelationship.findUnique({
      where: { id: relationshipId },
    });

    if (!relationship) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Relationship not found' } },
        { status: 404 }
      );
    }

    if (relationship.characterAId !== oasisBioId && relationship.characterBId !== oasisBioId) {
      return NextResponse.json(
        { error: { code: 'FORBIDDEN', message: 'You can only delete relationships involving your character' } },
        { status: 403 }
      );
    }

    await prisma.characterRelationship.delete({
      where: { id: relationshipId },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}