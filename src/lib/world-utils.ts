import { COMPLETION_FIELDS, WorldFormData } from '@/types/world';

// ─────────────────────────────────────────────
// Completion Score
// ─────────────────────────────────────────────

/**
 * Calculates the completion score for a world.
 *
 * Score = Math.round((filledCount / 10) * 100)
 * where filledCount = number of non-null, non-empty-string fields
 * among the 10 tracked COMPLETION_FIELDS.
 *
 * Feature: world-builder, Property 3: Completion score formula correctness
 */
export function calculateCompletionScore(world: Partial<WorldFormData>): number {
  const filled = COMPLETION_FIELDS.filter((key) => {
    const val = world[key];
    return val !== null && val !== undefined && String(val).trim() !== '';
  }).length;
  return Math.round((filled / COMPLETION_FIELDS.length) * 100);
}

/**
 * Returns filled/total counts for a specific module's fields.
 */
export function getModuleCompletion(
  world: Partial<WorldFormData>,
  fieldKeys: (keyof WorldFormData)[]
): { filled: number; total: number } {
  const total = fieldKeys.length;
  const filled = fieldKeys.filter((key) => {
    const val = world[key];
    return val !== null && val !== undefined && String(val).trim() !== '';
  }).length;
  return { filled, total };
}

// ─────────────────────────────────────────────
// Text utilities
// ─────────────────────────────────────────────

/**
 * Truncates a string to maxLength characters, appending "…" if truncated.
 */
export function truncateSummary(summary: string, maxLength = 80): string {
  if (!summary) return '';
  if (summary.length <= maxLength) return summary;
  return summary.slice(0, maxLength - 1).trimEnd() + '…';
}

// ─────────────────────────────────────────────
// Validation
// ─────────────────────────────────────────────

export interface WorldFormErrors {
  name?: string;
  summary?: string;
}

/**
 * Validates the world form data.
 * Only name and summary are required.
 *
 * Feature: world-builder, Property 5: Validation — name and summary are required
 */
export function validateWorldForm(data: Partial<WorldFormData>): WorldFormErrors {
  const errors: WorldFormErrors = {};
  if (!data.name || data.name.trim() === '') {
    errors.name = 'World name is required';
  }
  if (!data.summary || data.summary.trim() === '') {
    errors.summary = 'Summary is required';
  }
  return errors;
}

export function hasValidationErrors(errors: WorldFormErrors): boolean {
  return Object.keys(errors).length > 0;
}

// ─────────────────────────────────────────────
// aestheticKeywords ↔ genre/tone serialization
// ─────────────────────────────────────────────

interface GenreTone {
  genre?: string;
  tone?: string;
}

/** Serialize genre + tone into the aestheticKeywords JSON field */
export function serializeGenreTone(genre: string, tone: string): string {
  return JSON.stringify({ genre: genre || '', tone: tone || '' });
}

/** Deserialize genre + tone from the aestheticKeywords JSON field */
export function deserializeGenreTone(aestheticKeywords: string | null | undefined): GenreTone {
  if (!aestheticKeywords) return {};
  try {
    const parsed = JSON.parse(aestheticKeywords);
    if (typeof parsed === 'object' && parsed !== null) {
      return { genre: parsed.genre ?? '', tone: parsed.tone ?? '' };
    }
    return {};
  } catch {
    // Legacy: plain text stored before JSON format
    return { genre: aestheticKeywords, tone: '' };
  }
}
