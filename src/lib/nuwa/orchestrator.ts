/**
 * Nuwa Integration - Orchestrator
 *
 * Orchestrates the Nuwa distillation process based on the Nuwa methodology:
 * Phase 1: Multi-source research (6 parallel agents) — source snapshot from DB
 * Phase 2: Framework synthesis (mental models, heuristics, expression DNA) — LLM call
 * Phase 3: Map framework to OasisBio suggestions
 *
 * The orchestrator coordinates the full distillation pipeline:
 * 1. Builds a source snapshot from existing OasisBio data
 * 2. Sends it to an LLM with Nuwa methodology prompts
 * 3. Parses the structured response into a DistilledFramework
 * 4. Maps framework fields to NuwaSuggestion records for user review
 */

import type { NuwaSourceSnapshot, DistilledFramework, NuwaScope } from './types';
import { prisma } from '../prisma.client';
import { computeSnapshotHash, buildNuwaSourceSnapshot, trimSnapshotForQuickMode } from './source-snapshot';
import {
  getDefaultLlmConfig,
  callLlm,
  buildDistillationSystemPrompt,
  buildDistillationUserPrompt,
} from './llm';

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
 *
 * Pipeline:
 * 1. Trim snapshot for quick mode (token budget management)
 * 2. Build Nuwa methodology prompts (system + user)
 * 3. Call LLM with structured output format
 * 4. Parse and validate the DistilledFramework response
 */
async function executeDistillation(
  options: OrchestratorOptions
): Promise<DistilledFramework> {
  // Step 1: Prepare snapshot based on mode
  let snapshot = options.snapshot;
  if (options.mode === 'quick') {
    snapshot = trimSnapshotForQuickMode(snapshot);
  }

  // Step 2: Get LLM configuration
  const config = getDefaultLlmConfig();

  // Step 3: Build prompts
  const systemPrompt = buildDistillationSystemPrompt(options.scopes, options.mode);
  const userPrompt = buildDistillationUserPrompt(snapshot, options.mode);

  console.log(`[Nuwa] Starting distillation: mode=${options.mode}, scopes=${options.scopes.join(',')}`);

  // Step 4: Call LLM
  const response = await callLlm<DistilledFramework>(
    [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    config,
    {
      responseFormat: 'json',
      maxRetries: 3,
    }
  );

  // Step 5: Validate response
  if (!response.parsed) {
    throw new Error('Failed to parse LLM response as DistilledFramework JSON');
  }

  const framework = response.parsed;

  // Ensure all required fields exist (defensive defaults for partial responses)
  const validated: DistilledFramework = {
    mentalModels: framework.mentalModels ?? [],
    decisionHeuristics: framework.decisionHeuristics ?? [],
    expressionDNA: framework.expressionDNA ?? {
      sentenceStyle: '',
      vocabulary: [],
      rhythm: '',
      humor: '',
      certaintyStyle: '',
      citationHabit: '',
    },
    antiPatterns: framework.antiPatterns ?? [],
    tensions: framework.tensions ?? [],
    honestLimits: framework.honestLimits ?? [],
    abilities: framework.abilities ?? [],
    eras: framework.eras ?? [],
    worlds: framework.worlds ?? [],
    references: framework.references ?? [],
    descriptionPatch: framework.descriptionPatch ?? {
      title: 'Distilled Description',
      markdown: '',
      mode: 'append',
    },
  };

  console.log(`[Nuwa] Distillation complete: ${validated.mentalModels.length} mental models, ${validated.decisionHeuristics.length} heuristics`);

  return validated;
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

  // Map worlds
  for (const world of framework.worlds) {
    suggestions.push({
      scope: 'world',
      operation: 'create',
      title: world.name,
      payload: {
        name: world.name,
        summary: world.summary,
        timeSetting: world.timeSetting,
        socialStructure: world.socialStructure,
        rules: world.rules,
        timeline: world.timeline,
        majorConflict: world.majorConflict,
        genre: world.genre,
        tone: world.tone,
      },
      rationale: world.evidence?.[0]?.snippet,
      confidence: 0.6,
      evidence: world.evidence,
    });
  }

  // Map references
  for (const ref of framework.references) {
    suggestions.push({
      scope: 'reference',
      operation: 'create',
      title: ref.title,
      payload: {
        url: ref.url,
        title: ref.title,
        description: ref.description,
        sourceType: ref.sourceType,
        provider: ref.provider,
        tags: ref.tags,
        whyRelevant: ref.whyRelevant,
      },
      rationale: ref.whyRelevant || ref.evidence?.[0]?.snippet,
      confidence: 0.5,
      evidence: ref.evidence,
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
