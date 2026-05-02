import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const searchTerm = searchParams.get('search');
    const era = searchParams.get('era');
    const type = searchParams.get('type');

    const skip = (page - 1) * limit;

    const where: any = {
      visibility: 'public',
      status: 'active',
    };

    if (searchTerm) {
      where.OR = [
        { title: { contains: searchTerm, mode: 'insensitive' } },
        { tagline: { contains: searchTerm, mode: 'insensitive' } },
        { summary: { contains: searchTerm, mode: 'insensitive' } },
      ];
    }

    if (era && era !== 'All') {
      where.currentEra = era;
    }

    if (type && type !== 'All') {
      where.identityMode = type;
    }

    const [publicOasisBios, total] = await Promise.all([
      prisma.oasisBio.findMany({
        where,
        orderBy: {
          updatedAt: 'desc',
        },
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          slug: true,
          tagline: true,
          identityMode: true,
          currentEra: true,
          coverImageUrl: true,
          _count: {
            select: {
              abilities: true,
              worlds: true,
              models: true,
            },
          },
        },
      }),
      prisma.oasisBio.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      data: publicOasisBios,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Error fetching public OasisBios:', error);
    return NextResponse.json(
      { error: 'Failed to fetch public OasisBios' },
      { status: 500 }
    );
  }
}
