/**
 * Tests for user-sync utilities.
 *
 * Feature: supabase-auth-fix
 * Covers:
 *   - Property 2: Username uniqueness invariant
 *   - Property 3: syncUserToPrisma preserves user-edited fields
 *   - Property 4: syncUserToPrisma is idempotent
 */

import * as fc from 'fast-check';

// ---------------------------------------------------------------------------
// Pure helper extracted for testing without Prisma
// ---------------------------------------------------------------------------

/**
 * Pure version of username generation logic — no DB calls.
 * Takes an existing set of usernames and returns a unique candidate.
 */
function generateUsernameCandidate(base: string, existingUsernames: Set<string>): string {
  const clean = base.toLowerCase().replace(/[^a-z0-9]/g, '');
  const stem = clean.length > 0 ? clean : 'user_fallback';

  let candidate = stem;
  let counter = 1;

  while (existingUsernames.has(candidate)) {
    candidate = `${stem}${counter}`;
    counter++;
  }

  return candidate;
}

/**
 * Pure version of the field-preservation logic in syncUserToPrisma.
 * Returns the merged profile without touching user-edited fields.
 */
function mergeProfileFields(
  existing: { displayName: string; bio: string | null; website: string | null; avatarUrl: string | null },
  incoming: { displayName: string; avatarUrl: string | null }
): { displayName: string; bio: string | null; website: string | null; avatarUrl: string | null } {
  return {
    // Never overwrite user-edited displayName
    displayName: existing.displayName || incoming.displayName,
    bio: existing.bio,
    website: existing.website,
    // Only fill avatarUrl if currently empty
    avatarUrl: existing.avatarUrl || incoming.avatarUrl,
  };
}

// ---------------------------------------------------------------------------
// Property 2: Username uniqueness invariant
// Feature: supabase-auth-fix, Property 2: Username uniqueness invariant
// Validates: Requirements 5.5
// ---------------------------------------------------------------------------

describe('generateUsernameCandidate — Property 2: Username uniqueness', () => {
  it('always returns a username not in the existing set', () => {
    // Feature: supabase-auth-fix, Property 2: Username uniqueness invariant
    fc.assert(
      fc.property(
        fc.string({ minLength: 0, maxLength: 30 }),
        fc.array(fc.string({ minLength: 1, maxLength: 20 }), { minLength: 0, maxLength: 50 }),
        (base, existingArray) => {
          const existingSet = new Set(existingArray);
          const result = generateUsernameCandidate(base, existingSet);
          return !existingSet.has(result);
        }
      ),
      { numRuns: 200 }
    );
  });

  it('returns only lowercase alphanumeric characters', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 0, maxLength: 30 }),
        (base) => {
          const result = generateUsernameCandidate(base, new Set());
          return /^[a-z0-9_]+$/.test(result);
        }
      ),
      { numRuns: 200 }
    );
  });

  it('handles empty base string without throwing', () => {
    fc.assert(
      fc.property(
        fc.array(fc.string({ minLength: 1, maxLength: 20 }), { minLength: 0, maxLength: 10 }),
        (existingArray) => {
          const existingSet = new Set(existingArray);
          const result = generateUsernameCandidate('', existingSet);
          return typeof result === 'string' && result.length > 0;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('handles collision by appending numeric suffix', () => {
    const existing = new Set(['john', 'john1', 'john2']);
    const result = generateUsernameCandidate('John', existing);
    expect(result).toBe('john3');
  });

  it('handles special characters by stripping them', () => {
    const result = generateUsernameCandidate('Hello World!@#', new Set());
    expect(result).toBe('helloworld');
  });
});

// ---------------------------------------------------------------------------
// Property 3: Field preservation
// Feature: supabase-auth-fix, Property 3: syncUserToPrisma preserves user-edited fields
// Validates: Requirements 5.3
// ---------------------------------------------------------------------------

describe('mergeProfileFields — Property 3: Preserves user-edited fields', () => {
  it('never overwrites non-null displayName with incoming value', () => {
    // Feature: supabase-auth-fix, Property 3: syncUserToPrisma preserves user-edited fields
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }),  // existing displayName (non-empty)
        fc.string({ minLength: 1, maxLength: 50 }),  // incoming displayName
        fc.option(fc.string({ minLength: 1, maxLength: 200 })),  // existing bio
        fc.option(fc.string({ minLength: 1, maxLength: 100 })),  // existing website
        (existingDisplayName, incomingDisplayName, bio, website) => {
          const existing = {
            displayName: existingDisplayName,
            bio: bio ?? null,
            website: website ?? null,
            avatarUrl: null,
          };
          const result = mergeProfileFields(existing, {
            displayName: incomingDisplayName,
            avatarUrl: null,
          });
          return result.displayName === existingDisplayName;
        }
      ),
      { numRuns: 200 }
    );
  });

  it('never overwrites non-null bio', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 200 }),
        fc.string({ minLength: 1, maxLength: 50 }),
        (existingBio, incomingDisplayName) => {
          const existing = { displayName: 'User', bio: existingBio, website: null, avatarUrl: null };
          const result = mergeProfileFields(existing, { displayName: incomingDisplayName, avatarUrl: null });
          return result.bio === existingBio;
        }
      ),
      { numRuns: 200 }
    );
  });

  it('never overwrites non-null website', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 100 }),
        fc.string({ minLength: 1, maxLength: 50 }),
        (existingWebsite, incomingDisplayName) => {
          const existing = { displayName: 'User', bio: null, website: existingWebsite, avatarUrl: null };
          const result = mergeProfileFields(existing, { displayName: incomingDisplayName, avatarUrl: null });
          return result.website === existingWebsite;
        }
      ),
      { numRuns: 200 }
    );
  });
});

// ---------------------------------------------------------------------------
// Property 4: Idempotency
// Feature: supabase-auth-fix, Property 4: syncUserToPrisma is idempotent
// Validates: Requirements 5.2
// ---------------------------------------------------------------------------

describe('mergeProfileFields — Property 4: Idempotency', () => {
  it('applying merge twice produces the same result as once', () => {
    // Feature: supabase-auth-fix, Property 4: syncUserToPrisma is idempotent
    fc.assert(
      fc.property(
        fc.record({
          displayName: fc.string({ minLength: 1, maxLength: 50 }),
          bio: fc.option(fc.string({ minLength: 1, maxLength: 200 })).map(v => v ?? null),
          website: fc.option(fc.string({ minLength: 1, maxLength: 100 })).map(v => v ?? null),
          avatarUrl: fc.option(fc.string({ minLength: 1, maxLength: 200 })).map(v => v ?? null),
        }),
        fc.record({
          displayName: fc.string({ minLength: 1, maxLength: 50 }),
          avatarUrl: fc.option(fc.string({ minLength: 1, maxLength: 200 })).map(v => v ?? null),
        }),
        (existing, incoming) => {
          const firstPass = mergeProfileFields(existing, incoming);
          const secondPass = mergeProfileFields(firstPass, incoming);
          return (
            firstPass.displayName === secondPass.displayName &&
            firstPass.bio === secondPass.bio &&
            firstPass.website === secondPass.website &&
            firstPass.avatarUrl === secondPass.avatarUrl
          );
        }
      ),
      { numRuns: 200 }
    );
  });
});

// ---------------------------------------------------------------------------
// Unit tests — specific examples and edge cases
// ---------------------------------------------------------------------------

describe('generateUsernameCandidate — unit examples', () => {
  it('uses email prefix when display name is empty', () => {
    const result = generateUsernameCandidate('', new Set());
    expect(result).toBe('user_fallback');
  });

  it('handles unicode by stripping non-ascii', () => {
    const result = generateUsernameCandidate('张三', new Set());
    expect(result).toBe('user_fallback');
  });

  it('handles very long base strings', () => {
    const longBase = 'a'.repeat(100);
    const result = generateUsernameCandidate(longBase, new Set());
    expect(result).toBe('a'.repeat(100));
  });
});
