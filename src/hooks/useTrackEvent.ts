'use client';

import { useCallback } from 'react';
import type { OasisBioEventName } from '@/lib/analytics';

/**
 * useTrackEvent — Client-side event tracking hook
 *
 * Usage:
 *   const track = useTrackEvent();
 *   track('bio_saved', { bioId: '123' });
 */
export function useTrackEvent() {
  const track = useCallback(
    (event: OasisBioEventName, properties?: Record<string, string | number | boolean | undefined>) => {
      const payload = {
        event,
        properties: {
          ...properties,
          url: typeof window !== 'undefined' ? window.location.pathname : undefined,
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
          referrer: typeof document !== 'undefined' ? document.referrer || undefined : undefined,
        },
        timestamp: new Date().toISOString(),
      };

      // Development: log to console
      if (process.env.NODE_ENV === 'development') {
        console.log(`[analytics] ${event}`, payload);
      }

      // Send to server-side analytics endpoint (fire-and-forget)
      fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true, // Ensure delivery even if user navigates away
      }).catch(() => {
        // Silently fail — analytics should never break the UX
      });
    },
    [],
  );

  return track;
}
