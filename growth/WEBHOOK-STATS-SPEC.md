# Webhook & Stats Panel — Specification

> **Status:** Draft — 2026-06-05  
> **Related:** `GROWTH-STRATEGY.md`, `FETCH-SPEC.md`

---

## Part 1: Webhook Ingestor

### Overview

Automatically detect and ingest user content from external platforms (YouTube, X/Twitter, Medium, GitHub, etc.) into the user's OasisBio. Reduces manual data entry → higher activation and retention.

**Growth insight:** The biggest barrier to a complete Bio Index is manual effort. Remove the friction.

---

### Supported Platforms (V1)

| Platform | Content Type | Extraction Method |
|----------|--------------|-------------------|
| YouTube | Video titles, descriptions, transcripts | YouTube Data API v3 |
| X/Twitter | Tweets, threads | X API v2 (OAuth 2.0) |
| Medium | Artiles | RSS / Parsr API |
| GitHub | Repos, READMEs, bio | GitHub REST API |
| Linkedin | Posts, profile | LinkedIn API (OAuth) — V2 |

---

### Architecture

```
External Platform          OasisBio Webhook          OasisBio DB
─────────────────         ────────────────         ───────────
                         │
User posts new content    │
         │               │
         ▼               │
Webhook event ───────►  │  Ingest handler
         │               │       │
         │               ▼       ▼
         │          Parse + extract       Store to:
         │                               - references (link)
         │                               - dcos_files (content)
         │                               - eras (timeline)
         │                               - abilities (skills from bio)
         │
         │◄─────── Return 200 OK ───────│
```

---

### API Endpoints

#### `POST /api/webhooks/[platform]`

Receives webhook events from external platforms.

**Headers:**
- `x-platform-signature` — HMAC signature for verification
- `x-webhook-event` — event type (e.g., `youtube.video.published`)

**Payload example (YouTube):**
```json
{
  "eventType": "youtube.video.published",
  "data": {
    "videoId": "dQw4w9WgXcQ",
    "title": "Building My First AI Agent",
    "description": "...",
    "publishdAt": "2026-06-05T10:00:00Z",
    "transcriptUrl": "https://...",
    "tags": ["AI", "tutorial"]
  }
}
```

**Response:** `200 OK` (async processing via domain events)

---

#### `GET /api/webhooks/status`

Returns the user's connected platforms and last sync status.

**Response:**
```json
{
  "connections": [
    {
      "platform": "youtube",
      "connected": true,
      "lastSync": "2026-06-05T08:30:00Z",
      "status": "active"
    },
    {
      "platform": "x",
      "connected": false,
      "lastSync": null,
      "status": "not_connected"
    }
  ]
}
```

---

#### `POST /api/webhooks/connect`

Initiates OAUth flow to connect a platform.

**Body:** `{ platform: "youtube" | "x" | "medium" | "github" }`

**Response:** `{ authUrl: "https://accounts.google.com/o/oauth2/v2/auth?..." }`

---

### Data Mapping

| Platform Data | OasisBio Destination | Notes |
|---------------|----------------------|-------|
| YouTube video title + desc | `references` (type: `video`) | Auto-generate `metadata.json` |
| YouTube transcript | `dcos_files` (status: `draft`) | Summarize via LLM before storing |
| X tweet thread | `dcos_files` (type: `social`) | Thread → single markdown doc |
| GitHub README | `dcos_files` (type: `technical`) | Parse project description |
| GitHub bio + repos | `abilities` (inferred from repos) | LLM: extract skills from repo languages |
| Medium article | `dcos_files` (type: `article`) | Full content stored |

---

### Background Processing (Domain Events)

Webhook receipt is acked immediately (200 OK). Actual processing is async via `domain_events`:

```
Webhook received
  → INSERT INTO domain_events (type: 'webhook.received', payload: {...})
  → Return 200 OK

[Async worker polls domain_events WHERE status='pending']
  → Process event
  → Extract + transform content
  → Upsert into references / dcos_files / abilities
  → INSERT INTO domain_events (type: 'webhook.processed', status: 'done')
```

---

### Implementation Checklist

- [ ] Define `webhook_connections` Prisma model (user_id, platform, access_token, refresh_token, last_sync_at)
- [ ] Implement `POST /api/webhooks/[platform]` for each platform
- [ ] Implement OAUth connect flow for each platform
- [ ] Build async worker (or Vercel Cron → API route)
- [ ] Add `domain_events` consumer for `webhook.received`
- [ ] Add LLM summarization for long content (transcripts, articles)
- [ ] Add user settings page: `/dashboard/settings/webhooks`
- [ ] Add rate limiting: max 100 events/user/day

---

## Part 2: Stats Panel & Gamification

### Overview

A personal stats dashboard that shows users their "information capacity" — how much of their identity has been captured. Includes a **public leaderboard** to drive competition and sharing.

**Growth insight:** People are competitive. A leaderboard turns profile completion into a game.

---

### Stats Dashboard (Private)

**Location:** `/dashboard/stats`

#### Metrics Displayed

| Metric | Description | Icon |
|---------|-------------|------|
| **Bio Completeness** | % of profile fields filled | 📊 |
| **Total Words** | Across all DCOS files | 📝 |
| **References Collected** | Links, videos, articles | 🔗 |
| **Worlds Built** | Number of world settings created | 🌍 |
| **Abilities Registered** | Skills across all categories | ⚡ |
| **Days Streak** | Consecutive days with activity | 🔥 |
| **Identity Score** | Weighted composite score (0–100) | 🏆 |

#### Identity Score Formula (V1)

```
Identity Score = (
  bioCompleteness × 0.3 +
  dcosWordCount / 1000 × 0.2 +
  referencesCount × 0.15 +
  abilitiesCount × 0.15 +
  worldsCount × 0.1 +
  daysStreak × 0.1
) × 100
Capped at 100.
```

---

### Public Leaderboard

**Location:** `/explore/leaderboard`

#### Categories

| Category | Sort By | Updated |
|----------|---------|--------|
| **Overall Identity Score** | `identityScore DESC` | Real-time |
| **Most Words** | `totalWords DESC` | Real-time |
| **Most References** | `referencesCount DESC` | Real-time |
| **Most Worlds** | `worldsCount DESC` | Real-time |
| **Longest Streak** | `daysStreak DESC` | Daily |
| **Most Fetched** | `apiCallCount DESC` | Real-time (from Fetch) |

#### Leaderboard Entry

```json
{
  "rank": 1,
  "username": "elara_stormrider",
  "displayName": "Elara Stormrider",
  "avatarUrl": "https://...",
  "score": 87,
  "bioSlug": "elara-stormrider",
  "highlight": "Top identity score this week!"
}
```

#### Privacy Controls

Users can opt out of the leaderboard:
- Setting: `profile.show_on_leaderboard` (default: `true`)
- Respected in all `/explore/leaderboard` queries

---

### API Endpoints

#### `GET /api/stats/me`

Returns current user's stats.

**Response:**
```json
{
  "bioCompleteness": 72,
  "totalWords": 3847,
  "referencesCount": 23,
  "abilitiesCount": 8,
  "worldsCount": 2,
  "daysStreak": 5,
  "identityScore": 68,
  "rank": 142,
  "percentile": 94
}
```

#### `GET /api/stats/leaderboard`

Returns public leaderboard.

**Query params:**
- `category`: `overall` | `words` | `references` | `worlds` | `streak` | `fetched`
- `period`: `all` | `month` | `week`
- `limit`: number (default 50)

**Response:**
```json
{
  "category": "overall",
  "period": "all",
  "entries": [
    { "rank": 1, "username": "...", "score": 97, "avatarUrl": "...", "bioSlug": "..." }
  ],
  "totalParticipants": 1284
}
```

#### `GET /api/stats/[username]`

Returns public stats for any user (for profile pages).

---

### Database Changes

#### New table: `user_stats` (materialized view or cached table)

```prisma
model UserStats {
  id                  String   @id @default(cuid())
  userId              String   @unique
  user                User     @relation(fields: [userId], references: [id])
  
  bioCompleteness     Int      @default(0)
  totalWords          Int      @default(0)
  referencesCount     Int      @default(0)
  abilitiesCount      Int      @default(0)
  worldsCount         Int      @default(0)
  daysStreak          Int      @default(0)
  identityScore       Int      @default(0)
  apiCallCount        Int      @default(0)  // Fetch API calls
  
  lastActivityAt      DateTime @default(now())
  updatedAt           DateTime @updatedAt
  
  @@index([identityScore])
  @@index([totalWords])
  @@index([apiCallCount])
}
```

#### Update `users` table (if adding fields directly)

Alternatively, add stats as JSON column to `profiles`:
```prisma
profiles {
  stats Cache  String?  // JSON: { identityScore, totalWords, ... }
}
```

---

### Gamification Features

#### Badges (V2)

| Badge | Condition | Icon |
|--------|-----------|------|
| **First Step** | Complete first bio | 🎯 |
| **Storyteller** | 1000+ words in DCOS | 📖 |
| **World Builder** | Create 3+ worlds | 🌍 |
| **Well Connected** | 10+ references | 🔗 |
| **Fetchable** | First Fetch API call to your bio | 🤖 |
| **Viral** | 10+ Fetch API calls in a day | 🚀 |
| **Streak Master** | 30+ day streak | 🔥 |

Badges are displayed on the public profile page (`/bio/[slug]`).

#### Weekly Digest Email (V2)

Every Monday: "Your OasisBio week in review"
- Stats summary
- Leaderboard rank change
- Suggested next action ("Complete your `summary` to +10 Identity Score")

---

### Implementation Checklist

- [ ] Add `UserStats` model to Prisma schema
- [ ] Run migration (`npx prisma db push`)
- [ ] Build stats calculation function (recalculate on each write, or nightly cron)
- [ ] Implement `GET /api/stats/me`
- [ ] Implement `GET /api/stats/leaderboard`
- [ ] Implement `GET /api/stats/[username]`
- [ ] Build `/dashboard/stats` page (charts via Recharts or ECharts)
- [ ] Build `/explore/leaderboard` page
- [ ] Add leaderboard CTA to Fetch response (`X-Rank` header?)
- [ ] Add badge system (V2)
- [ ] Add privacy toggle: `show_on_leaderboard`

---

## Growth Loop Integration

```
User enables webhook ingestor
  → Content auto-appears in OasisBio
  → Identity Score goes up
  → User appears on leaderboard
  → User shares leaderboard ranking
  → New users sign up to compete
  → New users enable webhook ingestor
  → Loop continues
```

**Key metric to optimize:** Webhook → Identity Score increase rate.

---

*These specs are implementation-ready. Prioritize webhook ingestor (V1: YouTube + GitHub) before stats panel.*
