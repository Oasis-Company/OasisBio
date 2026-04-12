import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, handleApiError } from '@/lib/auth-utils';
import { createClient } from '@/lib/supabase/server';
import crypto from 'crypto';

// POST /api/oasisbios/[id]/publish
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id: bioId } = await params;
    const body = await request.json().catch(() => ({}));
    const visibility = body.visibility ?? 'public';
    const requestId = body.requestId ?? crypto.randomUUID();

    const supabase = await createClient();

    // Call the publish_bio RPC — atomic transaction in DB
    const { data, error } = await supabase.rpc('publish_bio', {
      p_bio_id:     bioId,
      p_actor_id:   user.id,
      p_request_id: requestId,
      p_visibility: visibility,
    });

    if (error) {
      console.error('[publish] RPC error', { bioId, error });
      return NextResponse.json(
        { error: { code: 'RPC_ERROR', message: error.message } },
        { status: 500 }
      );
    }

    const result = data as { ok: boolean; errors?: string[]; slug?: string; published_at?: string };

    if (!result.ok) {
      return NextResponse.json(
        { error: { code: 'PUBLISH_FAILED', message: result.errors?.[0] ?? 'Publish failed' } },
        { status: 400 }
      );
    }

    return NextResponse.json({
      ok: true,
      slug: result.slug,
      publishedAt: result.published_at,
      visibility,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/oasisbios/[id]/publish — unpublish
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id: bioId } = await params;
    const requestId = crypto.randomUUID();

    const supabase = await createClient();

    const { data, error } = await supabase.rpc('unpublish_bio', {
      p_bio_id:     bioId,
      p_actor_id:   user.id,
      p_request_id: requestId,
    });

    if (error) {
      return NextResponse.json(
        { error: { code: 'RPC_ERROR', message: error.message } },
        { status: 500 }
      );
    }

    const result = data as { ok: boolean; errors?: string[] };

    if (!result.ok) {
      return NextResponse.json(
        { error: { code: 'UNPUBLISH_FAILED', message: result.errors?.[0] ?? 'Unpublish failed' } },
        { status: 400 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}
