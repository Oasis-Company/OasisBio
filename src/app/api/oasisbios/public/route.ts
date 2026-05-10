import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';
import { handleApiError } from '@/lib/auth-utils';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const searchTerm = searchParams.get('search');
    const era = searchParams.get('era');
    const type = searchParams.get('type');

    const skip = (page - 1) * limit;

    const where = {
      visibility: 'public' as const,
      status: 'active' as const,
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
    return handleApiError(error);
  }
}
