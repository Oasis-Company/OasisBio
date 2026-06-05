# OasisBio Strategic Plan

## Core Mission Reaffirmation

OasisBio is **not** a character creation tool. It is a **digital immortality identity infrastructure**. Users record themselves here, and in the future, connect to the metaverse. This determines all priorities.

---

## Phase 1: Make the Product Truly Usable (Current → 2 weeks)

**Goal:** A real user can complete the full flow: **Register → Create Identity → Publish → Share Link.**

### Checklist
- [x] Configure R2 storage credentials (unlocks 3D model upload)
- [ ] Add search and pagination to Explore page (currently loads everything — will break at scale)
- [ ] Character relationship UI (data model and APIs exist; only frontend missing)
- [ ] Verify homepage CTA links (ensure "Start Creating" button actually works end-to-end)
- [ ] Fix homepage clone URL (`yourusername/oasisbio` → real GitHub org)

## Phase 2: Identity Depth (2–4 weeks)

**Goal:** Make users feel *"this is MY digital identity"* rather than just filling out forms.

| Initiative | Why it Matters |
|-----------|--------------|
| **World narrative upgrade** | World builder copy should feel like "you're building a parallel universe," not just "character background" |
| **Public profile visual upgrade** | The public page has good bones but needs stronger visual impact — users should want to share this link |
| **User profile `/u/[username]`** | Shows all public identities for one user — this is the social spread entry point |
| **Export perfection** | User data must be fully portable (ZIP format) — this fulfills the Manifesto promise |

## Phase 3: Become Identity Infrastructure (1–2 months)

**Goal:** Make OasisBio the identity layer that other products can plug into.

| Initiative | Description |
|-----------|-------------|
| **OAuth ecosystem launch** | Proactively find 1-2 partners to integrate "Continue with Oasis" — even your own product |
| **Public API documentation** | Make `/developer/docs` truly usable with playground |
| **Webhook system** | Let third-party apps subscribe to identity change events (publish, update, etc.) |

## Phase 4: Digital Immortality Infrastructure (Long-term)

**Goal:** Prepare data structures for future metaverse integration.

| Initiative | Rationale |
|-----------|---------|
| **Versioned identities** | Each major update creates a snapshot — identities have history |
| **Cross-platform verification** | Users can prove they created a certain character (DID-like) |
| **Data portability standard** | Define OasisBio data format spec so other platforms can import |

## What We Won't Do

- ❌ **No AI generation** (dilutes the value of *"this is my authentic recorded identity"* — Nuwa provides *suggestions*, not auto-generation)
- ❌ **No social feed** (not a social platform — it's an **identity archive**)
- ❌ **No paywall** (early stage — accumulate identity data first)
