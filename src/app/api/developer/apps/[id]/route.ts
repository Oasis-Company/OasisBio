import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, handleApiError, AuthError } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import { validateRedirectUri } from '@/lib/oauth/validate';

async function requireAppOwnership(appId: string, userId: string) {
  const app = await prisma.oauthApp.findUnique({
    where: { id: appId },
    select: { id: true, ownerUserId: true },
  });
  if (!app) throw new AuthError('App not found', 404);
  if (app.ownerUserId !== userId) throw new AuthError('Forbidden', 403);
  return app;
}

// GET /api/developer/apps/[id]
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    await requireAppOwnership(id, user.id);

    const app = await prisma.oauthApp.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        homepageUrl: true,
        logoUrl: true,
        redirectUris: true,
        clientId: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(app);
  } catch (error) {
    return handleApiError(error);
  }
}

// PUT /api/developer/apps/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const body = await request.json();

    await requireAppOwnership(id, user.id);

    const updates: Record<string, unknown> = {};

    if ('name' in body) {
      if (!body.name?.trim()) {
        return NextResponse.json(
          { error: { code: 'VALIDATION_ERROR', message: 'name cannot be empty' } },
          { status: 400 }
        );
      }
      updates.name = body.name.trim();
    }
    if ('description' in body) updates.description = body.description?.trim() ?? null;
    if ('homepageUrl' in body) {
      if (!body.homepageUrl?.trim()) {
        return NextResponse.json(
          { error: { code: 'VALIDATION_ERROR', message: 'homepageUrl cannot be empty' } },
          { status: 400 }
        );
      }
      updates.homepageUrl = body.homepageUrl.trim();
    }
    if ('logoUrl' in body) updates.logoUrl = body.logoUrl?.trim() ?? null;
    if ('redirectUris' in body) {
      if (!Array.isArray(body.redirectUris) || body.redirectUris.length === 0) {
        return NextResponse.json(
          { error: { code: 'VALIDATION_ERROR', message: 'At least one redirectUri is required' } },
          { status: 400 }
        );
      }
      const invalidUris = body.redirectUris.filter((uri: string) => !validateRedirectUri(uri));
      if (invalidUris.length > 0) {
        return NextResponse.json(
          { error: { code: 'VALIDATION_ERROR', message: `Invalid redirect URIs: ${invalidUris.join(', ')}` } },
          { status: 400 }
        );
      }
      updates.redirectUris = body.redirectUris;
    }

    const app = await prisma.oauthApp.update({
      where: { id },
      data: updates,
      select: {
        id: true,
        name: true,
        description: true,
        homepageUrl: true,
        logoUrl: true,
        redirectUris: true,
        clientId: true,
        isActive: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(app);
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/developer/apps/[id] — delete app and revoke all tokens
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    const app = await requireAppOwnership(id, user.id);

    // Revoke all active tokens for this app
    await prisma.oauthToken.updateMany({
      where: { clientId: (await prisma.oauthApp.findUnique({ where: { id }, select: { clientId: true } }))!.clientId, revokedAt: null },
      data: { revokedAt: new Date() },
    });

    await prisma.oauthApp.delete({ where: { id } });

    return NextResponse.json({ message: 'App deleted and all tokens revoked' });
  } catch (error) {
    return handleApiError(error);
  }
}
