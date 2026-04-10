import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, handleApiError } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        profiles: true,
        oasisBios: {
          select: {
            id: true,
            status: true,
          },
        },
      },
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const profile = dbUser.profiles[0];
    const publicOasisBiosCount = dbUser.oasisBios.filter(
      (oasisBio) => oasisBio.status === 'published'
    ).length;

    return NextResponse.json({
      user: {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        createdAt: dbUser.createdAt,
      },
      profile: profile
        ? {
            id: profile.id,
            username: profile.username,
            displayName: profile.displayName,
            avatarUrl: profile.avatarUrl,
            bio: profile.bio,
            website: profile.website,
            locale: profile.locale,
            defaultLanguage: profile.defaultLanguage,
          }
        : null,
      stats: {
        totalOasisBios: dbUser.oasisBios.length,
        publicOasisBios: publicOasisBiosCount,
      },
      plan: {
        name: 'Free',
        storageLimit: 128,
        storageUsed: 0,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const { section, data } = body;

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        profiles: true,
      },
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let updatedProfile = null;

    if (section === 'account' || section === 'profile') {
      const profile = dbUser.profiles[0];
      if (!profile) {
        return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
      }

      const updateData: any = {};
      if (data.username !== undefined) updateData.username = data.username;
      if (data.displayName !== undefined) updateData.displayName = data.displayName;
      if (data.avatarUrl !== undefined) updateData.avatarUrl = data.avatarUrl;
      if (data.bio !== undefined) updateData.bio = data.bio;
      if (data.website !== undefined) updateData.website = data.website;
      if (data.locale !== undefined) updateData.locale = data.locale;
      if (data.defaultLanguage !== undefined) updateData.defaultLanguage = data.defaultLanguage;

      if (data.username && data.username !== profile.username) {
        const existingProfile = await prisma.profile.findUnique({
          where: { username: data.username },
        });

        if (existingProfile && existingProfile.id !== profile.id) {
          return NextResponse.json({ error: 'Username already taken' }, { status: 400 });
        }
      }

      updatedProfile = await prisma.profile.update({
        where: { id: profile.id },
        data: updateData,
      });
    }

    if (section === 'security') {
      return NextResponse.json({ 
        error: 'Password changes must be done through Supabase authentication. Please use the forgot password feature or contact support.' 
      }, { status: 400 });
    }

    return NextResponse.json({
      message: 'Settings updated successfully',
      profile: updatedProfile
        ? {
            id: updatedProfile.id,
            username: updatedProfile.username,
            displayName: updatedProfile.displayName,
            avatarUrl: updatedProfile.avatarUrl,
            bio: updatedProfile.bio,
            website: updatedProfile.website,
            locale: updatedProfile.locale,
            defaultLanguage: updatedProfile.defaultLanguage,
          }
        : null,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
