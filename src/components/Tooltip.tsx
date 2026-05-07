'use client';

import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  type ReactNode,
  type HTMLAttributes,
} from 'react';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export type TooltipSide = 'top' | 'right' | 'bottom' | 'left';
export type TooltipVariant = 'default' | 'info' | 'warning' | 'success' | 'error';

export interface TooltipProps {
  /** The content to show inside the tooltip */
  content: ReactNode;
  /** The trigger element (child) that shows the tooltip on hover/focus */
  children: ReactNode;
  /** Position relative to the trigger (default: 'top') */
  side?: TooltipSide;
  /** Visual variant — changes border-left accent color (default: 'default') */
  variant?: TooltipVariant;
  /** Delay before showing (ms). Default: 200 for hover, instant for focus */
  delay?: number;
  /** Extra CSS class for the tooltip bubble */
  className?: string;
  /** Max width of the tooltip bubble. Default: 250px */
  maxWidth?: number | string;
  /** Show a small dot indicator on the trigger */
  showIndicator?: boolean;
  /** Accessible label for the tooltip container */
  ariaLabel?: string;
  /** HTML attributes spread to the wrapper span */
  wrapperProps?: HTMLAttributes<HTMLSpanElement>;
}

// ─────────────────────────────────────────────
// Offset map: spacing between trigger and bubble
// ─────────────────────────────────────────────

const SIDE_OFFSETS: Record<TooltipSide, string> = {
  top: 'mb-2',
  right: 'ml-2',
  bottom: 'mt-2',
  left: 'mr-2',
};

// ─────────────────────────────────────────────
// Position classes for the bubble
// ─────────────────────────────────────────────

const POSITION_CLASSES: Record<TooltipSide, string> = {
  top:    'left-1/2 -translate-x-1/2 bottom-full',
  right:  'left-full top-1/2 -translate-y-1/2',
  bottom: 'left-1/2 -translate-x-1/2 top-full',
  left:   'right-full top-1/2 -translate-y-1/2',
};

// Arrow rotation per side (for the little triangle)
const ARROW_CLASSES: Record<TooltipSide, string> = {
  top:    'top-full left-1/2 -translate-x-1/2 border-t-transparent border-l-transparent border-r-transparent border-b-background rotate-180',
  right: 'right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-background -rotate-90',
  bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-transparent border-l-transparent border-r-transparent border-t-background',
  left:   'left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-background rotate-90',
};

// Variant accent colors (subtle left-border or icon tint)
const VARIANT_ACCENT: Record<TooltipVariant, string> = {
  default: 'border-l-border',
  info:    'border-l-blue-500',
  warning: 'border-l-amber-500',
  success: 'border-l-emerald-500',
  error:   'border-l-red-500',
};

const VARIANT_ICON_COLOR: Record<TooltipVariant, string> = {
  default: 'text-muted-foreground',
  info:    'text-blue-500',
  warning: 'text-amber-500',
  success: 'text-emerald-500',
  error:   'text-red-500',
};

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

export function Tooltip({
  content,
  children,
  side = 'top',
  variant = 'default',
  delay = 200,
  className = '',
  maxWidth = 250,
  showIndicator = false,
  ariaLabel,
  wrapperProps,
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const [entered, setEntered] = useState(false); // for animation state
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);
  const triggerRef = useRef<HTMLSpanElement>(null);

  // Clear any pending show timer
  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Schedule showing after delay
  const scheduleShow = useCallback(
    (skipDelay = false) => {
      clearTimer();
      if (skipDelay) {
        setVisible(true);
        // Slight delay for animation frame
        requestAnimationFrame(() => setEntered(true));
      } else {
        timerRef.current = setTimeout(() => {
          setVisible(true);
          requestAnimationFrame(() => setEntered(true));
        }, delay);
      }
    },
    [delay, clearTimer]
  );

  // Hide with slight delay for smooth exit feel
  const hide = useCallback(() => {
    clearTimer();
    setEntered(false);
    // Wait for exit animation to finish
    setTimeout(() => setVisible(false), 150);
  }, [clearTimer]);

  // Cleanup on unmount
  useEffect(() => () => clearTimer(), [clearTimer]);

  // Build dynamic style object
  const bubbleStyle: React.CSSProperties = {
    maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth,
  };

  return (
    <span
      ref={triggerRef}
      className={`relative inline-flex items-center ${wrapperProps?.className ?? ''}`}
      {...(ariaLabel ? { 'aria-label': ariaLabel } : {})}
      onMouseEnter={() => scheduleShow()}
      onMouseLeave={hide}
      onFocus={(e) => {
        // Only trigger on focusable elements within
        if (
          e.target instanceof HTMLElement &&
          (e.target.tagName === 'BUTTON' ||
            e.target.tagName === 'A' ||
            e.target.tagName === 'INPUT' ||
            e.target.tagName === 'SELECT' ||
            e.target.tagName === 'TEXTAREA' ||
            e.target.isContentEditable)
        ) {
          scheduleShow(true); // instant on focus
        }
      }}
      onBlur={(e) => {
        // Only hide when focus leaves our container entirely
        if (
          e.relatedTarget &&
          triggerRef.current &&
          !triggerRef.current.contains(e.relatedTarget as Node)
        ) {
          hide();
        }
      }}
    >
      {/* Trigger */}
      {children}

      {/* Optional indicator dot */}
      {showIndicator && (
        <span
          className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-primary animate-pulse-slow"
          aria-hidden="true"
        />
      )}

      {/* Tooltip Bubble — portal-free inline positioning */}
      {visible && (
        <div
          role="tooltip"
          className={`
            absolute z-[9999] ${POSITION_CLASSES[side]} ${SIDE_OFFSETS[side]}
            pointer-events-none select-none
            px-3 py-2 rounded-lg text-sm
            bg-popover text-popover-foreground
            border ${VARIANT_ACCENT[variant]}
            shadow-lg backdrop-blur-sm
            border-l-2
            transition-all duration-150 ease-out origin-center
            ${entered
              ? 'opacity-100 scale-100 translate-y-0'
              : 'opacity-0 scale-95 translate-y-1'
            }
            ${className}
          `}
          style={bubbleStyle}
          aria-hidden="false"
        >
          {/* Content */}
          <div className="relative z-10">
            {typeof content === 'string' ? <p className="leading-relaxed m-0">{content}</p> : content}
          </div>

          {/* Arrow (CSS triangle via borders) */}
          <span
            className={`
              absolute w-0 h-0 
              border-[6px] solid transparent
              ${ARROW_CLASSES[side]}
            `}
            aria-hidden="true"
          />
        </div>
      )}
    </span>
  );
}

// ─────────────────────────────────────────────
// Convenience: Hint Icon + Tooltip combo
// For inline help icons next to labels / fields
// ─────────────────────────────────────────────

export interface HintIconProps {
  /** Text shown in the tooltip */
  hint: string;
  /** Variant for the icon and tooltip */
  variant?: TooltipVariant;
  /** Which side the tooltip appears */
  side?: TooltipSide;
  /** Size of the icon */
  size?: 'sm' | 'md';
  /** Custom class for the icon button */
  className?: string;
  /** Accessible description */
  ariaLabel?: string;
  /** Additional class for the tooltip bubble */
  tooltipClassName?: string;
}

const SIZE_CLASSES = {
  sm: 'w-3.5 h-3.5',
  md: 'w-4 h-4',
};

/**
 * A small "?" info icon that shows a tooltip on hover.
 * Use next to form labels, section headers, etc.
 *
 * @example
 * ```tsx
 * <label>
 *   Field Name
 *   <HintIcon hint="This field controls..." variant="info" />
 * </label>
 * ```
 */
export function HintIcon({
  hint,
  variant = 'default',
  side = 'top',
  size = 'sm',
  className = '',
  ariaLabel = 'More information',
  tooltipClassName = '',
}: HintIconProps) {
  return (
    <Tooltip
      content={hint}
      side={side}
      variant={variant}
      delay={100}
      maxWidth={280}
      className={tooltipClassName}
      ariaLabel={ariaLabel}
    >
      <button
        type="button"
        tabIndex={0}
        className={`
          inline-flex items-center justify-center rounded-full
          transition-colors duration-150 cursor-help
          ${size === 'sm'
            ? 'p-0.5 ml-1 text-xs'
            : 'p-1 ml-1.5 text-sm'
          }
          ${VARIANT_ICON_COLOR[variant]}
          hover:bg-muted/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1
          ${className}
        `}
        aria-label={ariaLabel}
      >
        {/* Question-mark circle icon — Heroicons outline style */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={SIZE_CLASSES[size]}
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
          <circle cx="12" cy="17" r="0.5" fill="currentColor" stroke="none" />
        </svg>
      </button>
    </Tooltip>
  );
}

// ─────────────────────────────────────────────
// Convenience: FieldHint — replaces static hint text
// Wraps a form field's label+input with a collapsible tooltip
// ─────────────────────────────────────────────

export interface FieldHintProps {
  /** The hint text to display */
  hint: string;
  /** Mode: 'tooltip' (hover to reveal) or 'static' (always visible, styled nicely) */
  mode?: 'tooltip' | 'static';
  /** Tooltip side when mode='tooltip' */
  side?: TooltipSide;
  /** Variant */
  variant?: TooltipVariant;
  /** Class name for the static hint text */
  className?: string;
}

/**
 * Replaces the plain `<p className="text-xs text-gray-400">` hint pattern
 * with either an interactive tooltip or a polished static hint.
 *
 * @example
 * ```tsx
 * <FieldHint hint="The name your world is known by." mode="tooltip" />
 * ```
 */
export function FieldHint({
  hint,
  mode = 'tooltip',
  side = 'top',
  variant = 'info',
  className = '',
}: FieldHintProps) {
  if (mode === 'static') {
    return (
      <p
        className={`
          text-xs flex items-center gap-1
          text-muted-foreground mt-0.5 mb-2
          leading-relaxed
          ${className || ''}
        `}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-3 h-3 flex-shrink-0 opacity-50"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
          <circle cx="12" cy="17" r="0.5" fill="currentColor" stroke="none" />
        </svg>
        {hint}
      </p>
    );
  }

  return (
    <div className="flex items-center gap-1 mb-2">
      <HintIcon
        hint={hint}
        variant={variant}
        side={side}
        size="sm"
        ariaLabel="Field hint"
      />
      <span className="text-xs text-muted-foreground/60 italic">Hover for help</span>
    </div>
  );
}
