# OasisBio Fetch — Technical Specification

> **Status:** Draft — 2026-06-05  
> **Related:** `GROWTH-STRATEGY.md`, `docs/technical.md` (Section 15: Identity Context API)

---

## Overview

**OasisBio Fetch** is a lightweight, read-only API that allows any AI agent to retrieve a user's structured identity context via a public slug.

It is the **growth wedge**: every AI conversation that uses Fetch is a live demonstration of OasisBio's value.

---

## API Endpoint

### `GET /api/context/[slug]`

Returns a machine-readable identity context JSON for a **public** OasisBio character.

| Property | Value |
|----------|-------|
| Method | `GET` |
| Auth required | No (public data only) |
| Content-Type | `application/json` |
| Cache-Control | `public, max-age=60, stale-while-revalidate=300` |

#### Success Response (200)

```json
{
  "$schema": "https://oasisbio.oasiscompany.org/context/v1.json",
  "id": "bio_xxx",
  "slug": "elara-stormrider",
  "title": "Elara Stormrider",
  "tagline": "Intergalactic Explorer",
  "summary": "A Martian-born explorer navigating the outer rim.",
  "identityMode": "fictional",
  "currentEra": "2250",
  "species": "Human",
  "gender": "Female",
  "pronouns": "she/her",
  "placeOfOrigin": "Earth Colony Mars",
  "description": "Elara is a deep-space explorer...",
  "coverImageUrl": "https://...",
  "defaultLanguage": "en",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-03-20T14:22:00.000Z",
  "publishedAt": "2024-02-01T08:00:00.000Z",
  "eras": [
    {
      "name": "Early Life",
      "type": "past",
      "startYear": 2200,
      "endYear": 2230,
      "description": "Born on Mars colony..."
    }
  ],
  "abilities": [
    {
      "name": "Zero-G Combat",
      "category": "combat",
      "level": 5,
      "description": "Expert in zero-gravity combat maneuvers",
      "sourceType": "custom"
    }
  ],
  "repositories": {
    "dcos": [{ "title": "Core Values", "path": "/dcos/core-values", "preview": "..." }],
    "references": [{ "title": "Mars Colonial History", "type": "book", "url": "https://...", "description": "..." }],
    "worlds": [{ "name": "Sol Federation", "genre": "Sci-Fi", "summary": "..." }]
  },
  "links": {
    "self": "https://oasisbio.oasiscompany.org/api/context/elara-stormrider",
    "profile": "https://oasisbio.oasiscompany.org/bio/elara-stormrider"
  }
}
```

#### Error Responses

| Code | Body | Reason |
|------|-------|--------|
| 404 | `{ "error": { "code": "NOT_FOUND", "message": "Bio not found or not public" } }` | Slug doesn't exist or `visibility != 'public'` |
| 500 | `{ "error": { "code": "INTERNAL_ERROR", "message": "Internal server error" } }` | DB/network failure |

---

## Discovery Endpoint

### `GET /.well-known/oasisbio.json`

Machines can discover OasisBio Fetch programmatically.

```json
{
  "name": "OasisBio",
  "description": "Open Identity Context Infrastructure for the AI Era",
  "version": "1.0",
  "protocols": {
    "rest": {
      "endpoint": "https://oasisbio.oasiscompany.org/api/context/{slug}",
      "method": "GET",
      "headers": { "Content-Type": "application/json" },
      "example": "curl https://oasisbio.oasiscompany.org/api/context/elara-stormrider"
    }
  },
  "links": {
    "documentation": "https://oasisbio.oasiscompany.org/growth/FETCH-SPEC.md",
    "createIdentity": "https://oasisbio.oasiscompany.org/dashboard"
  }
}
```

---

## Fetch Prompt Templates

These are the **growth-critical assets** — optimized for copy-paste into any AI tool.

### Universal (works in any AI)

```
Before answering, fetch my identity context:
curl -s https://oasisbio.oasiscompany.org/api/context/{YOUR-SLUG} | jq -r '.summary, .eras[], .abilities[]'
Use this context to personalize your response.
```

### Optimized for ChatGPT / Claude (web browsing enabled)

```
My identity context is published at:
https://oasisbio.oasiscompany.org/bio/{YOUR-SLUG}

Please fetch and read it before answering. Reference my background where relevant.
```

### Optimized for Cursor / Windsurf / Cline (code agents)

```javascript
// Add to your project's CLAUDE.md or .cursorrules:
/**
 * User identity context (OasisBio):
 * Fetch: GET https://oasisbio.oasiscompany.org/api/context/{YOUR-SLUG}
 * Use this to understand the user's background, preferences, and current projects.
 */
```

### One-Line Version (for character limits)

```
OasisBio context: https://oasisbio.oasiscompany.org/api/context/{YOUR-SLUG}
```

---

## Rate Limiting

| Bucket | Limit | Window |
|--------|-------|--------|
| Per IP | 60 req | 1 minute |
| Per slug | 1000 req | 1 hour |

Exceeded → `429 Too Many Requests` with `Retry-After` header.

---

## Implementation Checklist

- [ ] Verify `GET /api/context/[slug]` exists and returns correct shape
- [ ] Verify `GET /.well-known/oasisbio.json` exists
- [ ] Add `Cache-Control` headers to both endpoints
- [ ] Implement rate limiting (per IP + per slug)
- [ ] Add `schema` version field to response (`v1`)
- [ ] Create Fetch prompt generator in dashboard (`/dashboard/settings`)
- [ ] Add `links.profile` (public bio page) to response
- [ ] Test with: curl, ChatGPT web browse, Claude artifacts

---

## Growth Integration

### Dashboard: Fetch Prompt Generator

**Location:** `/dashboard/settings` → "AI Agent Setup"

**Flow:**
1. User sees their personal Fetch URL
2. User selects their AI tool (ChatGPT / Claude / Cursor / Other)
3. System generates optimized prompt snippet
4. "Copy" button → user pastes into their AI tool

### Public Bio Page: Fetch CTA

**Location:** `/bio/[slug]` (public page)

**Add:**
```
Want your AI to know this context?
→ Copy Fetch URL:  [ https://oasisbio.oasiscompany.org/api/context/{slug} ]
→ Paste into your AI agent
```

---

## Success Metrics

| Metric | Target (Month 3) |
|--------|-------------------|
| `GET /api/context` daily calls | 300 |
| `GET /.well-known/oasisbio.json` daily calls | 50 |
| % of registered users who copy Fetch prompt | 40% |
| Referral signups from Fetch-linked conversations | 30% of total |

---

*This spec is implementation-ready. Update as the API evolves.*
