# Nuwa Integration — Technical Reference

> **Status**: Phase 1 ✅ | Phase 2 ✅ | Phase 3 🔄 (worlds/references mapped, web enrichment pending) | Phase 4 🔲
> **Last Updated**: 2026-05-07
> **Audit baseline**: `prisma/schema.prisma`, `src/lib/nuwa/*`, `src/app/api/**/nuwa/**`, `src/app/dashboard/oasisbios/[id]/nuwa/page.tsx`

## Overview

The Nuwa Integration adds AI-powered character deepening to OasisBio. It uses the **Nuwa (女娲) cognitive framework distillation methodology** to analyze existing character data and generate structured, reviewable suggestions for enriching character profiles.

### Architecture

```
┌──────────────────────┐     ┌──────────────────────────────┐     ┌─────────────────┐     ┌──────────────┐
│   Frontend Workspace │────▶│  Create Run API               │────▶│  Orchestrator   │────▶│  LLM Client  │
│  /dashboard/.../nuwa  │     │  POST /api/oasisbios/[id]/    │     │  (pipeline)     │     │  (OpenAI-    │
│  page.tsx (685 lines)│     │       nuwa/runs               │     │  orchestrator.ts│     │   compatible) │
└──────────────────────┘     └──────────────────────────────┘     └─────────────────┘     └──────────────┘
                                    │                                      │
              ┌─────────────────────┼──────────────────────────────────────┼────────────────────┐
              ▼                     ▼                                      ▼                    ▼
     ┌─────────────────┐  ┌──────────────────┐                 ┌─────────────────┐   ┌─────────────────┐
     │  List Runs API   │  │  Get Detail API  │                 │ Source Snapshot  │   │   Prisma DB     │
     │  GET ...runs     │  │  GET runs/[id]   │                 │ source-snapshot  │   │  NuwaRun +      │
     │                  │  │  apply / reject  │                 │ .ts              │   │  NuwaSuggestion │
     └─────────────────┘  └──────────────────┘                 └─────────────────┘   └─────────────────┘
```

### Request Lifecycle

```
User clicks "Run Distillation"
  → POST /api/oasisbios/[id]/nuwa/runs  (create run + fire-and-forget)
  → GET  /api/nuwa/runs/[runId]         (poll every 3s until completed)
  → User reviews suggestion cards
  → POST /api/nuwa/runs/[runId]/apply    (apply selected items)
   or POST /api/nuwa/runs/[runId]/reject  (discard unwanted items)
```

---

## Data Model

All types are defined in `src/lib/nuwa/types.ts` (319 lines). The database schema lives in `prisma/schema.prisma` (lines 448–500).

### `NuwaRun` (Task Record)

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `id` | String @cuid | auto | Primary key |
| `oasisBioId` | String (FK) | required | Associated OasisBio character |
| `userId` | String (FK) | required | Owner user |
| `mode` | String | `"quick"` | Analysis depth: `quick` or `deep` |
| `sourcePolicy` | String | `"local_only"` | Data source: `local_only` or `local_plus_web` |
| `scopes` | String[] | required | Target scope array (serialized JSON) |
| `snapshotHash` | String? | null | SHA-256 of normalized snapshot (cache key) |
| `promptVersion` | String? | null | Prompt template version for cache invalidation |
| `provider` | String? | null | LLM provider used (e.g., `openai`, `azure`) |
| `model` | String? | null | LLM model identifier (e.g., `gpt-4o`) |
| `status` | String | `"queued"` | State machine — see below |
| `summary` | Json? | null | Count summary by category (`NuwaRunSummary`) |
| `distilled` | Json? | null | Raw LLM output (`DistilledFramework`) |
| `error` | Json? | null | `{ message, stack? }` if failed |
| `startedAt` | DateTime? | null | When processing began |
| `completedAt` | DateTime? | null | When completed/failed/canceled |
| `createdAt` | DateTime | `now()` | Record creation time |
| `updatedAt` | DateTime | auto | Last update time |

**Status transitions:**

```
queued → processing → completed
                  ↘ failed (LLM error / parse error / timeout)
                  ↘ canceled (user-initiated, not yet wired to UI)
```

> **Note**: The type `NuwaRunStatus` includes `'completed_with_warnings'`, but this status is never set by the current orchestrator code. The apply route accepts it as a valid state for applying suggestions.

**Indexes:** `[oasisBioId, createdAt]`, `[userId, status]`, `[snapshotHash]`

### `NuwaSuggestion` (Reviewable Suggestion)

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `id` | String @cuid | auto | Primary key |
| `runId` | String (FK) | required | Parent `NuwaRun` |
| `scope` | String | required | Entity type: `description` \| `ability` \| `era` \| `world` \| `reference` \| `dcos` |
| `operation` | String | required | Action: `append` \| `create` \| `update` \| `replace` |
| `targetId` | String? | null | ID of existing entity (for update/replace operations) |
| `title` | String? | null | Human-readable display title |
| `payload` | Json | required | Structured data for the operation (varies by scope) |
| `rationale` | String? | null | Why this suggestion was made |
| `confidence` | Float? | null | Confidence level 0.0–1.0 from LLM |
| `evidence` | Json? | null | Array of `Evidence` source citations |
| `baseFingerprint` | String? | null | Fingerprint of target entity at generation time (reserved for optimistic concurrency) |
| `decision` | String | `"pending"` | Review state: `pending` → `accepted` / `rejected` / `applied` |
| `createdEntityId` | String? | null | ID of entity created after applying |
| `appliedAt` | DateTime? | null | Timestamp when applied |
| `createdAt` | DateTime | `now()` | Record creation time |
| `updatedAt` | DateTime | auto | Last update time |

**Indexes:** `[runId, scope]`, `[decision]`

### TypeScript Type Summary (`types.ts`)

| Type | Kind | Description |
|------|------|-------------|
| `Evidence` | interface | Source citation with kind, label, snippet, confidence |
| `MentalModel` | interface | Cognitive lens: name, oneLiner, application, limitation, evidence |
| `DecisionHeuristic` | interface | "If X then Y" rule with scenario and example |
| `ExpressionDNA` | interface | Communication style: sentenceStyle, vocabulary, rhythm, humor, certainty, citationHabit |
| `AbilityDraft` | interface | Suggested ability with category (9 options), level (1–5), evidence |
| `EraDraft` | interface | Suggested era with eraType (5 options), year range, description |
| `WorldDraft` | interface | Suggested world with ~10 optional fields + evidence |
| `ReferenceDraft` | interface | Suggested reference with URL, sourceType, whyRelevant |
| `DistilledFramework` | interface | **Canonical LLM output schema** — all above arrays + descriptionPatch, antiPatterns, tensions, honestLimits |
| `NuwaSourceSnapshot` | interface | Normalized OasisBio input data (bioCore + 6 entity arrays) |
| `IncludeOptions` | interface | Scope filter: which entity IDs / categories to include |
| `CreateNuwaRunInput` | interface | API request body for creating a run |
| `ApplyNuwaSuggestionsInput` | interface | API request body for applying (itemIds, descriptionMode, worldTarget) |
| `RejectNuwaSuggestionsInput` | interface | API request body for rejecting (itemIds, reason?) |
| `NuwaSuggestionItem` | interface | API response item shape (extends DB record with typed fields) |
| `NuwaRunResponse` | interface | API response for run detail endpoint |
| `CreateNuwaRunResponse` | interface | API response for create run endpoint |

**Enum-like types:**
- `NuwaScope`: `'description' | 'abilities' | 'worlds' | 'references' | 'eras' | 'dcos'`
- `NuwaRunMode`: `'quick' | 'deep'`
- `NuwaSourcePolicy`: `'local_only' | 'local_plus_web'`
- `NuwaRunStatus`: `'queued' | 'processing' | 'completed' | 'completed_with_warnings' | 'failed' | 'canceled'`
- `NuwaSuggestionDecision`: `'pending' | 'accepted' | 'rejected' | 'applied'`
- `NuwaSuggestionOperation`: `'append' | 'create' | 'update' | 'replace'`
- `NuwaSuggestionScope`: `'description' | 'ability' | 'world' | 'reference' | 'era' | 'dcos'`
- `AbilityCategory`: 9 values from `'technology'` to `'survival'`
- `EraType`: `'past' | 'present' | 'future' | 'alternate' | 'worldbound'`
- `EvidenceSourceKind`: 8 values including `'web'` and `'world_document'`

---

## API Endpoints

All endpoints require authentication (`requireAuth()`). All mutation endpoints verify ownership (the authenticated user must own the parent OasisBio).

### Create Run

```
POST /api/oasisbios/[id]/nuwa/runs
```

**Request body** (validated with Zod):

```typescript
{
  mode?: 'quick' | 'deep',           // default: 'quick'
  sourcePolicy?: 'local_only' | 'local_plus_web',  // default: 'local_only'
  scopes: ('description' | 'abilities' | 'worlds' | 'references' | 'eras' | 'dcos')[],  // required, min 1
  include?: {                         // default: {}
    bioCore?: boolean,                // default: true
    eraIds?: string[],                // default: []
    abilityIds?: string[],            // default: []
    dcosIds?: string[],               // default: []
    referenceIds?: string[],          // default: []
    worldIds?: string[],              // default: []
    includeWorldDocuments?: boolean   // default: true
  },
  notes?: string,                     // max 2000 chars, stored for future use
  forceRefresh?: boolean              // default: false
}
```

**Response** (`201` or `200` on cache hit):

```typescript
{
  runId: string,       // cuid of created/found run
  status: 'queued' | 'completed',
  snapshotHash: string,
  cacheHit: boolean    // true if identical cached run was returned
}
```

**Behavior:**
1. Validates ownership and parses body with Zod (`CreateNuwaRunSchema`)
2. Builds full source snapshot from OasisBio data
3. Computes SHA-256 hash of normalized snapshot
4. If not force-refreshed, looks up cached completed run by `(oasisBioId, snapshotHash, scopes, mode)`
5. Checks concurrent run limit (max 1 `queued`/`processing` per oasisBio) → returns `409 Conflict`
6. Creates `NuwaRun` record in `queued` status
7. Triggers async distillation via `runNuwaDistillation(runId).catch(...)` (fire-and-forget)

**Error responses:**

| Code | Condition |
|------|-----------|
| `404 NOT_FOUND` | OasisBio does not exist |
| `403 FORBIDDEN` | User does not own the OasisBio |
| `400 INVALID_INPUT` | Zod validation failure |
| `409 ALREADY_RUNNING` | Another run is already in progress |

### List Runs

```
GET /api/oasisbios/[id]/nuwa/runs
```

**Response:**

```typescript
{
  runs: [{
    runId: string,
    status: string,
    mode: string,
    sourcePolicy: string,
    scopes: string[],
    snapshotHash?: string,
    startedAt?: string,        // ISO 8601
    completedAt?: string,      // ISO 8601
    createdAt: string,         // ISO 8601
    suggestionCount: number    // count of NuwaSuggestion records
  }]
}
```

Runs are ordered by `createdAt DESC`.

### Get Run Detail with Suggestions

```
GET /api/nuwa/runs/[runId]
```

**Response:**

```typescript
{
  runId: string,
  status: NuwaRunStatus,
  mode: NuwaRunMode,
  sourcePolicy: NuwaSourcePolicy,
  scopes: string[],             // raw array from DB
  summary?: {                   // populated when status is 'completed'
    mentalModels: number,
    decisionHeuristics: number,
    abilities: number,
    eras: number,
    worlds: number,
    references: number
  } | undefined,
  distilled?: object | undefined,
  startedAt?: string,           // ISO 8601 or undefined
  completedAt?: string,         // ISO 8601 or undefined
  createdAt: string,            // ISO 8601
  oasisBio: {
    id: string,
    title: string
  },
  items: [{                     // ordered by [scope ASC, createdAt ASC]
    id: string,
    scope: NuwaSuggestionScope,
    operation: NuwaSuggestionOperation,
    targetId?: string | null,
    title?: string | null,
    payload: object,            // raw JSON from DB
    rationale?: string | null,
    confidence?: number | null,
    evidence?: object | null,   // raw Evidence[] JSON
    decision: NuwaSuggestionDecision,
    createdEntityId?: string | null,
    appliedAt?: string | null,  // ISO 8601 or undefined
    createdAt: string           // ISO 8601
  }]
}
```

**Error responses:**

| Code | Condition |
|------|-----------|
| `404 NOT_FOUND` | Run does not exist |
| `403 FORBIDDEN` | User does not own the parent OasisBio |

### Apply Suggestions

```
POST /api/nuwa/runs/[runId]/apply
```

**Request body** (validated with Zod):

```typescript
{
  itemIds: string[],                    // required, min 1
  descriptionMode?: 'append' | 'replace' | 'manual_merge',  // default: 'append'
  worldTarget?: { kind: 'existing'; worldId: string }
               | { kind: 'new'; name: string }  // for world-scope suggestions only
}
```

**Response** (`200`):

```typescript
{
  runId: string,
  applied: Array<{ itemId: string; entityType: string; entityId: string }>,
  failedCount: number    // = itemIds.length - applied.length
}
```

**Behavior:**
1. Validates run exists, user owns it, status is `'completed'` or `'completed_with_warnings'`
2. For each item ID, calls `applySingleSuggestion()` which dispatches by scope:
   - `description` → append/replace markdown on `OasisBio.description`
   - `ability` + `create` → create new `Ability` record
   - `era` + `create` → create new `EraIdentity` record (auto-increments sortOrder)
   - `world` + `create` → create new `WorldItem` or update existing (based on `worldTarget`)
   - `reference` + `create` → create new `ReferenceItem` record
3. Updates each applied suggestion's `decision` to `'applied'`, sets `createdEntityId` and `appliedAt`
4. Items that fail silently return `null` (counted in `failedCount`)

**Error responses:**

| Code | Condition |
|------|-----------|
| `404 NOT_FOUND` | Run does not exist |
| `403 FORBIDDEN` | User does not own the parent OasisBio |
| `400 INVALID_STATE` | Run is not in a completable status |
| `400 INVALID_INPUT` | Zod validation failure |

### Reject Suggestions

```
POST /api/nuwa/runs/[runId]/reject
```

**Request body** (validated with Zod):

```typescript
{
  itemIds: string[],    // required, min 1
  reason?: string        // max 1000 chars, stored for future analytics use
}
```

**Response** (`200`):

```typescript
{
  runId: string,
  rejectedCount: number  // count of items actually updated
}
```

Only items with `decision IN ('pending', 'accepted')` are affected.

---

## Core Library Modules

All modules live under `src/lib/nuwa/`.

### `types.ts` (319 lines) — Type Contracts

Single source of truth for all TypeScript types used across the pipeline. No external dependencies. Exports ~25 interfaces/types covering:

- Evidence and analysis dimensions (MentalModel, DecisionHeuristic, ExpressionDNA, Tension, etc.)
- Draft types for each suggestible entity (AbilityDraft, EraDraft, WorldDraft, ReferenceDraft)
- The `DistilledFramework` canonical LLM output schema
- Snapshot types mirroring Prisma models but trimmed for LLM input
- API request/response types with Zod-compatible shapes
- All enum-like union types for statuses, scopes, operations

### `source-snapshot.ts` (249 lines) — Snapshot Builder

Builds a normalized, trimmable representation of an OasisBio's data for LLM consumption.

**Key exports:**

| Function | Signature | Description |
|----------|-----------|-------------|
| `buildNuwaSourceSnapshot(oasisBioId, include?)` | → `Promise<NuwaSourceSnapshot>` | Fetches bio + all related entities, maps to snapshot shape |
| `computeSnapshotHash(snapshot)` | → `Promise<string>` | SHA-256 hash of sorted-key JSON serialization |
| `trimSnapshotForQuickMode(snapshot, maxChars?)` | → `NuwaSourceSnapshot` | Greedy trim to `MAX_TOTAL_CHARS=50000` |

**Constants:**
- `MAX_DOC_LENGTH = 5000` — max chars per DCOS document before truncation
- `MAX_TOTAL_CHARS = 50000` — max total chars for quick mode

**Behavior details:**
- Always fetches `bioCore` (title, tagline, summary, description, identityMode, currentEra, species)
- Filters entities by IDs when `include.{eraIds,abilityIds,...}` is provided; returns all if empty/unset
- World documents (`WorldDocumentSnapshot`) are included when `includeWorldDocuments !== false`
- Long DCOS documents are clipped with `...[truncated]` suffix
- Quick mode trims fields greedily: bioCore first (description > summary > tagline), then eras, abilities, dcos, references, worlds

### `llm.ts` (377 lines) — LLM Client

OpenAI-compatible abstraction layer for calling LLM APIs.

**Key exports:**

| Function | Signature | Description |
|----------|-----------|-------------|
| `getDefaultLlmConfig()` | → `LlmConfig` | Reads env vars, throws if no API key configured |
| `callLlm<T>(messages, config, options?)` | → `Promise<LlmResponse<T>>` | Main entry point with retry logic |
| `buildDistillationSystemPrompt(scopes, mode)` | → `string` | Full system prompt encoding Nuwa methodology |
| `buildDistillationUserPrompt(snapshot, mode)` | → `string` | Serializes snapshot into user message |

**Configuration** (env vars):

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NUWA_LLM_API_KEY` | Yes* | — | Falls back to `OPENAI_API_KEY` |
| `NUWA_LLM_BASE_URL` | No | `https://api.openai.com/v1` | Any OpenAI-compatible endpoint |
| `NUWA_LLM_MODEL` | No | `gpt-4o` | Model identifier |
| `NUWA_LLM_MAX_TOKENS` | No | `4096` | Max tokens in LLM response |
| `NUWA_LLM_TEMPERATURE` | No | `0.7` | Sampling temperature |

**Retry behavior:**
- Max 3 attempts with exponential backoff (base 1s × 2^attempt + jitter ≤ 500ms)
- Non-retryable errors (401/403/400) thrown immediately
- Response format: strips markdown code fences before `JSON.parse()`

**Snapshot formatters** (private functions called by `buildDistillationUserPrompt`):
- `formatBioCore(bio)` → Character core section with 7 fields (tagline, summary, description, identityMode, currentEra, species)
- `formatEra(era)` → One-line: "**Name** (type, start–end): description"
- `formatAbility(ab)` → One-line: "**Name** (category, Lvl N): description"
- `formatDcos(doc)` → "### Title [status]" + content truncated to 1500 chars
- `formatReference(ref)` → One-line: "**Title** (type): url — description"
- `formatWorld(world)` → Multi-line: summary, time, geography, social, conflict, rules, documents list

### `orchestrator.ts` (365 lines) — Pipeline Coordinator

Orchestrates the full distillation lifecycle.

**Key exports:**

| Function | Signature | Description |
|----------|-----------|-------------|
| `runNuwaDistillation(runId)` | → `Promise<void>` | **Main entry point.** Loads run, builds snapshot, calls LLM, saves results |
| `findCachedRun(oasisBioId, snapshotHash, scopes, mode, promptVersion?)` | → `Promise<string \| null>` | Looks up completed run with matching fingerprint |

**Pipeline stages inside `runNuwaDistillation()`:**

1. Load `NuwaRun` with `oasisBio` relation
2. Update status → `'processing'`, set `startedAt`
3. Parse `scopes` JSON → build `IncludeOptions` → call `buildNuwaSourceSnapshot()`
4. Compute `snapshotHash` → persist to run record
5. Call `executeDistillation()` → get validated `DistilledFramework`
6. Call `mapFrameworkToSuggestions(framework, snapshot)` → get suggestion records
7. Transactional write: update run status → `'completed'` + save all `NuwaSuggestion` records with `decision='pending'`
8. On error: update status → `'failed'`, save `{message, stack}` to `error` field, re-throw

**`executeDistillation()` internals:**
1. If `mode === 'quick'`, call `trimSnapshotForQuickMode(snapshot)`
2. Get LLM config via `getDefaultLlmConfig()`
3. Build system prompt (scope-aware) + user prompt (snapshot serialized)
4. Call `callLlm<DistilledFramework>()` with `responseFormat: 'json'`
5. Validate parsed response exists; throw if not
6. Apply defensive defaults for all 11 top-level DistilledFramework fields (handles partial LLM outputs)

**`mapFrameworkToSuggestions()` coverage:**

| Framework field | Scope | Operation | Confidence | Mapped? |
|-----------------|-------|-----------|------------|---------|
| `descriptionPatch` | `description` | `update` | 0.8 | ✅ |
| `abilities[]` | `ability` | `create` | 0.7 | ✅ |
| `eras[]` | `era` | `create` | 0.7 | ✅ |
| `worlds[]` | `world` | `create` | 0.6 | ✅ |
| `references[]` | `reference` | `create` | 0.5 | ✅ |

> **Note:** `dcos` scope has no dedicated mapping — DCOS analysis outputs are embedded within `mentalModels[].evidence`, `decisionHeuristics[].evidence`, `tensions[].evidence` as source citations rather than independent suggestions. This is by design.

**`buildSummary()` output shape:** `{ mentalModels, decisionHeuristics, abilities, eras, worlds, references }` — counts only (no dcos dimension).

### `apply.ts` (313 lines) — Suggestion Applier

Maps accepted suggestions to actual Prisma mutations.

**Key exports:**

| Function | Signature | Description |
|----------|-----------|-------------|
| `applyNuwaSuggestions(runId, input)` | → `Promise<ApplyResult[]>` | Apply multiple suggestions, returns per-item results |
| `rejectNuwaSuggestions(runId, itemIds)` | → `Promise<number>` | Bulk-reject by setting `decision='rejected'` |
| `mergeDescription(existing, newContent)` | → `string` | Pure function: joins with `\n\n---\n\n` separator |

**Apply dispatch table** (`applySingleSuggestion()`):

| Scope + Operation | Database action | Notes |
|--------------------|-----------------|-------|
| `description` | `oasisBio.update({ description })` | Mode: `append` (default), `replace`, or `manual_merge` (treated as append) |
| `ability` + `create` | `ability.create({...})` | Maps `category`, `level`, `description`; sets `relatedEraId`/`relatedWorldId` from payload if present |
| `era` + `create` | `eraIdentity.create({...})` | Auto-calculates `sortOrder = max(sortOrder) + 1` |
| `world` + `create` | `worldItem.create(...)` **or** `worldItem.update(...)` | If `worldTarget.kind === 'existing'`, updates named fields on existing world; otherwise creates new with `visibility: 'private'`. Maps `genre` → `aestheticKeywords` |
| `reference` + `create` | `referenceItem.create({...})` | Sets `sourceType` defaulting to `'website'`; maps `eraId`/`worldId` from payload if present |

**Error handling per item:** Each suggestion is wrapped in try/catch. Failed items return `null` and are counted in `failedCount`. The overall batch does not abort on individual failures.

---

## Frontend Workspace

### Route: `/dashboard/oasisbios/[id]/nuwa`

**File:** `src/app/dashboard/oasisbios/[id]/nuwa/page.tsx` (685 lines)

A single-page workspace UI with three visual regions:

### 1. New Run Form

- **Scope selector**: 6 pill buttons (Description, Abilities, Eras, Worlds, References, DCOS Analysis). Multi-select, defaults to `['description']`.
- **Mode toggle**: quick / deep segmented control
- **Force refresh checkbox**: bypasses cache when checked
- **Start button**: gradient-styled (purple→pink), disabled while running or no scopes selected

### 2. Runs History Panel (left column, 1/3 width)

- Chronological list of past runs (fetched from `GET /api/oasisbios/[id]/nuwa/runs`)
- Each card shows: status badge (color-coded), mode, comma-separated scopes, timestamp, suggestion count
- Clicking a run loads its detail in the right panel
- Active run highlighted with purple border

### 3. Detail Panel (right column, 2/3 width)

**States:**
- **Empty**: Icon + "No Run Selected" placeholder
- **Processing** (status `queued` or `processing`): Spinner + "Distilling Character Framework..." message + auto-polling every **3 seconds**
- **Failed**: Red-bordered card with error guidance
- **Completed**: Full suggestion list with:
  - **Summary bar**: status badge, mode, category counts from `summary` object
  - **Bulk actions**: "Accept All" / "Reject All" buttons (shown when any pending items exist)
  - **Suggestion cards** (one per item):
    - Scope badge (color-coded per scope), operation badge, confidence percentage, decision badge
    - Title + rationale (2-line clamp)
    - Expandable payload (pretty-printed JSON) + evidence panel (up to 3 citations, 120-char snippets)
    - Accept (✓ green) / Reject (✗ red) buttons per item — only shown when `decision === 'pending'`

### Sub Navigation

Tabs: Identity → Eras → Abilities → Worlds → DCOS → References → **Nuwa** (active tab highlighted with purple→pink gradient)

### Polling Logic

- `fetchRunDetail(runId)` polls at 3s interval when status is `queued` or `processing`
- Polling ref is cleaned up on component unmount
- Selecting a different run cancels current polling and starts fresh

---

## Error Handling Strategy

| Scenario | Where | Handling |
|----------|-------|----------|
| Missing API key | `llm.ts:getDefaultLlmConfig()` | Throws `Error('NUWA_LLM_API_KEY or OPENAI_API_KEY environment variable is required...')` at call time |
| LLM API errors (429/5xx) | `llm.ts:callLlm()` | Retry up to 3x with exponential backoff + jitter; non-retryable (4xx auth) thrown immediately |
| Invalid JSON from LLM | `llm.ts:executeCall()` | Warns to console, returns raw text in `content`, `parsed` remains `undefined` |
| Null parsed response | `orchestrator.ts:executeDistillation()` | Throws `Error('Failed to parse LLM response as DistilledFramework JSON')` |
| Any pipeline error | `orchestrator.ts:runNuwaDistillation()` | Catches → sets run status to `'failed'`, persists `{message, stack}` in `error` JSON, re-throws |
| Concurrent runs | `POST ...runs/route.ts` | Counts active `queued`+`processing` runs → HTTP `409 Conflict` with `ALREADY_RUNNING` code |
| Invalid request body | All POST routes | Zod `.safeParse()` → HTTP `400` with `INVALID_INPUT` code and validation message |
| Ownership mismatch | All routes | Check `oasisBio.userId !== user.id` → HTTP `403 FORBIDDEN` |
| Run not found | GET/apply/reject routes | HTTP `404 NOT_FOUND` |
| Invalid run state for apply | `apply/route.ts` | Checks `status IN ('completed', 'completed_with_warnings')` → HTTP `400 INVALID_STATE` |
| Individual apply failure | `apply.ts:applySingleSuggestion()` | Caught per-item, returns `null`, counted in `failedCount` |
| Token overflow | `source-snapshot.ts` | Quick mode auto-trims to 50K chars; deep mode has no hard limit (may overflow for very large bios) |

---

## Caching Strategy

- **Cache key components:** `snapshotHash` (SHA-256 of sorted-key JSON) + `scopes` array + `mode` + optional `promptVersion`
- **Lookup:** `findCachedRun()` queries for a `completed` run matching all 4 components, ordered by `createdAt DESC`
- **Cache hit:** Returns existing run's `id` immediately with `cacheHit: true`, no LLM call
- **Cache bypass:** `forceRefresh: true` skips lookup entirely
- **Invalidation:** Implicit — any change to underlying OasisBio data (new ability, edited description, etc.) changes the snapshot hash, causing a cache miss on next run
- **`scopes` storage note:** The `scopes` field in `NuwaRun` stores the serialized `IncludeOptions` object (not just the scope string array). This is used as part of the cache lookup key via Prisma's `{ equals: scopes }` filter.

---

## Future Roadmap

### Phase 3: Extended Scopes 🔄 In Progress

- [x] Map `worlds` framework field → `world`-scope suggestions (confidence 0.6)
- [x] Map `references` framework field → `reference`-scope suggestions (confidence 0.5)
- [ ] Web enrichment: when `sourcePolicy = 'local_plus_web'`, augment snapshot with external search results (books, articles, media relevant to character themes)
- [ ] DCOS report archiving: post-distillation narrative document summarizing the cognitive framework review

### Phase 4: Production Hardening 🔲 Not Started

- [ ] **Background worker**: Replace fire-and-forget `.catch(() => {})` with Vercel Cron/Queues or Edge Functions
- [ ] **Audit logging**: Write to `audit_logs` table on every apply/reject action
- [ ] **Domain events**: Emit `nuwa.completed` / `nuwa.applied` events for cross-system triggers (OG image regeneration, search index updates)
- [ ] **Rate limiting**: Per-user throttle to prevent token abuse (e.g., 5 runs/hour, 20 runs/day)
- [ ] **Content safety**: Filter LLM outputs for inappropriate content before generating suggestions
- [ ] **Optimistic concurrency**: Use `baseFingerprint` field to detect stale applies (schema reserved, logic not implemented)
- [ ] **`completed_with_warnings` status**: Wire up for partial-success scenarios (e.g., some scopes succeeded, others had low-confidence output)

---

## Testing

### Current Coverage

| Area | Files | Status |
|------|-------|--------|
| OAuth Provider (unrelated) | 16 test files | ✅ Passing |
| Tooltip component (unrelated) | 1 test file (22 cases) | ✅ Passing |
| **Nuwa Integration** | **0 test files** | ❌ **None** |

### Needed Tests

- [ ] **Unit: `source-snapshot.ts`** — Hash determinism (same input → same hash), trimming logic (quick mode char limits), filterByIds behavior, clipLongDocs edge cases
- [ ] **Unit: `llm.ts`** — Prompt builder output format, retry/backoff behavior, JSON parsing with code fence stripping, formatBioCore interpolation correctness
- [ ] **Unit: `orchestrator.ts`** — `mapFrameworkToSuggestions()` coverage for all 5 scopes, `buildSummary()` shape, `findCachedRun()`, defensive defaults in `executeDistillation()`
- [ ] **Unit: `apply.ts`** — Each scope dispatcher (description append/replace, ability create, era sort order, world create vs update, reference create), `rejectNuwaSuggestions()` count accuracy, `mergeDescription()` pure function
- [ ] **Integration: API routes** — Full request/response cycles for all 5 endpoints with mocked LLM, ownership checks, concurrent run rejection, cache hit path, apply with mixed valid/invalid item IDs
- [ ] **Property-based: LLM response parsing** — Generate random partial/ malformed `DistilledFramework`-shaped objects, verify defensive defaults produce valid output without crashing
