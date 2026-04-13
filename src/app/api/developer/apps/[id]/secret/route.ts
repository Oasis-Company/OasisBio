import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, handleApiError, AuthError } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import { generateSecret, hashClientSecret } from '@/lib/oauth/crypto';

// POST /api/developer/apps/[id]/secret — rotate client_secret
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    const app = await prisma.oauthApp.findUnique({
      where: { id },
      select: { id: true, ownerUserId: true, clientId: true },
    });

    if (!app) throw new AuthError('App not found', 404);
    if (app.ownerUserId !== user.id) throw new AuthError('Forbidden', 403);

    // Revoke all existing tokens for this app
    await prisma.oauthToken.updateMany({
      where: { clientId: app.clientId, revokedAt: null },
      data: { revokedAt: new Date() },
    });

    // Generate new secret
    const newSecret = generateSecret(32);
    const newHash = await hashClientSecret(newSecret);

    await prisma.oauthApp.update({
      where: { id },
      data: { clientSecretHash: newHash },
    });

    // Return plaintext once — never stored
    return NextResponse.json({ clientSecret: newSecret });
  } catch (error) {
    return handleApiError(error);
  }
}
