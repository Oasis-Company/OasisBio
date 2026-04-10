import 'server-only';

import { NextResponse } from 'next/server';
import { getServerUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * Asserts that the current request is authenticated.
 * Throws AuthError(401) if not.
 */
export async function requireAuth() {
  const user = await getServerUser();

  if (!user) {
    throw new AuthError('Unauthorized', 401);
  }

  return user;
}

export async function requireOasisBioOwnership(oasisBioId: string, userId: string) {
  const oasisBio = await prisma.oasisBio.findUnique({
    where: { id: oasisBioId },
    select: { id: true, userId: true },
  });

  if (!oasisBio) throw new AuthError('OasisBio not found', 404);
  if (oasisBio.userId !== userId) throw new AuthError('Forbidden', 403);

  return oasisBio;
}

export async function requireDcosFileOwnership(dcosFileId: string, userId: string) {
  const dcosFile = await prisma.dcosFile.findUnique({
    where: { id: dcosFileId },
    include: { oasisBio: { select: { userId: true } } },
  });

  if (!dcosFile) throw new AuthError('DCOS file not found', 404);
  if (dcosFile.oasisBio.userId !== userId) throw new AuthError('Forbidden', 403);

  return dcosFile;
}

export async function requireAbilityOwnership(abilityId: string, userId: string) {
  const ability = await prisma.ability.findUnique({
    where: { id: abilityId },
    include: { oasisBio: { select: { userId: true } } },
  });

  if (!ability) throw new AuthError('Ability not found', 404);
  if (ability.oasisBio.userId !== userId) throw new AuthError('Forbidden', 403);

  return ability;
}

export async function requireWorldOwnership(worldId: string, userId: string) {
  const world = await prisma.worldItem.findUnique({
    where: { id: worldId },
    include: { oasisBio: { select: { userId: true } } },
  });

  if (!world) throw new AuthError('World not found', 404);
  if (world.oasisBio.userId !== userId) throw new AuthError('Forbidden', 403);

  return world;
}

export async function requireReferenceOwnership(referenceId: string, userId: string) {
  const reference = await prisma.referenceItem.findUnique({
    where: { id: referenceId },
    include: { oasisBio: { select: { userId: true } } },
  });

  if (!reference) throw new AuthError('Reference item not found', 404);
  if (reference.oasisBio.userId !== userId) throw new AuthError('Forbidden', 403);

  return reference;
}

export async function requireWorldDocumentOwnership(documentId: string, userId: string) {
  const document = await prisma.worldDocument.findUnique({
    where: { id: documentId },
    include: { world: { include: { oasisBio: { select: { userId: true } } } } },
  });

  if (!document) throw new AuthError('World document not found', 404);
  if (document.world.oasisBio.userId !== userId) throw new AuthError('Forbidden', 403);

  return document;
}

export function handleApiError(error: unknown): NextResponse {
  console.error('[api] Error:', error);

  if (error instanceof AuthError) {
    return NextResponse.json(
      { error: { code: error.code, message: error.message } },
      { status: error.statusCode }
    );
  }

  return NextResponse.json(
    { error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
    { status: 500 }
  );
}

export class AuthError extends Error {
  public readonly code: string;

  constructor(
    message: string,
    public readonly statusCode: number,
    code?: string
  ) {
    super(message);
    this.name = 'AuthError';
    this.code = code ?? (statusCode === 401 ? 'UNAUTHORIZED' : statusCode === 403 ? 'FORBIDDEN' : 'NOT_FOUND');
  }
}
