import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, handleApiError } from '@/lib/auth-utils';

/**
 * Dashboard API — aggregated stats for the authenticated user.
 *
 * All count queries run in parallel via Promise.all.
 * Each query is individually wrapped so that a single table failure
 * (e.g. missing relation, migration drift) doesn't kill the entire
 * dashboard response — we return 0 for the failed metric and log the
 * error server-side.
 */
export async function GET() {
  try {
    const user = await requireAuth();
    const userId = user.id;

    if (!userId) {
      console.error('[dashboard] Authentication failed: userId is undefined');
      throw new Error('Authentication failed');
    }

    console.log('[dashboard] Successfully authenticated user:', userId);

    // Fetch user profile
    let profile: { username: string; displayName: string | null; avatarUrl: string | null } | null = null;
    try {
      profile = await prisma.profile.findFirst({
        where: { userId: user.id },
        select: { username: true, displayName: true, avatarUrl: true },
      });
    } catch (err) {
      console.error('[dashboard] Failed to fetch profile:', err);
      // Non-fatal — continue without profile data
    }

    // Run all stat queries in parallel, with per-query error isolation
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
      // Wrap each query so one failure doesn't break everything
      prisma.oasisBio.count({ where: { userId } }).catch((err) => {
        console.error('[dashboard] oasisBio.count failed:', err);
        return 0;
      }),
      prisma.ability.count({ where: { oasisBio: { userId } } }).catch((err) => {
        console.error('[dashboard] ability.count failed:', err);
        return 0;
      }),
      prisma.worldItem.count({ where: { oasisBio: { userId } } }).catch((err) => {
        console.error('[dashboard] worldItem.count failed:', err);
        return 0;
      }),
      prisma.modelItem.count({ where: { oasisBio: { userId } } }).catch((err) => {
        console.error('[dashboard] modelItem.count failed:', err);
        return 0;
      }),
      prisma.referenceItem.count({ where: { oasisBio: { userId } } }).catch((err) => {
        console.error('[dashboard] referenceItem.count failed:', err);
        return 0;
      }),
      prisma.dcosFile.count({ where: { oasisBio: { userId } } }).catch((err) => {
        console.error('[dashboard] dcosFile.count failed:', err);
        return 0;
      }),
      prisma.eraIdentity.count({ where: { oasisBio: { userId } } }).catch((err) => {
        console.error('[dashboard] eraIdentity.count failed:', err);
        return 0;
      }),
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
      }).catch((err) => {
        console.error('[dashboard] recentOasisBios.findMany failed:', err);
        return [];
      }),
    ]);

    const recentActivities = recentOasisBios.map((oasisBio) => ({
      id: oasisBio.id,
      type: 'oasisBio_update' as const,
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

    // System status
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
        profile: profile
          ? {
              username: profile.username,
              displayName: profile.displayName,
              avatarUrl: profile.avatarUrl,
            }
          : null,
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
