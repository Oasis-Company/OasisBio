import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { syncUserToPrisma } from '@/lib/user-sync';
import crypto from 'crypto';
import { withRateLimit, getClientIP } from '@/lib/rate-limit';

const WEBHOOK_SECRET = process.env.SUPABASE_WEBHOOK_SECRET;

function verifyWebhookSignature(payload: string, signature: string): boolean {
  if (!WEBHOOK_SECRET) {
    console.error('[webhook] FATAL: SUPABASE_WEBHOOK_SECRET not set — rejecting all webhook requests');
    return false;
  }
  const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
  const digest = hmac.update(payload).digest('base64');
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(digest)
  );
}

export async function POST(request: NextRequest) {
  // Rate limit: 60 requests per minute per IP (prevents webhook abuse)
  const rateLimitResponse = withRateLimit(request, 60_000, 60, getClientIP(request));
  if (rateLimitResponse) return rateLimitResponse;

  const requestId = request.headers.get('x-request-id') ?? crypto.randomUUID();

  try {
    const body = await request.text();
    const signature = request.headers.get('x-webhook-signature');

    if (!signature || !verifyWebhookSignature(body, signature)) {
      console.error('[webhook] Invalid signature', { requestId });
      return NextResponse.json(
        { error: { code: 'INVALID_SIGNATURE', message: 'Invalid webhook signature' } },
        { status: 401 }
      );
    }

    const event = JSON.parse(body);
    const { type, data } = event;

    console.info('[webhook] Received event', { requestId, type, userId: data?.id });

    switch (type) {
      case 'user.created':
      case 'user.updated': {
        // Build a minimal SupabaseUser-compatible object from webhook payload
        const supabaseUser = {
          id: data.id,
          email: data.email,
          user_metadata: data.user_metadata ?? {},
          app_metadata: data.app_metadata ?? {},
          aud: 'authenticated',
          created_at: data.created_at ?? new Date().toISOString(),
        } as Parameters<typeof syncUserToPrisma>[0];

        await syncUserToPrisma(supabaseUser);
        console.info('[webhook] User synced', { requestId, userId: data.id });
        break;
      }

      case 'user.deleted': {
        const { id } = data;
        await prisma.user.delete({ where: { id } }).catch((err) => {
          // User may not exist in Prisma if sync never ran — not an error
          if (err?.code !== 'P2025') throw err;
        });
        console.info('[webhook] User deleted', { requestId, userId: id });
        break;
      }

      default:
        console.info('[webhook] Unhandled event type', { requestId, type });
    }

    return NextResponse.json({ received: true, requestId });
  } catch (error) {
    console.error('[webhook] Error processing event', { requestId, error });
    return NextResponse.json(
      { error: { code: 'WEBHOOK_ERROR', message: 'Failed to process webhook' } },
      { status: 500 }
    );
  }
}
