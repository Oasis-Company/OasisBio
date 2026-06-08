import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, handleApiError } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';

// GET /api/oasisbios - Get user's OasisBios
export async function GET(_request: NextRequest) {
  try {
    console.log('[api/oasisbios] GET request received');
    const user = await requireAuth();
    console.log('[api/oasisbios] User authenticated:', user.id);
    const userId = user.id;

    const oasisBios = await prisma.oasisBio.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    console.log('[api/oasisbios] Found', oasisBios.length, 'OasisBios');

    return NextResponse.json(oasisBios);
  } catch (error) {
    console.error('[api/oasisbios] GET error:', error);
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

    // Generate unique slug from title
    const baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    let slug = baseSlug;
    let suffix = 1;
    while (await prisma.oasisBio.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${suffix++}`;
    }

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
