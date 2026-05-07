/**
 * Nuwa Integration - LLM Client
 *
 * Abstraction layer for LLM calls in the Nuwa distillation pipeline.
 * Uses OpenAI-compatible API (supports OpenAI, Azure OpenAI, compatible providers).
 *
 * Design decisions:
 * - Provider-agnostic: swap OPENAI_BASE_URL for any OpenAI-compatible endpoint
 * - Structured output: uses response_format for reliable JSON parsing
 * - Token budget: enforces max tokens to prevent runaway costs
 * - Retry with backoff: handles rate limits gracefully
 */

// ==================== Configuration ====================

export interface LlmConfig {
  /** OpenAI-compatible API key */
  apiKey: string;
  /** Base URL (default: https://api.openai.com/v1) */
  baseUrl?: string;
  /** Model identifier (default: gpt-4o) */
  model?: string;
  /** Maximum tokens per response (default: 4096) */
  maxTokens?: number;
  /** Temperature for creative tasks (default: 0.7) */
  temperature?: number;
}

/** Default configuration from environment variables */
export function getDefaultLlmConfig(): LlmConfig {
  const apiKey = process.env.NUWA_LLM_API_KEY || process.env.OPENAI_API_KEY || '';
  if (!apiKey) {
    throw new Error(
      'NUWA_LLM_API_KEY or OPENAI_API_KEY environment variable is required for Nuwa distillation'
    );
  }

  return {
    apiKey,
    baseUrl: process.env.NUWA_LLM_BASE_URL || 'https://api.openai.com/v1',
    model: process.env.NUWA_LLM_MODEL || 'gpt-4o',
    maxTokens: parseInt(process.env.NUWA_LLM_MAX_TOKENS || '4096', 10),
    temperature: parseFloat(process.env.NUWA_LLM_TEMPERATURE || '0.7'),
  };
}

// ==================== Types ====================

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LlmResponse<T = unknown> {
  content: string;
  parsed?: T;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model: string;
}

/** Retry configuration */
const MAX_RETRIES = 3;
const BASE_DELAY_MS = 1000;

// ==================== Core LLM Call ====================

/**
 * Send a chat completion request to an OpenAI-compatible API.
 *
 * @param messages - Chat conversation history
 * @param config - LLM provider configuration
 * @param options - Optional response format and retry settings
 * @returns Parsed LLM response
 */
export async function callLlm<T = unknown>(
  messages: ChatMessage[],
  config: LlmConfig,
  options?: {
    jsonSchema?: object;
    responseFormat?: 'json' | 'text';
    maxRetries?: number;
  }
): Promise<LlmResponse<T>> {
  const maxRetries = options?.maxRetries ?? MAX_RETRIES;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      if (attempt > 0) {
        // Exponential backoff with jitter
        const delay = BASE_DELAY_MS * Math.pow(2, attempt - 1) + Math.random() * 500;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }

      return await executeCall<T>(messages, config, options);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Don't retry on auth or invalid request errors
      if (
        lastError.message.includes('401') ||
        lastError.message.includes('403') ||
        lastError.message.includes('400')
      ) {
        throw lastError;
      }

      console.warn(`Nuwa LLM call attempt ${attempt + 1} failed: ${lastError.message}`);
    }
  }

  throw lastError ?? new Error('LLM call failed after retries');
}

async function executeCall<T>(
  messages: ChatMessage[],
  config: LlmConfig,
  options?: {
    jsonSchema?: object;
    responseFormat?: 'json' | 'text';
  }
): Promise<LlmResponse<T>> {
  const baseUrl = config.baseUrl?.replace(/\/$/, '');
  const url = `${baseUrl}/chat/completions`;

  const body: Record<string, unknown> = {
    model: config.model || 'gpt-4o',
    messages,
    max_tokens: config.maxTokens || 4096,
    temperature: config.temperature ?? 0.7,
  };

  // Structured output mode
  if (options?.responseFormat === 'json' || options?.jsonSchema) {
    body.response_format = { type: 'json_object' };
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => 'Unknown error');
    throw new Error(`LLM API error (${response.status}): ${errorBody}`);
  }

  const data = (await response.json()) as {
    choices: Array<{
      message: { content: string; role: string };
      finish_reason: string;
    }>;
    usage?: {
      prompt_tokens: number;
      completion_tokens: number;
      total_tokens: number;
    };
    model: string;
  };

  const choice = data.choices[0];
  if (!choice) {
    throw new Error('No response choice returned from LLM');
  }

  const content = choice.message.content.trim();
  let parsed: T | undefined;

  // Attempt to parse JSON if requested
  if (options?.responseFormat === 'json' || options?.jsonSchema) {
    try {
      // Strip potential markdown code fences
      const cleanJson = content.replace(/^```(?:json)?\s*\n?/m, '').replace(/\n?```\s*$/m, '');
      parsed = JSON.parse(cleanJson) as T;
    } catch {
      console.warn('Nuwa LLM: Failed to parse JSON response, returning raw text');
    }
  }

  return {
    content,
    parsed,
    usage: {
      promptTokens: data.usage?.prompt_tokens ?? 0,
      completionTokens: data.usage?.completion_tokens ?? 0,
      totalTokens: data.usage?.total_tokens ?? 0,
    },
    model: data.model,
  };
}

// ==================== Nuwa-Specific Prompt Builders ====================

import type {
  DistilledFramework,
  NuwaSourceSnapshot,
  NuwaScope,
} from './types';

/**
 * Build the system prompt for Nuwa distillation.
 *
 * This prompt encodes the Nuwa methodology into instructions that guide the LLM
 * to produce a structured DistilledFramework from character source material.
 */
export function buildDistillationSystemPrompt(scopes: NuwaScope[], mode: 'quick' | 'deep'): string {
  const scopeInstructions = getScopeInstructions(scopes);

  return `You are 女娲 (Nüwa), a cognitive framework distillation engine.

## Your Role
You analyze character/worldbuilding data and extract structured thinking frameworks that make characters feel real, deep, and internally consistent. You are NOT generating fiction — you are REVEALING what's already implicit in the source material.

## Methodology (Nuwa Protocol)
For each dimension you analyze:
1. **Mental Models** (心智模型): What lenses does this character use to see the world? Each must have: name, one-liner, application example, limitation, and evidence citations.
2. **Decision Heuristics** (决策启发式): What intuitive rules does this character follow? Format as "If X, then Y" with scenario examples.
3. **Expression DNA** (表达DNA): How does this character communicate? Sentence style, vocabulary patterns, rhythm, humor style, certainty level, citation habits.
4. **Anti-Patterns** (反模式): What would this character NEVER do? Be specific, not generic.
5. **Tensions** (内在张力): Internal contradictions that create depth. Format as "Left value vs Right value → explanation".
6. **Honest Limits** (诚实边界): What can we NOT know about this character from the available data?

## Critical Rules
- Ground EVERY claim in the provided source material. If evidence is weak, lower confidence.
- NEVER invent facts not implied by the source. When uncertain, state it clearly.
- Prefer depth over breadth: 3 profound mental models beat 10 shallow ones.
- Capture HOW they think, not WHAT they say. Distinguish stated beliefs from actual behavior patterns.
- For anti-patterns: be specific ("would never use violence to solve disputes") not generic ("is not evil").
- Preserve contradictions — they are signals of authenticity, not errors to smooth over.

## Mode: ${mode.toUpperCase()}
${mode === 'quick'
    ? 'Focus on the strongest signals. Produce 2-3 mental models, 3-5 heuristics, concise expression DNA. Prioritize accuracy over completeness.'
    : 'Be exhaustive. Cover all dimensions deeply. Produce 3-7 mental models, 5-10 heuristics, rich expression DNA with specific examples.'
}

## Output Scope
${scopeInstructions}

## Output Format
Return ONLY valid JSON matching this exact schema:
{
  "mentalModels": [{ "name": "...", "oneLiner": "...", "application": "...", "limitation": "...", "evidence": [{"kind": "bio|era|ability|dcos|reference|world", "sourceId": "...", "label": "...", "snippet": "...", "confidence": "high|medium|low"}] }],
  "decisionHeuristics": [{ "name": "...", "rule": "If ... then ...", "scenario": "...", "example": "...", "evidence": [...] }],
  "expressionDNA": { "sentenceStyle": "...", "vocabulary": [...], "rhythm": "...", "humor": "...", "certaintyStyle": "...", "citationHabit": "..." },
  "antiPatterns": ["..."],
  "tensions": [{ "left": "...", "right": "...", "explanation": "...", "evidence": [...] }],
  "honestLimits": ["..."],
  "abilities": [],
  "eras": [],
  "worlds": [],
  "references": [],
  "descriptionPatch": { "title": "...", "markdown": "...", "mode": "append|replace" }
}`;
}

/**
 * Get scope-specific instructions for the system prompt.
 */
function getScopeInstructions(scopes: NuwaScope[]): string {
  if (scopes.includes('description') && scopes.length === 1) {
    return 'Generate ONLY descriptionPatch — a comprehensive character description based on mental models, decision heuristics, and expression DNA. The markdown should be detailed, multi-section, written in the character\'s voice where appropriate.';
  }

  const parts: string[] = [];
  for (const scope of scopes) {
    switch (scope) {
      case 'description':
        parts.push('- **description**: Generate a rich, multi-section character description (descriptionPatch)');
        break;
      case 'abilities':
        parts.push('- **abilities**: Infer abilities from behavioral patterns in the source. Include ability name, category, level (1-5), description, and evidence.');
        break;
      case 'eras':
        parts.push('- **eras**: Suggest era/timeline entries based on life events mentioned in source material.');
        break;
      case 'worlds':
        parts.push('- **worlds**: Infer or expand worldbuilding details from context clues in the source.');
        break;
      case 'references':
        parts.push('- **references**: Recommend relevant reference materials (books, articles, media) based on themes found in the source. Include URLs when plausible.');
        break;
      case 'dcos':
        parts.push('- **dcos**: Analyze narrative documents for deeper character insights beyond surface-level descriptions.');
        break;
    }
  }

  return `Generate structured outputs for these scopes:\n${parts.join('\n')}\n\nFor scopes other than "description", also include relevant mentalModels, decisionHeuristics, expressionDNA, antiPatterns, tensions, and honestLimits as foundational analysis.`;
}

/**
 * Build the user prompt containing the source snapshot for distillation.
 */
export function buildDistillationUserPrompt(
  snapshot: NuwaSourceSnapshot,
  mode: 'quick' | 'deep'
): string {
  // Serialize snapshot for the prompt
  const bioSection = formatBioCore(snapshot.bioCore);
  const erasSection = snapshot.eras.length > 0
    ? `\n## Eras (${snapshot.eras.length})\n${snapshot.eras.map(formatEra).join('\n')}`
    : '';
  const abilitiesSection = snapshot.abilities.length > 0
    ? `\n## Abilities (${snapshot.abilities.length})\n${snapshot.abilities.map(formatAbility).join('\n')}`
    : '';
  const dcosSection = snapshot.dcosFiles.length > 0
    ? `\n## Narrative Documents (DCOS) (${snapshot.dcosFiles.length})\n${snapshot.dcosFiles.map(formatDcos).join('\n')}`
    : '';
  const refsSection = snapshot.references.length > 0
    ? `\n## References (${snapshot.references.length})\n${snapshot.references.map(formatReference).join('\n')}`
    : '';
  const worldsSection = snapshot.worlds.length > 0
    ? `\n## Worlds (${snapshot.worlds.length})\n${snapshot.worlds.map(formatWorld).join('\n')}`
    : '';

  return `Distill the following character data into a structured framework.

${bioSection}
${erasSection}
${abilitiesSection}
${dcosSection}
${refsSection}
${worldsSection}

---
Mode: ${mode}. Analyze the above data and produce the DistilledFramework JSON.`;
}

// ==================== Snapshot Formatters ====================

function formatBioCore(bio: NonNullable<NuwaSourceSnapshot['bioCore']>): string {
  return `## Character Core
- **Title**: ${bio.title}
- **Tagline**: bio.tagline ?? 'None'
- **Summary**: bio.summary ?? 'None'
- **Description**: ${bio.description?.slice(0, 2000) ?? 'None'}
- **Identity Mode**: bio.identityMode
- **Current Era**: bio.currentEra ?? 'Unknown'
- **Species**: bio.species ?? 'Unspecified'`;
}

function formatEra(era: NuwaSourceSnapshot['eras'][number]): string {
  return `- **${era.name}** (${era.eraType}, ${era.startYear ?? '?'}-${era.endYear ?? '?'}): ${era.description?.slice(0, 300) ?? 'No description'}`;
}

function formatAbility(ab: NuwaSourceSnapshot['abilities'][number]): string {
  return `- **${ab.name}** (${ab.category}, Lvl ${ab.level}): ${ab.description?.slice(0, 200) ?? 'No description'}`;
}

function formatDcos(doc: NuwaSourceSnapshot['dcosFiles'][number]): string {
  return `### ${doc.title} [${doc.status}]
Path: ${doc.folderPath}
${doc.content.slice(0, 1500)}${doc.content.length > 1500 ? '...[truncated]' : ''}`;
}

function formatReference(ref: NuwaSourceSnapshot['references'][number]): string {
  return `- **${ref.title}** (${ref.sourceType}): ${ref.url}${ref.description ? ` — ${ref.description.slice(0, 150)}` : ''}`;
}

function formatWorld(world: NuwaSourceSnapshot['worlds'][number]): string {
  return `### ${world.name}
Summary: ${world.summary?.slice(0, 300) ?? 'None'}
Time: ${world.timeSetting ?? '?'} | Geography: ${world.geography ?? '?'}
Social: ${world.socialStructure ?? '?'} | Conflict: ${world.majorConflict ?? '?'}
Rules: ${world.rules?.slice(0, 300) ?? 'None'}
${world.documents.length > 0 ? `Documents: ${world.documents.map(d => d.title).join(', ')}` : ''}`;
}
