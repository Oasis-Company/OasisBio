# OasisBio Growth Strategy

> **Status:** Draft — 2026-06-05  
> **Owner:** Product/Growth  
> **Related:** `docs/technical.md`, `planning/PRODUCT-v2.md`

---

## Context & Pivot Rationale

OasisBio was initially designed as a **closed-loop identity system** — users create, manage, and publish character profiles entirely within the platform.

**The problem:** A closed system has no external entry points. Without organic inbound traffic, growth stalls.

**The pivot:** Reposition OasisBio as an **open identity infrastructure for AI agents**. The core value prop shifts from "build a character profile" to:

> **"Give your AI agent instant context about who you are — via OasisBio Fetch."**

This turns OasisBio from a destination users must visit into a **background service their AI already uses**.

---

## New Positioning

| Before | After |
|--------|-------|
| "Create a cross-generational identity" | "Your AI should know you. OasisBio makes that possible." |
| Closed ecosystem | Open API + Fetch interface |
| User comes to OasisBio | OasisBio comes to the user's AI |

### Tagline Options

1. **"The identity layer for your AI."** (recommended)
2. "Give your agent memory."
3. "Your context, everywhere your AI works."

---

## Core Growth Mechanism: OasisBio Fetch

### What is Fetch?

Fetch is a **prompt + API interface** that lets any AI agent (ChatGPT, Claude, Cursor, Windsurf, etc.) query a user's OasisBio identity index in real time.

```
User's AI Agent                    OasisBio API
─────────────────                ──────────────
Pastes Fetch prompt
         │
         ▼
Calls: GET /api/context/{slug}
         │
         ▼
Returns: structured identity JSON
         │
         ▼
AI now "knows" the user
```

### User Flow (3 steps)

```
Step 1: Initialize Index
  User visits OasisBio → "Initialize my Bio Index"
  (or Deo/Dia AI assistant does it automatically)

Step 2: Copy Fetch Prompt
  OasisBio generates a personalized Fetch prompt snippet
  User copies it

Step 3: Paste into AI Workspace
  User pastes prompt into ChatGPT/Claude/Cursor/etc.
  AI now has persistent context about the user
  Every conversation benefits from OasisBio data
```

### Why this drives growth

- **Viral loop:** Every time the user's AI mentions "I know you from your OasisBio," the AI's output is a free OasisBio impression.
- **Low friction:** Copy-paste, no integration work.
- **Retention lock-in:** Once an AI knows the user via OasisBio, switching away means losing context.

---

## GTM Strategy

### Phase 1: Developer-Led Growth (Weeks 1–4)

**Audience:** AI tool users (Cursor, Windsurf, Continue.dev, Cline)

| Channel | Tactic | Success Metric |
|---------|--------|----------------|
| GitHub README | Add "Use with your AI agent" section | Stars + API calls |
| Hacker News | "Show HN: I built an identity layer for AI agents" | Traffic to `/api/context` |
| Discord/Slack | Bot that demonstrates Fetch in real time | New registered users |
| Twitter/X | Code snippets showing Fetch integration | Impressions → signups |

**Key asset needed:** A one-line Fetch prompt that *just works*:

```markdown
Fetch my identity context from OasisBio:
curl -H "Accept: application/json" https://oasisbio.oasiscompany.org/api/context/{your-slug}
Paste the JSON above into context before answering.
```

---

### Phase 2: creator/OC Community (Weeks 5–8)

**Audience:** Worldbuilders, RPG creators, character designers

| Channel | Tactic | Success Metric |
|---------|--------|----------------|
| Reddit r/worldbuilding | "I built a shareable character API for my TTRPG campaign" | Referral signups |
| Bilibili/Xiaohongshu | Short video: "让AI记住你的OC人设" | Shares + backlinks |
| ArtStation/DeviantArt | Bio cards with Fetch QR code | Scans → new users |

---

### Phase 3: Professional/Personal Brand (Weeks 9–12)

**Audience:** Developers, writers, knowledge workers

| Hook | Channel |
|------|---------|
| "Your AI should know your projects" | LinkedIn, Twitter |
| "Stop re-introducing yourself to every AI" | Personal blogs, newsletters |
| "OasisBio as your portable professional identity" | GitHub profile README |

---

## Feature Roadmap Aligned with Growth

### Consolidation (Must ship before launch)

| Feature | Why it matters for growth | Status |
|---------|--------------------------|--------|
| Backend API closed-loop verification | Fetch breaks if API is unstable | ⚠️ Needs verification |
| Logo + brand assets on all pages | Every Fetch response is a branding opportunity | ❌ Not done |
| Developer onboarding flow | Separate from artist/creator flow | ❌ Not done |
| Normal user onboarding flow | Low-friction first-run experience | ❌ Not done |
| Artist/creator onboarding flow | Optimized for worldbuilding use case | ❌ Not done |

### Expansion (Growth accelerators)

| Feature | Growth impact | Priority |
|---------|----------------|----------|
| **Webhook ingestion** (YouTube, X, Medium) | Auto-populates Bio Index → less manual work → higher activation | P0 |
| **Stats dashboard** + leaderboard | Gamification → daily active use → habit formation | P1 |
| **Machine-readable docs** (`/.well-known/oasisbio.json`) | Lets other tools discover OasisBio programmatically | P0 |
| **Fetch prompt optimizer** | One-click copy, works in any AI tool | P0 |
| **Bio Index versioning** | Users can share specific versions of their identity | P2 |

---

## Success Metrics

### North Star: **Fetch-enabled Conversations / Month**

| Metric | Target (Month 3) | Target (Month 6) |
|--------|-------------------|-------------------|
| Registered users | 500 | 5,000 |
| API calls (`/api/context`) | 10,000/mo | 100,000/mo |
| Public bios (SEO surface) | 200 | 2,000 |
| Referral signups (% of total) | 30% | 50% |

### Activation Funnel

```
Visit site
  → Sign up (target: 40%)
    → Initialize Bio Index (target: 60% of signups)
      → Copy Fetch prompt (target: 40% of initialized)
        → Paste into AI tool (target: 80% of copied)
          → Return & enrich profile (target: 30% of active)
```

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Fetch prompt is too long → users won't paste | Build a browser extension that auto-injects context |
| API abuse (rate limiting) | Implement per-user rate limits on `/api/context` |
| Users don't understand "Bio Index" concept | Rename to "AI Identity Profile" in user-facing copy |
| Competitor (Character.AI, GPT Memory) | OasisBio is portable across *all* AI tools, not locked to one |

---

## Next Steps

- [ ] Finalize Fetch prompt format (keep under 500 chars)
- [ ] Build `/api/context/{slug}` endpoint (or verify it exists)
- [ ] Design 3 separate onboarding flows (dev / normal / creator)
- [ ] Add OasisBio branding to Fetch API responses
- [ ] Build webhook ingestion MVP (start with YouTube)
- [ ] Build stats dashboard MVP
- [ ] Write machine docs for `/.well-known/oasisbio.json`

---

*This document is a living strategy. Update as experiments run and data comes in.*
