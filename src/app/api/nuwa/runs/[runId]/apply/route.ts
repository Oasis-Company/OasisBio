/**
 * Nuwa Apply Suggestions API
 *
 * POST /api/nuwa/runs/[runId]/apply - Apply selected suggestions to OasisBio data
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma.client';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth';
import { handleApiError } from '@/lib/error-handler';
import { applyNuwaSuggestions } from '@/lib/nuwa/apply';

const ApplySchema = z.object({
  itemIds: z.array(z.string()).min(1),
  descriptionMode: z.enum(['append', 'replace', 'manual_merge']).default('append'),
  worldTarget: z.union([
    z.object({ kind: z.literal('existing'), worldId: z.string() }),
    z.object({ kind: z.literal('new'), name: z.string().min(1) }),
  ]).optional(),
});

/**
 * POST - Apply selected Nuwa suggestions
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ runId: string }> }
) {
  try {
    const user = await requireAuth();
    const { runId } = await params;

    // Verify run exists and user owns it
    const run = await prisma.nuwaRun.findUnique({
      where: { id: runId },
      include: { oasisBio: true },
    });

    if (!run) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Nuwa run not found' } },
        { status: 404 }
      );
    }

    if (run.oasisBio.userId !== user.id) {
      return NextResponse.json(
        { error: { code: 'FORBIDDEN', message: 'Access denied' } },
        { status: 403 }
      );
    }

    if (run.status !== 'completed' && run.status !== 'completed_with_warnings') {
      return NextResponse.json(
        { error: { code: 'INVALID_STATE', message: `Run is ${run.status}, cannot apply` } },
        { status: 400 }
      );
    }

    // Parse request body
    const body = await request.json();
    const parsed = ApplySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: { code: 'INVALID_INPUT', message: parsed.error.message } },
        { status: 400 }
      );
    }

    const results = await applyNuwaSuggestions(runId, parsed.data);

    return NextResponse.json({
      runId,
      applied: results,
      failedCount: parsed.data.itemIds.length - results.length,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
