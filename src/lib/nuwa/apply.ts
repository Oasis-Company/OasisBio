/**
 * Nuwa Integration - Apply Suggestions
 *
 * Applies accepted Nuwa suggestions to OasisBio core tables.
 * Supports partial adoption - users can apply selected suggestions only.
 */

import { prisma } from '../prisma.client';
import type {
  ApplyNuwaSuggestionsInput,
  NuwaSuggestionScope,
  NuwaSuggestionOperation,
} from './types';

interface ApplyResult {
  itemId: string;
  entityType: string;
  entityId: string;
}

/**
 * Apply selected Nuwa suggestions to OasisBio data.
 */
export async function applyNuwaSuggestions(
  runId: string,
  input: ApplyNuwaSuggestionsInput
): Promise<ApplyResult[]> {
  const items = await prisma.nuwaSuggestion.findMany({
    where: {
      runId,
      id: { in: input.itemIds },
      decision: { in: ['pending', 'accepted'] as const },
    },
    include: { run: true },
  });

  if (items.length === 0) {
    return [];
  }

  const results: ApplyResult[] = [];

  for (const item of items) {
    const result = await applySingleSuggestion(item, input);
    if (result) {
      results.push(result);
    }
  }

  return results;
}

/**
 * Apply a single suggestion based on its scope and operation.
 */
async function applySingleSuggestion(
  item: {
    id: string;
    scope: string;
    operation: string;
    payload: unknown;
    run: { oasisBioId: string };
  },
  input: ApplyNuwaSuggestionsInput
): Promise<ApplyResult | null> {
  const scope = item.scope as NuwaSuggestionScope;
  const operation = item.operation as NuwaSuggestionOperation;
  const payload = item.payload as Record<string, unknown>;

  try {
    let result: ApplyResult | null = null;

    if (scope === 'description') {
      result = await applyDescription(item.run.oasisBioId, payload, input);
    } else if (scope === 'dcos' && (operation === 'append' || operation === 'create')) {
      result = await applyDcosAppend(item.run.oasisBioId, payload);
    } else if (scope === 'ability' && operation === 'create') {
      result = await applyAbilityCreate(item.run.oasisBioId, payload);
    } else if (scope === 'era' && operation === 'create') {
      result = await applyEraCreate(item.run.oasisBioId, payload);
    } else if (scope === 'world' && operation === 'create') {
      result = await applyWorldCreate(item.run.oasisBioId, payload, input);
    } else if (scope === 'reference' && operation === 'create') {
      result = await applyReferenceCreate(item.run.oasisBioId, payload);
    }

    if (result) {
      // Update suggestion status
      await prisma.nuwaSuggestion.update({
        where: { id: item.id },
        data: {
          decision: 'applied',
          appliedAt: new Date(),
          createdEntityId: result.entityId,
        },
      });
    }

    return result;
  } catch (error) {
    console.error(`Failed to apply suggestion ${item.id}:`, error);
    return null;
  }
}

/**
 * Apply description patch (append or replace).
 */
async function applyDescription(
  oasisBioId: string,
  payload: Record<string, unknown>,
  input: ApplyNuwaSuggestionsInput
): Promise<ApplyResult> {
  const current = await prisma.oasisBio.findUnique({
    where: { id: oasisBioId },
    select: { description: true },
  });

  const markdown = payload.markdown as string;
  const mode = (input.descriptionMode || payload.mode || 'append') as string;

  let newDescription: string;
  if (mode === 'replace') {
    newDescription = markdown;
  } else {
    // append or manual_merge defaults to append
    const existing = current?.description || '';
    newDescription = existing ? `${existing}\n\n${markdown}` : markdown;
  }

  await prisma.oasisBio.update({
    where: { id: oasisBioId },
    data: { description: newDescription },
  });

  return {
    itemId: '',
    entityType: 'oasisBio.description',
    entityId: oasisBioId,
  };
}

/**
 * Apply dcos (cognitive framework) suggestion by appending structured analysis to description.
 * Maps mental models, heuristics, anti-patterns, tensions, expression DNA into readable markdown.
 */
async function applyDcosAppend(
  oasisBioId: string,
  payload: Record<string, unknown>
): Promise<ApplyResult> {
  const type = (payload.type as string) ?? 'unknown';
  let markdownSection = '';

  switch (type) {
    case 'mental_model':
      markdownSection = `### 🧠 Mental Model: ${payload.name ?? 'Unnamed'}

**One-Liner:** ${payload.oneLiner ?? ''}

${payload.application ? `**Application:** ${payload.application}\n` : ''}${payload.limitation ? `**Limitation:** ${payload.limitation}` : ''}`;
      break;
    case 'decision_heuristic':
      markdownSection = `### ⚡ Decision Heuristic: ${payload.name ?? 'Unnamed'}

> **Rule:** ${payload.rule ?? ''}

${payload.scenario ? `**Scenario:** ${payload.scenario}\n` : ''}${payload.example ? `**Example:** ${payload.example}` : ''}`;
      break;
    case 'anti_pattern':
      markdownSection = `### 🚫 Anti-Pattern

> **Would never:** ${payload.statement ?? '(unspecified)'}`;
      break;
    case 'tension':
      markdownSection = `### ⚖️ Internal Tension

| | |
|---|---|
| **Left** | ${payload.left ?? ''} |
| **Right** | ${payload.right ?? ''} |

${payload.explanation ? `${payload.explanation}` : ''}`;
      break;
    case 'honest_limit':
      markdownSection = `### ❓ Knowledge Boundary

*What we cannot know from available data:* ${payload.statement ?? '(unspecified)'}`;
      break;
    case 'expression_dna': {
      const vocab = (payload.vocabulary as string[]) ?? [];
      const vocabList = vocab.length > 0 ? `\n${vocab.map((v: string) => `- \`${v}\``).join('\n')}` : '';
      markdownSection = `### 🎭 Expression DNA Profile

| Dimension | Value |
|-----------|-------|
| Sentence Style | ${payload.sentenceStyle ?? '-'} |
| Rhythm | ${payload.rhythm ?? '-'} |
| Humor | ${payload.humor ?? '-'} |
| Certainty Style | ${payload.certaintyStyle ?? '-'} |
| Citation Habit | ${payload.citationHabit ?? '-'} |

#### Vocabulary${vocabList}`;
      break;
    }
    default:
      // Fallback for unknown types — just serialize as JSON
      markdownSection = `\n\n${'```'}json\n${JSON.stringify(payload, null, 2)}\n${'```'}\n`;
  }

  // Append to existing description
  const current = await prisma.oasisBio.findUnique({
    where: { id: oasisBioId },
    select: { description: true },
  });

  const existing = current?.description || '';
  const separator = existing && !existing.endsWith('\n') ? '\n\n' : '';
  const newDescription = `${existing}${separator}${markdownSection}`;

  await prisma.oasisBio.update({
    where: { id: oasisBioId },
    data: { description: newDescription },
  });

  return {
    itemId: '',
    entityType: 'dcos.description_append',
    entityId: oasisBioId,
  };
}

/**
 * Create a new ability from suggestion.
 */
async function applyAbilityCreate(
  oasisBioId: string,
  payload: Record<string, unknown>
): Promise<ApplyResult> {
  const ability = await prisma.ability.create({
    data: {
      oasisBioId,
      name: payload.name as string,
      category: payload.category as string,
      level: (payload.level as number) || 1,
      description: (payload.description as string) || null,
      relatedEraId: (payload.relatedEraId as string) || null,
      relatedWorldId: (payload.relatedWorldId as string) || null,
    },
  });

  return {
    itemId: '',
    entityType: 'ability',
    entityId: ability.id,
  };
}

/**
 * Create a new era from suggestion.
 */
async function applyEraCreate(
  oasisBioId: string,
  payload: Record<string, unknown>
): Promise<ApplyResult> {
  const maxOrder = await prisma.eraIdentity.aggregate({
    where: { oasisBioId },
    _max: { sortOrder: true },
  });

  const era = await prisma.eraIdentity.create({
    data: {
      oasisBioId,
      name: payload.name as string,
      eraType: payload.eraType as string,
      startYear: (payload.startYear as number) || null,
      endYear: (payload.endYear as number) || null,
      description: (payload.description as string) || null,
      sortOrder: (maxOrder._max.sortOrder ?? -1) + 1,
    },
  });

  return {
    itemId: '',
    entityType: 'era',
    entityId: era.id,
  };
}

/**
 * Create a new world from suggestion.
 */
async function applyWorldCreate(
  oasisBioId: string,
  payload: Record<string, unknown>,
  input: ApplyNuwaSuggestionsInput
): Promise<ApplyResult> {
  // Check if user wants to use existing world or create new
  if (input.worldTarget?.kind === 'existing') {
    // Link to existing world (update it)
    const worldId = input.worldTarget.worldId;
    await prisma.worldItem.update({
      where: { id: worldId },
      data: {
        summary: (payload.summary as string) || undefined,
        timeSetting: (payload.timeSetting as string) || undefined,
        socialStructure: (payload.socialStructure as string) || undefined,
        rules: (payload.rules as string) || undefined,
        timeline: (payload.timeline as string) || undefined,
        majorConflict: (payload.majorConflict as string) || undefined,
      },
    });
    return {
      itemId: '',
      entityType: 'world',
      entityId: worldId,
    };
  }

  // Create new world
  const world = await prisma.worldItem.create({
    data: {
      oasisBioId,
      name: (payload.name as string) || input.worldTarget?.name || 'New World',
      summary: (payload.summary as string) || '',
      timeSetting: (payload.timeSetting as string) || null,
      geography: (payload.geography as string) || null,
      physicsRules: (payload.physicsRules as string) || null,
      socialStructure: (payload.socialStructure as string) || null,
      aestheticKeywords: (payload.genre as string) || null,
      majorConflict: (payload.majorConflict as string) || null,
      timeline: (payload.timeline as string) || null,
      rules: (payload.rules as string) || null,
      factions: (payload.factions as string) || null,
      visibility: 'private',
    },
  });

  return {
    itemId: '',
    entityType: 'world',
    entityId: world.id,
  };
}

/**
 * Create a new reference from suggestion.
 */
async function applyReferenceCreate(
  oasisBioId: string,
  payload: Record<string, unknown>
): Promise<ApplyResult> {
  const reference = await prisma.referenceItem.create({
    data: {
      oasisBioId,
      url: payload.url as string,
      title: payload.title as string,
      description: (payload.description as string) || null,
      sourceType: (payload.sourceType as string) || 'website',
      provider: (payload.provider as string) || null,
      tags: (payload.tags as string) || '',
      eraId: (payload.eraId as string) || null,
      worldId: (payload.worldId as string) || null,
    },
  });

  return {
    itemId: '',
    entityType: 'reference',
    entityId: reference.id,
  };
}

/**
 * Reject suggestions (mark as rejected without applying).
 */
export async function rejectNuwaSuggestions(
  runId: string,
  itemIds: string[]
): Promise<number> {
  const result = await prisma.nuwaSuggestion.updateMany({
    where: {
      runId,
      id: { in: itemIds },
      decision: { in: ['pending', 'accepted'] as const },
    },
    data: {
      decision: 'rejected',
    },
  });

  return result.count;
}

/**
 * Merge two descriptions.
 */
export function mergeDescription(
  existing: string | null,
  newContent: string
): string {
  if (!existing) return newContent;
  return `${existing}\n\n---\n\n${newContent}`;
}
