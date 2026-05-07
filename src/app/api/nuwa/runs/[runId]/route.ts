/**
 * Nuwa Run Detail API
 *
 * GET /api/nuwa/runs/[runId] - Get run details with suggestions
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma.client';
import { requireAuth } from '@/lib/auth';
import { handleApiError } from '@/lib/error-handler';
import type { NuwaSuggestionScope, NuwaSuggestionDecision } from '@/lib/nuwa/types';

/**
 * GET - Get Nuwa run details with all suggestions
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ runId: string }> }
) {
  try {
    const user = await requireAuth();
    const { runId } = await params;

    const run = await prisma.nuwaRun.findUnique({
      where: { id: runId },
      include: {
        items: {
          orderBy: [{ scope: 'asc' }, { createdAt: 'asc' }],
        },
        oasisBio: {
          select: { id: true, userId: true, title: true },
        },
      },
    });

    if (!run) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Nuwa run not found' } },
        { status: 404 }
      );
    }

    // Check ownership
    if (run.oasisBio.userId !== user.id) {
      return NextResponse.json(
        { error: { code: 'FORBIDDEN', message: 'Access denied' } },
        { status: 403 }
      );
    }

    // Build summary
    const summary = run.summary as Record<string, number> | null;
    const distilled = run.distilled as Record<string, unknown> | null;

    return NextResponse.json({
      runId: run.id,
      status: run.status,
      mode: run.mode,
      sourcePolicy: run.sourcePolicy,
      scopes: run.scopes,
      summary: summary || undefined,
      distilled: distilled || undefined,
      startedAt: run.startedAt?.toISOString(),
      completedAt: run.completedAt?.toISOString(),
      createdAt: run.createdAt.toISOString(),
      oasisBio: {
        id: run.oasisBio.id,
        title: run.oasisBio.title,
      },
      items: run.items.map((item) => ({
        id: item.id,
        scope: item.scope as NuwaSuggestionScope,
        operation: item.operation,
        targetId: item.targetId,
        title: item.title,
        payload: item.payload,
        rationale: item.rationale,
        confidence: item.confidence,
        evidence: item.evidence,
        decision: item.decision as NuwaSuggestionDecision,
        createdEntityId: item.createdEntityId,
        appliedAt: item.appliedAt?.toISOString(),
        createdAt: item.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
