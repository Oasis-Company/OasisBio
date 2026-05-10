/**
 * Nuwa Runs API - Create and List
 *
 * POST /api/oasisbios/[id]/nuwa/runs - Create a new Nuwa distillation run
 * GET /api/oasisbios/[id]/nuwa/runs - List runs for an OasisBio
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';
import { z } from 'zod';
import { requireAuth, handleApiError } from '@/lib/auth-utils';
import { computeSnapshotHash, buildNuwaSourceSnapshot } from '@/lib/nuwa/source-snapshot';
import { findCachedRun, runNuwaDistillation } from '@/lib/nuwa/orchestrator';
import type { NuwaScope, NuwaRunMode, NuwaSourcePolicy } from '@/lib/nuwa/types';

const CreateNuwaRunSchema = z.object({
  mode: z.enum(['quick', 'deep']).default('quick'),
  sourcePolicy: z.enum(['local_only', 'local_plus_web']).default('local_only'),
  scopes: z.array(
    z.enum(['description', 'abilities', 'worlds', 'references', 'eras', 'dcos'])
  ).min(1),
  include: z.object({
    bioCore: z.boolean().default(true),
    eraIds: z.array(z.string()).default([]),
    abilityIds: z.array(z.string()).default([]),
    dcosIds: z.array(z.string()).default([]),
    referenceIds: z.array(z.string()).default([]),
    worldIds: z.array(z.string()).default([]),
    includeWorldDocuments: z.boolean().default(true),
  }).default({}),
  notes: z.string().max(2000).optional(),
  forceRefresh: z.boolean().default(false),
});

/**
 * POST - Create a new Nuwa distillation run
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id: oasisBioId } = await params;

    // Verify OasisBio exists and user owns it
    const bio = await prisma.oasisBio.findUnique({
      where: { id: oasisBioId },
      select: { id: true, userId: true },
    });

    if (!bio) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'OasisBio not found' } },
        { status: 404 }
      );
    }

    if (bio.userId !== user.id) {
      return NextResponse.json(
        { error: { code: 'FORBIDDEN', message: 'Access denied' } },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();
    const parsed = CreateNuwaRunSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: { code: 'INVALID_INPUT', message: parsed.error.message } },
        { status: 400 }
      );
    }

    const { mode, sourcePolicy, scopes, include, notes, forceRefresh } = parsed.data;

    // Check for cached result
    const snapshot = await buildNuwaSourceSnapshot(oasisBioId, include);
    const snapshotHash = await computeSnapshotHash(snapshot);

    if (!forceRefresh) {
      const cachedRunId = await findCachedRun(
        oasisBioId,
        snapshotHash,
        scopes as string[],
        mode
      );
      if (cachedRunId) {
        return NextResponse.json({
          runId: cachedRunId,
          status: 'completed',
          snapshotHash,
          cacheHit: true,
        });
      }
    }

    // Check concurrent runs limit (max 1 processing per oasisBio)
    const activeRuns = await prisma.nuwaRun.count({
      where: {
        oasisBioId,
        status: { in: ['queued', 'processing'] },
      },
    });

    if (activeRuns > 0) {
      return NextResponse.json(
        { error: { code: 'ALREADY_RUNNING', message: 'A Nuwa run is already in progress' } },
        { status: 409 }
      );
    }

    // Create NuwaRun
    const run = await prisma.nuwaRun.create({
      data: {
        oasisBioId,
        userId: user.id,
        mode,
        sourcePolicy,
        scopes: scopes as unknown as prisma.InputJsonValue,
        snapshotHash,
        status: 'queued',
      },
    });

    // Trigger async distillation (fire-and-forget in dev; use queue in production)
    // In development, we run it synchronously to see errors immediately.
    // In production with Vercel, this should be moved to a background job (e.g., Vercel Cron/Queues).
    runNuwaDistillation(run.id).catch((error) => {
      console.error(`[Nuwa] Background distillation failed for run ${run.id}:`, error);
    });

    return NextResponse.json({
      runId: run.id,
      status: 'queued',
      snapshotHash,
      cacheHit: false,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * GET - List Nuwa runs for an OasisBio
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id: oasisBioId } = await params;

    // Verify ownership
    const bio = await prisma.oasisBio.findUnique({
      where: { id: oasisBioId },
      select: { userId: true },
    });

    if (!bio || bio.userId !== user.id) {
      return NextResponse.json(
        { error: { code: 'FORBIDDEN', message: 'Access denied' } },
        { status: 403 }
      );
    }

    const runs = await prisma.nuwaRun.findMany({
      where: { oasisBioId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        status: true,
        mode: true,
        sourcePolicy: true,
        scopes: true,
        snapshotHash: true,
        startedAt: true,
        completedAt: true,
        createdAt: true,
        _count: {
          select: { items: true },
        },
      },
    });

    return NextResponse.json({
      runs: runs.map((run) => ({
        runId: run.id,
        status: run.status,
        mode: run.mode,
        sourcePolicy: run.sourcePolicy,
        scopes: run.scopes,
        snapshotHash: run.snapshotHash,
        startedAt: run.startedAt?.toISOString(),
        completedAt: run.completedAt?.toISOString(),
        createdAt: run.createdAt.toISOString(),
        suggestionCount: run._count.items,
      })),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
