import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, handleApiError } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';

// GET /api/oasisbios - Get user's OasisBios
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const userId = user.id;

    const oasisBios = await prisma.oasisBio.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(oasisBios);
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/oasisbios - Create new OasisBio
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const userId = user.id;

    const { title, tagline, identityMode, birthDate, gender, pronouns, placeOfOrigin, currentEra, species, status, description } = body;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    // Generate slug from title
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

    const oasisBio = await prisma.oasisBio.create({
      data: {
        userId,
        title,
        slug,
        tagline,
        identityMode: identityMode || 'real',
        birthDate: birthDate ? new Date(birthDate) : null,
        gender,
        pronouns,
        placeOfOrigin,
        currentEra,
        species,
        status: status || 'draft',
        description,
        visibility: 'private',
      },
    });

    return NextResponse.json(oasisBio, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
