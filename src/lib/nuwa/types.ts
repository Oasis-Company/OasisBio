/**
 * Nuwa Integration - Type Definitions
 *
 * Based on the DistilledFramework contract from the Nuwa methodology.
 * These types serve as the intermediate layer between Nuwa output and OasisBio data models.
 */

// ==================== Evidence ====================

export type EvidenceSourceKind = 'bio' | 'era' | 'ability' | 'dcos' | 'reference' | 'world' | 'world_document' | 'web';

export interface Evidence {
  kind: EvidenceSourceKind;
  sourceId?: string;
  label: string;
  snippet: string;
  confidence: 'high' | 'medium' | 'low';
  url?: string;
}

// ==================== Mental Models ====================

export interface MentalModel {
  name: string;
  oneLiner: string;
  application: string;
  limitation: string;
  evidence: Evidence[];
}

// ==================== Decision Heuristics ====================

export interface DecisionHeuristic {
  name: string;
  rule: string;
  scenario: string;
  example: string;
  evidence: Evidence[];
}

// ==================== Expression DNA ====================

export interface ExpressionDNA {
  sentenceStyle: string;
  vocabulary: string[];
  rhythm: string;
  humor: string;
  certaintyStyle: string;
  citationHabit: string;
}

// ==================== Ability Draft ====================

export type AbilityCategory =
  | 'technology'
  | 'social-skills'
  | 'worldbuilding-skills'
  | 'combat'
  | 'magic'
  | 'stealth'
  | 'leadership'
  | 'knowledge'
  | 'crafting'
  | 'survival';

export interface AbilityDraft {
  name: string;
  category: AbilityCategory;
  level: 1 | 2 | 3 | 4 | 5;
  description: string;
  relatedEraHint?: string;
  relatedWorldHint?: string;
  evidence: Evidence[];
}

// ==================== Era Draft ====================

export type EraType = 'past' | 'present' | 'future' | 'alternate' | 'worldbound';

export interface EraDraft {
  name: string;
  eraType: EraType;
  startYear?: number;
  endYear?: number;
  description: string;
  evidence: Evidence[];
}

// ==================== World Draft ====================

export interface WorldDraft {
  name: string;
  summary: string;
  timeSetting?: string;
  socialStructure?: string;
  rules?: string;
  timeline?: string;
  majorConflict?: string;
  genre?: string;
  tone?: string;
  evidence: Evidence[];
}

// ==================== Reference Draft ====================

export interface ReferenceDraft {
  url: string;
  title: string;
  description?: string;
  sourceType: string;
  provider?: string;
  tags: string;
  whyRelevant: string;
  evidence: Evidence[];
}

// ==================== Distilled Framework ====================

export interface Tension {
  left: string;
  right: string;
  explanation: string;
  evidence: Evidence[];
}

export interface DescriptionPatch {
  title: string;
  markdown: string;
  mode: 'append' | 'replace';
}

export interface DistilledFramework {
  mentalModels: MentalModel[];
  decisionHeuristics: DecisionHeuristic[];
  expressionDNA: ExpressionDNA;
  antiPatterns: string[];
  tensions: Tension[];
  honestLimits: string[];
  abilities: AbilityDraft[];
  eras: EraDraft[];
  worlds: WorldDraft[];
  references: ReferenceDraft[];
  descriptionPatch: DescriptionPatch;
}

// ==================== Source Snapshot ====================

export interface BioCoreSnapshot {
  id: string;
  title: string;
  tagline?: string | null;
  summary?: string | null;
  description?: string | null;
  identityMode: string;
  currentEra?: string | null;
  species?: string | null;
}

export interface EraSnapshot {
  id: string;
  name: string;
  eraType: string;
  startYear?: number | null;
  endYear?: number | null;
  description?: string | null;
  sortOrder: number;
}

export interface AbilitySnapshot {
  id: string;
  name: string;
  category: string;
  level: number;
  description?: string | null;
  relatedWorldId?: string | null;
  relatedEraId?: string | null;
}

export interface DcosFileSnapshot {
  id: string;
  title: string;
  content: string;
  folderPath: string;
  status: string;
  eraId?: string | null;
}

export interface ReferenceSnapshot {
  id: string;
  url: string;
  title: string;
  description?: string | null;
  sourceType: string;
  provider?: string | null;
  tags: string;
  eraId?: string | null;
  worldId?: string | null;
}

export interface WorldDocumentSnapshot {
  id: string;
  title: string;
  docType: string;
  content: string;
  folderPath: string;
}

export interface WorldSnapshot {
  id: string;
  name: string;
  summary: string;
  timeSetting?: string | null;
  geography?: string | null;
  physicsRules?: string | null;
  socialStructure?: string | null;
  majorConflict?: string | null;
  timeline?: string | null;
  rules?: string | null;
  factions?: string | null;
  documents: WorldDocumentSnapshot[];
}

export interface NuwaSourceSnapshot {
  bioCore: BioCoreSnapshot;
  eras: EraSnapshot[];
  abilities: AbilitySnapshot[];
  dcosFiles: DcosFileSnapshot[];
  references: ReferenceSnapshot[];
  worlds: WorldSnapshot[];
}

// ==================== Include Options ====================

export interface IncludeOptions {
  bioCore?: boolean;
  eraIds?: string[];
  abilityIds?: string[];
  dcosIds?: string[];
  referenceIds?: string[];
  worldIds?: string[];
  includeWorldDocuments?: boolean;
}

// ==================== Nuwa Run Scopes ====================

export type NuwaScope = 'description' | 'abilities' | 'worlds' | 'references' | 'eras' | 'dcos';
export type NuwaRunMode = 'quick' | 'deep';
export type NuwaSourcePolicy = 'local_only' | 'local_plus_web';
export type NuwaRunStatus = 'queued' | 'processing' | 'completed' | 'completed_with_warnings' | 'failed' | 'canceled';
export type NuwaSuggestionDecision = 'pending' | 'accepted' | 'rejected' | 'applied';
export type NuwaSuggestionOperation = 'append' | 'create' | 'update' | 'replace';
export type NuwaSuggestionScope = 'description' | 'ability' | 'world' | 'reference' | 'era' | 'dcos';

// ==================== API Input Types ====================

export interface CreateNuwaRunInput {
  mode?: NuwaRunMode;
  sourcePolicy?: NuwaSourcePolicy;
  scopes: NuwaScope[];
  include?: IncludeOptions;
  notes?: string;
  forceRefresh?: boolean;
}

export interface ApplyNuwaSuggestionsInput {
  itemIds: string[];
  descriptionMode?: 'append' | 'replace' | 'manual_merge';
  worldTarget?:
    | { kind: 'existing'; worldId: string }
    | { kind: 'new'; name: string };
}

export interface RejectNuwaSuggestionsInput {
  itemIds: string[];
  reason?: string;
}

// ==================== API Response Types ====================

export interface NuwaRunSummary {
  mentalModels: number;
  decisionHeuristics: number;
  abilities: number;
  eras: number;
  worlds: number;
  references: number;
}

export interface NuwaSuggestionItem {
  id: string;
  scope: NuwaSuggestionScope;
  operation: NuwaSuggestionOperation;
  targetId?: string;
  title?: string;
  payload: Record<string, unknown>;
  rationale?: string;
  confidence?: number;
  evidence?: Evidence[];
  decision: NuwaSuggestionDecision;
  createdEntityId?: string;
  appliedAt?: string;
}

export interface NuwaRunResponse {
  runId: string;
  status: NuwaRunStatus;
  mode: NuwaRunMode;
  sourcePolicy: NuwaSourcePolicy;
  summary?: NuwaRunSummary;
  items: NuwaSuggestionItem[];
}

export interface CreateNuwaRunResponse {
  runId: string;
  status: NuwaRunStatus;
  snapshotHash?: string;
  cacheHit: boolean;
}
