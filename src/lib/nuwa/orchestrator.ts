/**
 * Nuwa Integration - Orchestrator
 *
 * Orchestrates the Nuwa distillation process based on the Nuwa methodology:
 * Phase 1: Multi-source research (6 parallel agents)
 * Phase 2: Framework synthesis (mental models, heuristics, expression DNA)
 * Phase 3: Map framework to OasisBio suggestions
 *
 * Note: This is a skeleton implementation. The actual LLM calls
 * and research agents will be implemented in a later iteration.
 */

import type { NuwaSourceSnapshot, DistilledFramework, NuwaScope } from './types';
import { prisma } from '../prisma.client';
import { computeSnapshotHash, buildNuwaSourceSnapshot } from './source-snapshot';

export type RunMode = 'quick' | 'deep';
export type SourcePolicy = 'local_only' | 'local_plus_web';

interface OrchestratorOptions {
  runId: string;
  mode: RunMode;
  sourcePolicy: SourcePolicy;
  scopes: NuwaScope[];
  snapshot: NuwaSourceSnapshot;
}

/**
 * Main orchestrator entry point.
 * Kicks off the Nuwa distillation process for a given run.
 */
export async function runNuwaDistillation(runId: string): Promise<void> {
  const run = await prisma.nuwaRun.findUnique({
    where: { id: runId },
    include: { oasisBio: true },
  });

  if (!run) {
    throw new Error(`NuwaRun not found: ${runId}`);
  }

  try {
    // Update status to processing
    await prisma.nuwaRun.update({
      where: { id: runId },
      data: {
        status: 'processing',
        startedAt: new Date(),
      },
    });

    // Build source snapshot
    const include = JSON.parse(run.scopes as unknown as string) as Record<string, unknown>;
    const snapshot = await buildNuwaSourceSnapshot(run.oasisBioId, include);

    // Compute snapshot hash
    const snapshotHash = await computeSnapshotHash(snapshot);
    await prisma.nuwaRun.update({
      where: { id: runId },
      data: { snapshotHash },
    });

    // Run distillation (placeholder for now)
    const distilled = await executeDistillation({
      runId,
      mode: run.mode as RunMode,
      sourcePolicy: run.sourcePolicy as SourcePolicy,
      scopes: run.scopes as unknown as NuwaScope[],
      snapshot,
    });

    // Map framework to suggestions and save
    const suggestions = mapFrameworkToSuggestions(distilled, snapshot);

    await prisma.$transaction([
      prisma.nuwaRun.update({
        where: { id: runId },
        data: {
          status: 'completed',
          distilled: distilled as unknown as prisma.JsonValue,
          summary: buildSummary(distilled) as unknown as prisma.JsonValue,
          completedAt: new Date(),
        },
      }),
      ...suggestions.map((item) =>
        prisma.nuwaSuggestion.create({
          data: {
            runId,
            scope: item.scope,
            operation: item.operation,
            targetId: item.targetId,
            title: item.title,
            payload: item.payload as unknown as prisma.JsonValue,
            rationale: item.rationale,
            confidence: item.confidence,
            evidence: item.evidence as unknown as prisma.JsonValue,
            decision: 'pending',
          },
        })
      ),
    ]);
  } catch (error) {
    await prisma.nuwaRun.update({
      where: { id: runId },
      data: {
        status: 'failed',
        error: {
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        } as unknown as prisma.JsonValue,
        completedAt: new Date(),
      },
    });
    throw error;
  }
}

/**
 * Execute the actual distillation process.
 * TODO: Implement actual LLM calls and research agents.
 */
async function executeDistillation(
  _options: OrchestratorOptions
): Promise<DistilledFramework> {
  // Placeholder implementation
  // In production, this will:
  // 1. Run 6 parallel research agents (writings, conversations, expression, external, decisions, timeline)
  // 2. Synthesize framework using Nuwa methodology
  // 3. Return structured DistilledFramework

  return {
    mentalModels: [],
    decisionHeuristics: [],
    expressionDNA: {
      sentenceStyle: '',
      vocabulary: [],
      rhythm: '',
      humor: '',
      certaintyStyle: '',
      citationHabit: '',
    },
    antiPatterns: [],
    tensions: [],
    honestLimits: [],
    abilities: [],
    eras: [],
    worlds: [],
    references: [],
    descriptionPatch: {
      title: 'Placeholder',
      markdown: 'Nuwa distillation not yet implemented.',
      mode: 'replace',
    },
  };
}

/**
 * Map DistilledFramework to NuwaSuggestion records.
 */
function mapFrameworkToSuggestions(
  framework: DistilledFramework,
  _snapshot: NuwaSourceSnapshot
): Array<{
  scope: string;
  operation: string;
  targetId?: string;
  title?: string;
  payload: Record<string, unknown>;
  rationale?: string;
  confidence?: number;
  evidence?: unknown[];
}> {
  const suggestions: Array<{
    scope: string;
    operation: string;
    targetId?: string;
    title?: string;
    payload: Record<string, unknown>;
    rationale?: string;
    confidence?: number;
    evidence?: unknown[];
  }> = [];

  // Map description patch
  if (framework.descriptionPatch) {
    suggestions.push({
      scope: 'description',
      operation: 'update',
      payload: framework.descriptionPatch,
      rationale: 'Generated from mental models, decision heuristics, and expression DNA',
      confidence: 0.8,
    });
  }

  // Map abilities
  for (const ability of framework.abilities) {
    suggestions.push({
      scope: 'ability',
      operation: 'create',
      title: ability.name,
      payload: {
        name: ability.name,
        category: ability.category,
        level: ability.level,
        description: ability.description,
      },
      rationale: ability.evidence?.[0]?.snippet,
      confidence: 0.7,
      evidence: ability.evidence,
    });
  }

  // Map eras
  for (const era of framework.eras) {
    suggestions.push({
      scope: 'era',
      operation: 'create',
      title: era.name,
      payload: {
        name: era.name,
        eraType: era.eraType,
        startYear: era.startYear,
        endYear: era.endYear,
        description: era.description,
      },
      rationale: era.evidence?.[0]?.snippet,
      confidence: 0.7,
      evidence: era.evidence,
    });
  }

  return suggestions;
}

/**
 * Build a summary of the distillation results.
 */
function buildSummary(framework: DistilledFramework): Record<string, number> {
  return {
    mentalModels: framework.mentalModels.length,
    decisionHeuristics: framework.decisionHeuristics.length,
    abilities: framework.abilities.length,
    eras: framework.eras.length,
    worlds: framework.worlds.length,
    references: framework.references.length,
  };
}

/**
 * Check if a cached result can be used.
 */
export async function findCachedRun(
  oasisBioId: string,
  snapshotHash: string,
  scopes: string[],
  mode: string,
  promptVersion?: string
): Promise<string | null> {
  const existing = await prisma.nuwaRun.findFirst({
    where: {
      oasisBioId,
      snapshotHash,
      scopes: { equals: scopes },
      mode,
      promptVersion: promptVersion ?? null,
      status: 'completed',
    },
    orderBy: { createdAt: 'desc' },
  });

  return existing?.id ?? null;
}
