# OasisBio UX Strategy & Growth Plan

> Last updated: 2026-05-08
> Sources: AI UX Research Report (`docs/research/oasisbio-ux-research-report.md`) + GPT repo-based user segmentation study

---

## 1. User Segmentation Working Hypothesis

| Tier | Definition | Est. Share |
|------|-----------|------------|
| **Light users** | Register, browse, fill a draft, use Nuwa once or only view public characters; never publish or rarely return within 30 days | 60–70% |
| **Medium users** | Complete first character skeleton; fill basic info + key era/world sections; may publish 1 character; have periodic editing behavior | 20–30% |
| **Power users** | Maintain multiple identities / multi-era versions; frequently use World Builder, DCOS, relationship graph, publish system; willing to share links, expect API/OAuth access | 8–15% |

**Core conclusion**: Working hypothesis is **65 / 25 / 10**. OasisBio should NOT force all three tiers through the same path — light users need to be quickly led to "I can make one too," medium users pushed to "I published my first one," and power users should feel "this is my primary identity workstation."

---

## 2. Explore Page Strategy

**Verdict: Prioritize "quick browse" on first screen; deep discovery goes to layer two (70/30 resource allocation).**

| Zone | Content | Rationale |
|------|---------|-----------|
| **Hero (top)** | One value proposition + main CTA "Browse Public Characters" + secondary CTA "Create Your First Identity" + 3 scenario gateways (Novel Writing / TTRPG Worldbuilding / AI Roleplay) | First answer "What is this? What can I do? What's next?" |
| **Featured Cards** | 6–9 featured public characters; each card: avatar/cover, one-line hook, era tags, world tags, completion % | Users scan, don't read — high information density, low cognitive load samples |
| **Topic Tracks** | "For Novelists" / "For GMs" / "For AI Chat" / "Cross-Era Identity Experiments" / "High Relationship Complexity" etc. | Organize by intent, not internal module names |
| **Preview Layer (Drawer)** | Click card → 30-second readable preview: character overview, world one-liner, key abilities, relationship summary, narrative excerpt, CTA "Start from this inspiration" | Let users be inspired first, then ask them to register |
| **Deep Discovery** | Search, filters, pagination, tag tree, sorting (below the fold or on sub-page) | Serves engaged visitors, not first-time strangers |
| **Conversion Bridge** | After every preview & topic track: ultra-light registration hook: "Fork this structure to start writing" / "Save this idea in 30 sec" | Turn browsing and creating into a continuous journey |

---

## 3. Registration Funnel Benchmarks & Targets

| Step | Industry Proxy Benchmark | OasisBio Phase-1 Target |
|------|------------------------|------------------------|
| Landing → Explore | SaaS landing page median conversion ~3.8%; soft CTA should be significantly higher | **15%–30%** |
| Explore → Register Complete | Visitor→free registration median ~12% | **20%–35%** |
| Register Start → Complete | Form completion rate avg. 60.7% | **≥65%, excellent ≥75%** |
| Register → First Character Created (within 7d) | SaaS avg. activation ~37.5% | **30%–40%** |
| First Character → First Publish (within 30d) | No standard benchmark | **10%–20%** |

**Most critical step**: **Register → First Character Created** (activation drives retention, not raw traffic).

---

## 4. Three Core Insights

### 1. The "Completion Trap"
The 6-step wizard's Steps 4–6 were empty buttons; Steps 2–3 only had add/remove UI with no API behind them. Users thought they completed everything, but only Step 1 data was actually saved. This was the highest drop-off point.

**Fix direction**: Onboarding flow should only require completing the "skeleton" (basic info → one era version → a world summary → auto-generate preview). Ability pool / DCOS / relationship graph go into a "Continue Building" phase after first save.

### 2. "Identity Depth vs. Tool Feel"
Nuwa outputs mentalModels / decisionHeuristics / expressionDNA — these are AI reasoning processes. Users see markdown cards but cannot understand their value. Low Nuwa adoption root cause: missing translation layer (meaning interpretation + action suggestions + consistency scoring against the character).

**Fix direction**: Nuwa should trigger **after draft**, not on a blank page. Once the user has written some setting, Nuwa offers 3 completion directions: era conflicts, relationship gaps, ability contradictions.

### 3. "Explore Is the Front Door"
Unauthenticated users' only entry point. Current `/explore` had only 11 lines of component code — no search, pagination, or filtering. New users couldn't preview content; registration motivation was weak.

**Fix direction**: See Section 2 above.

---

## 5. Execution Priority

### P0 — This Week (Done ✅)

| # | Action | Success Metric |
|---|--------|---------------|
| 1 | **Explore search + pagination** | Explore→registration conversion +15% |
| 2 | **Wizard simplification**: compress mandatory steps to 3; move steps 4–6 to "Continue Building" panel | Create→publish completion rate +30% |
| 3 | **Post-first-save Publish CTA** (not "keep filling forms") | First-time publish rate +10% |
| 4 | **OTP error granularity** (distinguish network failure / quota exceeded / email not found) | Auth error rate -20% |

### P1 — Within 2 Weeks (Done ✅)

| # | Action | Success Metric |
|---|--------|---------------|
| 5 | **Nuwa triggers post-draft**, not on blank-page entry | Nuwa adoption rate increase |
| 6 | **Explore featured cards + Fork entry** | Explore→Register conversion +10% |
| 7 | **Analytics tracking**: `first_bio_saved` / `first_bio_published` / `return_day_1` / `return_day_7` | Activation funnel observability |
| 8 | **Slug real-time validation on publish** | Publish failure rate -50% |

### P2 — Within 1 Month

| # | Action | Notes |
|---|------|-------|
| 9 | **Power user paths**: version history, user profile aggregation, multi-identity organization | Retain core creators |
| 10 | **Use-case gateway entry points**: Novelist / GM / AI Roleplay guided paths | WorldAnvil-style segmentation |
| 11 | **Explore topic tracks** (named by use case, not module names) | Medium-user exploration depth +20% |

---

## 6. Competitive Reference Framework

| Competitor | Core Strategy | What OasisBio Can Borrow |
|------------|-------------|------------------------|
| **Character.AI** | Consumer-first: let users play first, then some create; Quick mode / Advanced mode dual-track | Top of funnel: extremely low barrier-to-entry on first screen, browse-driven registration |
| **WorldAnvil** | Use-case分流 + depth tiering: Freeman/Master/Grandmaster/Sage four-tier Guild system | Mid-to-late funnel: segment by scenario (novelist/GM/player), set upgrade paths by investment depth |
| **Campfire** | Modular tiering: pay per module; free tier lets users deepen by pain point | Feature boundary: free users fully experience core flow; depth features progressively unlock |

**OasisBio's best path**:
> **Character.AI-style top-of-funnel + WorldAnvil/Campfire mid-to-late upgrade**
> "Let me understand it first, then let me build it, then let me live it."

---

## 7. North Star Metric & Event Tracking List

**North Star Metric**: **Number of users who publish their first character within 7 days** (dual validation: activation × value delivery).

**First batch must-track events**:
```
landing_view
click_explore
open_character_preview
click_fork_or_start_from_sample
register_started
register_completed
first_bio_started
first_bio_saved
first_bio_previewed
first_bio_published
return_day_1
return_day_7
```

**Analytics dashboard priorities**:
1. Within 24h / 7 days after registration: did user create a character? (activation rate)
2. Within 30 days after creation: did they publish? (value-realization rate)
3. Cohort comparison by source (Landing / Explore / Fork)

---

## 8. Related Documents

| Document | Path |
|----------|------|
| AI UX Research Report (full) | `docs/research/oasisbio-ux-research-report.md` |
| GPT User Segmentation Study (full) | `prepare_home/OasisBio 用户分层策略与注册转化研究.md` |
| Technical Next Steps | `planning/next-steps.md` |
| Nuwa Skill Integration Plan | `prepare_home/OasisBio × 女娲 Skill 集成深度调研与落地方案.md` |
