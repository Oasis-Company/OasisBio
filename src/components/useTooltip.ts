'use client';

import { useState, useCallback, useRef } from 'react';

// ─────────────────────────────────────────────
// useTooltip — imperative tooltip state hook
// For advanced scenarios where you need programmatic control
// ─────────────────────────────────────────────

export interface UseTooltipReturn {
  /** Whether the tooltip is currently visible */
  visible: boolean;
  /** Show the tooltip (optionally skip delay) */
  show: (skipDelay?: boolean) => void;
  /** Hide the tooltip */
  hide: () => void;
  /** Toggle the tooltip */
  toggle: () => void;
}

/**
 * Imperative hook for controlling tooltip visibility.
 * Useful when you need to show tooltips from event handlers
 * outside of hover/focus (e.g., on first-visit tutorial, error states).
 *
 * @param delay - Delay before showing (ms). Default: 200.
 * @param autoHideMs - Auto-hide after N ms. Default: 0 (no auto-hide).
 *
 * @example
 * ```tsx
 * const { visible, show, hide } = useTooltip(200);
 *
 * return (
 *   <Tooltip content="Help text" side="top">
 *     <button onMouseEnter={show} onClick={toggle}>?</button>
 *   </Tooltip>
 * );
 * ```
 */
export function useTooltip(delay = 200, autoHideMs = 0): UseTooltipReturn {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null) as React.MutableRefObject<ReturnType<typeof setTimeout> | null>;
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null) as React.MutableRefObject<ReturnType<typeof setTimeout> | null>;

  const clearAllTimers = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (hideTimerRef.current !== null) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  }, []);

  const show = useCallback(
    (skipDelay = false) => {
      clearAllTimers();
      if (skipDelay) {
        setVisible(true);
        if (autoHideMs > 0) {
          hideTimerRef.current = setTimeout(() => setVisible(false), autoHideMs);
        }
      } else {
        timerRef.current = setTimeout(() => {
          setVisible(true);
          if (autoHideMs > 0) {
            hideTimerRef.current = setTimeout(() => setVisible(false), autoHideMs);
          }
        }, delay);
      }
    },
    [delay, autoHideMs, clearAllTimers]
  );

  const hide = useCallback(() => {
    clearAllTimers();
    setVisible(false);
  }, [clearAllTimers]);

  const toggle = useCallback(() => {
    if (visible) {
      hide();
    } else {
      show(true);
    }
  }, [visible, hide, show]);

  // Cleanup on unmount
  // Note: We don't useEffect here because this is a pure state hook —
  // the caller is responsible for their own cleanup lifecycle.

  return { visible, show, hide, toggle };
}
