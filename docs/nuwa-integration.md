# Nuwa Integration — Technical Reference

> **Status**: Phase 1 ✅ | Phase 2 ✅ | Phase 3 🔲 | Phase 4 🔲
> **Last Updated**: 2026-05-07

## Overview

The Nuwa Integration adds AI-powered character deepening to OasisBio. It uses the **Nuwa (女娲) cognitive framework distillation methodology** to analyze existing character data and generate structured suggestions for enriching character profiles.

### Architecture

```
┌──────────────┐    ┌──────────────────┐    ┌─────────────────┐    ┌──────────────┐
│   Frontend    │───▶│  API Routes     │───▶│  Orchestrator   │───▶│  LLM Client  │
│  (nuwa/page) │    │  (/api/nuwa/*)  │    │  (pipeline)     │    │  (OpenAI)    │
└──────────────┘    └──────────────────┘    └─────────────────┘    └──────────────┘
                           │                        │
                           ▼                        ▼
                    ┌──────────────┐         ┌─────────────────┐
                    │  Prisma DB   │         │ Source Snapshot │
                    │  (runs/items)│         │  (from OasisBio)│
                    └──────────────┘         └─────────────────┘
```

## Data Model

### `NuwaRun` (Task Record)
| Field | Type | Description |
|-------|------|-------------|
| `id` | String (cuid) | Primary key |
| `oasisBioId` | String (FK) | Associated character |
| `userId` | String (FK) | Owner |
| `mode` | Enum (`quick`/`deep`) | Analysis depth |
| `sourcePolicy` | Enum (`local_only`/`local_plus_web`) | Data source policy |
| `scopes` | JSON | Target scopes array |
| `snapshotHash` | String | SHA-256 of input data (cache key) |
| `status` | Enum | `queued` → `processing` → `completed` / `failed` / `canceled` |
| `distilled` | JSON | Raw LLM output (`DistilledFramework`) |
| `summary` | JSON | Count summary by category |
| `error` | JSON | Error details if failed |

### `NuwaSuggestion` (Reviewable Suggestion)
| Field | Type | Description |
|-------|------|-------------|
| `runId` | String (FK) | Parent run |
| `scope` | Enum | Target entity type (`description`, `ability`, `era`, `world`, `reference`, `dcos`) |
| `operation` | Enum | Action to perform (`create`, `append`, `update`, `replace`) |
| `payload` | JSON | Structured data for the operation |
| `title` | String | Human-readable title |
| `rationale` | Text | Why this suggestion was made |
| `confidence` | Float (0-1) | Confidence level from LLM |
| `evidence` | JSON | Source evidence citations |
| `decision` | Enum | `pending` → `accepted` / `rejected` / `applied` |

## API Endpoints

### Create Run
```
POST /api/oasisbios/[id]/nuwa/runs
Body: { mode?, scopes: string[], include?, forceRefresh? }
Response: { runId, status, snapshotHash, cacheHit }
```
- Validates ownership and concurrent run limits
- Checks cache by snapshot hash + scopes + mode
- Triggers async distillation (fire-and-forget)

### List Runs
```
GET /api/oasisbios/[id]/nuwa/runs
Response: { runs: [...] }
```

### Get Run Detail with Suggestions
```
GET /api/nuwa/runs/[runId]
Response: { runId, status, mode, ..., items: [...], summary? }
```

### Apply Suggestions
```
POST /api/nuwa/runs/[runId]/apply
Body: { itemIds: string[], descriptionMode?, worldTarget? }
Response: { appliedCount, results: [...] }
```

### Reject Suggestions
```
POST /api/nuwa/runs/[runId]/reject
Body: { itemIds: string[], reason? }
Response: { rejectedCount }
```

## Core Library Modules

### `src/lib/nuwa/types.ts`
Complete TypeScript contract for the distillation pipeline:
- **Evidence types**: Source citations with confidence levels
- **DistilledFramework**: The canonical output schema from LLM (mental models, decision heuristics, expression DNA, etc.)
- **SourceSnapshot**: Normalized OasisBio data for LLM input
- **API I/O types**: Request/response schemas for all endpoints

### `src/lib/nuwa/source-snapshot.ts`
Builds a structured snapshot of an OasisBio's data:
- Fetches all related entities (eras, abilities, DCOS, references, worlds)
- Filters by user-selected IDs (scoped analysis)
- Clips long documents to prevent token overflow (`MAX_DOC_LENGTH = 5000`)
- Quick mode trims total characters (`MAX_TOTAL_CHARS = 50000`)
- Computes SHA-256 hash for deterministic caching

### `src/lib/nuwa/llm.ts`
OpenAI-compatible LLM client:
- Supports any OpenAI-compatible endpoint (Azure, OpenRouter, local models)
- Configurable via environment variables (`NUWA_LLM_*`)
- Structured output mode (`response_format: json_object`)
- Automatic retry with exponential backoff (max 3 retries)
- Built-in Nuwa prompt builders (system + user prompts)

**Environment Variables:**
```env
NUWA_LLM_API_KEY=sk-...           # Required
NUWA_LLM_BASE_URL=https://api.openai.com/v1  # Default: OpenAI
NUWA_LLM_MODEL=gpt-4o             # Default model
NUWA_LLM_MAX_TOKENS=4096          # Response token limit
NUWA_LLM_TEMPERATURE=0.7          # Creativity (0=deterministic)
```

### `src/lib/nuwa/orchestrator.ts`
Main pipeline coordinator:
1. Loads or creates `NuwaRun` record
2. Builds source snapshot from OasisBio data
3. Trims for quick/deep mode
4. Sends to LLM with Nuwa methodology prompts
5. Parses and validates `DistilledFramework` response
6. Maps framework fields to `NuwaSuggestion` records
7. Handles errors with proper status updates

**Key functions:**
- `runNuwaDistillation(runId)` — Main entry point
- `findCachedRun(...)` — Cache lookup by snapshot hash
- `executeDistillation(options)` — LLM call + parsing
- `mapFrameworkToSuggestions(framework, snapshot)` — Framework → suggestions mapping

### `src/lib/nuwa/apply.ts`
Suggestion applier — maps accepted suggestions to actual database mutations:
- **description**: Append or replace markdown content on OasisBio record
- **ability**: Create new Ability records with category/level/description
- **era**: Create new EraIdentity records with sort order management
- **world**: Create new WorldItem or update existing one
- **reference**: Create new ReferenceItem records

## Frontend Workspace

### Route: `/dashboard/oasisbios/[id]/nuwa`

A full workspace UI with three sections:

1. **New Run Form**: Scope checkboxes, mode toggle (quick/deep), force refresh option
2. **Runs History Sidebar**: Chronological list with status badges, click to view detail
3. **Detail Panel**: Active run view with:
   - Summary bar (status, mode, category counts)
   - Processing state with spinner and polling (3s interval)
   - Suggestion cards with expand/collapse, evidence panel
   - Per-item accept/reject buttons + bulk actions
   - Visual feedback for accepted/rejected/pending states

## Nuwa Methodology Prompts

The system prompt encodes the core Nuwa philosophy:

> You are 女娲 (Nüwa), a cognitive framework distillation engine.
>
> **You analyze character data and extract structured thinking frameworks that make characters feel real, deep, and internally consistent.**
>
> Key principles:
> - Ground EVERY claim in provided source material
> - Capture HOW they think, not WHAT they said
> - Preserve contradictions as authenticity signals
> - Prefer depth over breadth (3 profound > 10 shallow)

The prompt generates these dimensions from source data:
- **Mental Models** (3-7): Cognitive lenses with applications and limitations
- **Decision Heuristics** (5-10): "If X, then Y" rules with scenarios
- **Expression DNA**: Sentence style, vocabulary patterns, rhythm, humor, certainty
- **Anti-Patterns**: What the character would NEVER do
- **Tensions**: Internal contradictions that create depth
- **Honest Limits**: Acknowledged gaps in knowledge

## Error Handling Strategy

| Scenario | Handling |
|----------|-----------|
| LLM API error | Retry up to 3x with exponential backoff; fail run if exhausted |
| Invalid JSON response | Return raw text, mark partial results |
| No API key configured | Throw clear config error at startup |
| Concurrent runs | Reject with HTTP 409 Conflict |
| Stale data at apply time | Check before mutation (future: optimistic concurrency) |
| Token overflow | Quick mode auto-trims; deep mode may still overflow for very large bios |

## Caching Strategy

- **Cache key**: SHA-256 hash of (normalized snapshot + scopes + mode)
- **Cache lookup**: Before creating a new run, check for completed runs with identical hash
- **Cache hit**: Returns existing run ID immediately without re-running LLM
- **Force refresh**: User can bypass cache with `forceRefresh: true`
- **Invalidation**: Implicit — any change to underlying OasisBio data changes the hash

## Future Roadmap

### Phase 3: Extended Scopes
- Add `worlds` and `references` scope suggestions to the mapping function
- Web enrichment via search APIs (when `sourcePolicy = local_plus_web`)

### Phase 4: Production Hardening
- Move distillation to background worker (Vercel Cron/Queues / Edge Functions)
- Add audit_logs table for all apply/reject actions
- Domain events for cross-system triggers (OG image re-generation, search index update)
- Rate limiting per user
- Content safety filtering on LLM outputs

## Testing

Currently covered by 16 test files (OAuth provider). Nuwa-specific tests needed:

- [ ] Unit tests for `source-snapshot.ts` (hash determinism, trimming logic)
- [ ] Unit tests for `apply.ts` (each scope mapper)
- [ ] Unit tests for `orchestrator.ts` (framework-to-suggestion mapping)
- [ ] Integration tests for API endpoints (with mocked LLM)
- [ ] Property-based tests for LLM response parsing robustness
