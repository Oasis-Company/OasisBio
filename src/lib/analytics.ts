/**
 * OasisBio Analytics — Lightweight event tracking infrastructure
 *
 * Design decisions:
 * - Zero external dependency at the tracking layer
 * - Events are sent to a server-side API endpoint (/api/events)
 * - The endpoint can forward to any downstream (PostHog, Amplitude, Mixpanel, etc.)
 * - Client-side: useTrackEvent() hook for React components
 * - Server-side: trackEvent() function for API routes
 *
 * Event naming convention: object_action (e.g., bio_saved, nuwa_run_started)
 */

// ==================== Event Schema ====================

export type OasisBioEventName =
  // Activation funnel
  | 'landing_view'
  | 'click_explore'
  | 'register_started'
  | 'register_completed'
  // Character lifecycle
  | 'bio_created'
  | 'bio_saved'
  | 'bio_previewed'    // user views their own bio preview
  | 'bio_published'
  | 'bio_unpublished'
  | 'bio_deleted'
  // Engagement
  | 'click_fork_template'
  | 'nuwa_page_viewed'
  | 'nuwa_run_started'
  | 'nuwa_run_completed'
  | 'nuwa_suggestion_applied'
  | 'nuwa_suggestion_rejected'
  | 'explore_search'
  | 'explore_filter_changed'
  | 'explore_card_clicked'
  // Retention
  | 'return_visit'
  // Auth
  | 'login_started'
  | 'login_completed'
  | 'otp_resent'
  | 'oauth_login_completed';

export interface OasisBioEvent {
  event: OasisBioEventName;
  properties?: Record<string, string | number | boolean | undefined>;
  timestamp?: string; // ISO 8601, set by client
}

// ==================== Server-side tracker ====================

/**
 * Track an event from a server-side context (API routes, server components).
 * Sends to /api/events or directly to configured backend.
 */
export async function trackServerEvent(
  event: OasisBioEventName,
  properties?: Record<string, string | number | boolean | undefined>,
  userId?: string,
): Promise<void> {
  const payload: OasisBioEvent = {
    event,
    properties: {
      ...properties,
      ...(userId ? { userId } : {}),
    },
    timestamp: new Date().toISOString(),
  };

  // In production, this would POST to your analytics provider.
  // For now, we log to console in development and can batch-send later.
  if (process.env.NODE_ENV === 'development') {
    console.log(`[analytics] ${event}`, JSON.stringify(payload));
  }

  // TODO: When analytics endpoint is ready, send here:
  // await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/events`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(payload),
  // }).catch(() => {});
}

// ==================== Event definitions with required properties ====================

/** Pre-defined event factories that ensure consistent property shape */
export const events = {
  bioCreated: (bioId: string, mode: string) =>
    ({ event: 'bio_created', properties: { bioId, identityMode: mode } }) satisfies { event: OasisBioEventName; properties: Record<string, unknown> },

  bioSaved: (bioId: string) =>
    ({ event: 'bio_saved', properties: { bioId } }),

  bioPublished: (bioId: string, slug: string) =>
    ({ event: 'bio_published', properties: { bioId, slug } }),

  nuwaRunStarted: (bioId: string, scopes: string[], mode: string) =>
    ({ event: 'nuwa_run_started', properties: { bioId, scopeCount: scopes.length, mode } }),

  nuwaRunCompleted: (runId: string, suggestionCount: number) =>
    ({ event: 'nuwa_run_completed', properties: { runId, suggestionCount } }),

  exploreSearch: (hasTerm: boolean, era?: string, type?: string) =>
    ({ event: 'explore_search', properties: { hasSearchTerm: hasTerm, filterEra: era ?? null, filterType: type ?? null } }),

  forkTemplateClicked: (sourceSlug: string) =>
    ({ event: 'click_fork_template', properties: { sourceSlug } }),

  registerCompleted: (method: 'otp' | 'google' | 'github') =>
    ({ event: 'register_completed', properties: { method } }),
} as const;

// Type helper for event factory return values
type EventFactory = typeof events[keyof typeof events];
