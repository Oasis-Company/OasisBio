/**
 * Analytics Event Ingestion Endpoint
 *
 * POST /api/events — Receive client-side analytics events
 *
 * Design:
 * - Fire-and-forget: always returns 200 OK to avoid blocking the client
 * - In development: logs events to console
 * - In production: can forward to PostHog/Amplitude or store in DB
 * - Uses keepalive-compatible approach (client sends with fetch keepalive)
 */

import { NextRequest, NextResponse } from 'next/server';
import type { OasisBioEventName } from '@/lib/analytics';

// Allowed event names (whitelist for security)
const ALLOWED_EVENTS: OasisBioEventName[] = [
  'landing_view',
  'click_explore',
  'register_started',
  'register_completed',
  'bio_created',
  'bio_saved',
  'bio_previewed',
  'bio_published',
  'bio_unpublished',
  'bio_deleted',
  'click_fork_template',
  'nuwa_page_viewed',
  'nuwa_run_started',
  'nuwa_run_completed',
  'nuwa_suggestion_applied',
  'nuwa_suggestion_rejected',
  'explore_search',
  'explore_filter_changed',
  'explore_card_clicked',
  'return_visit',
  'login_started',
  'login_completed',
  'otp_resent',
  'oauth_login_completed',
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { event, properties, timestamp } = body as {
      event?: string;
      properties?: Record<string, unknown>;
      timestamp?: string;
    };

    // Validate event name
    if (!event || !ALLOWED_EVENTS.includes(event as OasisBioEventName)) {
      // Still return 200 — don't leak validation details, silently drop
      return NextResponse.json({ ok: true });
    }

    // TODO Production: Replace with actual storage
    // Options:
    // 1. Write to an `analytics_events` table (Prisma)
    // 2. Forward to PostHog/Amplitude HTTP API
    // 3. Send to a message queue (Redis/SQS)

    if (process.env.NODE_ENV === 'development') {
      console.log(`[api/events] ${event}`, {
        properties,
        timestamp,
        ip: request.ip ?? 'unknown',
        userAgent: request.headers.get('user-agent')?.slice(0, 120),
      });
    }

    return NextResponse.json({ ok: true });
  } catch {
    // Parse error or any crash — still return 200
    // Analytics failures must NEVER break client functionality
    return NextResponse.json({ ok: true });
  }
}

/**
 * OPTIONS — Required for CORS preflight from client-side fetch.
 * Since we're same-origin, this is mainly a safety net.
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
