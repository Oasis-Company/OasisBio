/**
 * Nuwa Reject Suggestions API
 *
 * POST /api/nuwa/runs/[runId]/reject - Reject selected suggestions (mark as rejected)
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { requireAuth, handleApiError } from '@/lib/auth-utils';
import { rejectNuwaSuggestions } from '@/lib/nuwa/apply';

const RejectSchema = z.object({
  itemIds: z.array(z.string()).min(1),
  reason: z.string().max(1000).optional(),
});

/**
 * POST - Reject selected Nuwa suggestions
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

    // Parse request body
    const body = await request.json();
    const parsed = RejectSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: { code: 'INVALID_INPUT', message: parsed.error.message } },
        { status: 400 }
      );
    }

    const rejectedCount = await rejectNuwaSuggestions(runId, parsed.data.itemIds);

    return NextResponse.json({
      runId,
      rejectedCount,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
