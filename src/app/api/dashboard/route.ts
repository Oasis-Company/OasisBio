import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, handleApiError } from '@/lib/auth-utils';
import { getServerUserWithProfile } from '@/lib/auth';

export async function GET() {
  try {
    const user = await requireAuth();
    const userId = user.id;
    
    // Debug logging for authentication issues
    if (!userId) {
      console.error('[dashboard] Authentication failed: userId is undefined');
      throw new Error('Authentication failed');
    }
    
    console.log('[dashboard] Successfully authenticated user:', userId);

    // Fetch user profile for DashboardData.user
    const profile = await prisma.profile.findFirst({
      where: { userId: user.id },
      select: { username: true, displayName: true, avatarUrl: true },
    });

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
          tagline: true,
          summary: true,
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
      description: oasisBio.tagline || oasisBio.summary || '',
      timestamp: oasisBio.updatedAt.toISOString(),
    }));

    // Account status (TODO: integrate with real subscription system)
    const accountStatus = {
      subscription: 'Free',
      oasisBiosLimit: 3,
      oasisBiosUsed: oasisBiosCount,
      storageUsed: 0, // TODO: calculate from actual storage
      storageLimit: 100,
    };

    // System status (TODO: implement real health checks)
    const systemStatus = {
      api: 'Online',
      database: 'Online',
      storage: 'Online',
    };

    return NextResponse.json({
      user: {
        id: user.id,
        name: profile?.displayName || user.email || 'User',
        email: user.email,
        profile: profile ? {
          username: profile.username,
          displayName: profile.displayName,
          avatarUrl: profile.avatarUrl,
        } : null,
      },
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
      accountStatus,
      systemStatus,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
