import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, handleApiError } from '@/lib/auth-utils';

export async function GET() {
  try {
    const user = await requireAuth();
    const userId = user.id;

    const [
      oasisBiosCount,
      abilitiesCount,
      worldsCount,
      modelsCount,
      referencesCount,
      dcosFilesCount,
      erasCount,
      recentOasisBios,
    ] = await Promise.all([
      prisma.oasisBio.count({ where: { userId } }),
      prisma.ability.count({ where: { oasisBio: { userId } } }),
      prisma.worldItem.count({ where: { oasisBio: { userId } } }),
      prisma.modelItem.count({ where: { oasisBio: { userId } } }),
      prisma.referenceItem.count({ where: { oasisBio: { userId } } }),
      prisma.dcosFile.count({ where: { oasisBio: { userId } } }),
      prisma.eraIdentity.count({ where: { oasisBio: { userId } } }),
      prisma.oasisBio.findMany({
        where: { userId },
        orderBy: { updatedAt: 'desc' },
        take: 5,
        select: {
          id: true,
          title: true,
          slug: true,
          updatedAt: true,
          _count: {
            select: {
              abilities: true,
              worlds: true,
              models: true,
            },
          },
        },
      }),
    ]);

    const recentActivities = recentOasisBios.map(oasisBio => ({
      id: oasisBio.id,
      type: 'oasisBio_update',
      title: oasisBio.title,
      slug: oasisBio.slug,
      timestamp: oasisBio.updatedAt.toISOString(),
      stats: {
        abilities: oasisBio._count.abilities,
        worlds: oasisBio._count.worlds,
        models: oasisBio._count.models,
      },
    }));

    return NextResponse.json({
      stats: {
        oasisBios: oasisBiosCount,
        abilities: abilitiesCount,
        worlds: worldsCount,
        models: modelsCount,
        references: referencesCount,
        dcosFiles: dcosFilesCount,
        eras: erasCount,
      },
      recentActivities,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
