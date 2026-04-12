# OasisBio Documentation

## Documents

| Document | Description |
|----------|-------------|
| [technical.md](technical.md) | Full technical reference — architecture, auth, database schema, API, world builder, testing, deployment |
| [design.md](design.md) | Design system — color palette, typography, components, layout |
| [world-design-spec.md](world-design-spec.md) | Worldbuilding standard — 6-module structure, field definitions |

## Database Setup Scripts

Run in Supabase SQL Editor **in this order** after `npx prisma db push`:

| # | Script | What it does |
|---|--------|-------------|
| 1 | `scripts/db/01_enable_rls.sql` | Enables Row Level Security on all 16 tables + creates access policies |
| 2 | `scripts/db/02_add_indexes.sql` | Adds 5 performance indexes for common query patterns |
| 3 | `scripts/db/03_service_role_bypass.sql` | Documentation only — no SQL to run |
| 4 | `scripts/db/04_storage_policies.sql` | Storage bucket write policies (run after creating buckets) |
| 5 | `scripts/db/05_domain_events_audit_logs.sql` | Creates `domain_events` and `audit_logs` tables |
| 6 | `scripts/db/06_publish_bio_rpc.sql` | Creates `publish_bio`, `unpublish_bio`, `validate_publishable_bio` RPCs |

## Quick Reference

### Auth pattern in API routes

```typescript
// ✅ Correct — requireAuth() returns User directly
const user = await requireAuth();
const userId = user.id;

// ❌ Wrong — old pattern, will crash
const session = await requireAuth();
const userId = session.user.id;
```

### Error response format

```json
{ "error": { "code": "FORBIDDEN", "message": "You do not own this bio" } }
```

### World completion score

```typescript
// 10 tracked fields: name, summary, timeSetting, timeline, physicsRules,
// rules, socialStructure, factions, geography, majorConflict
calculateCompletionScore(world) // → 0–100
```

### Publish a character

```
POST /api/oasisbios/{id}/publish
Body: { "visibility": "public" }

DELETE /api/oasisbios/{id}/publish  (unpublish)
```

### Supabase client selection

| Context | Import |
|---------|--------|
| Client Component | `import { createClient } from '@/lib/supabase/client'` |
| Server Component / API Route | `import { createClient } from '@/lib/supabase/server'` |
| Middleware | `import { updateSession } from '@/lib/supabase/middleware'` |
| Storage operations | `import { uploadFile, storagePath } from '@/lib/supabase/storage'` |
