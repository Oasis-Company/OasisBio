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
| Viral Growth & Growth Strategy (full) | `prepare_home/OasisBio 疯传潜力深度研究与增长策略报告.md` |
| Technical Next Steps | `planning/next-steps.md` |
| Nuwa Skill Integration Plan | `prepare_home/OasisBio × 女娲 Skill 集成深度调研与落地方案.md` |

---

## 9. Security P0 (Prerequisite for Growth — Fix Before Marketing)

> Source: Viral Growth Report — all issues verified against repo code

### 7 Security Issues Ranked

| # | Issue | Severity | Fix |
|---|-------|----------|-----|
| 1 | **OAuth HS256 symmetric signing — JWKS exposes `k` value in production** | P0 | Migrate to EdDSA/RS256; only expose public key via JWKS; use `jose` library |
| 2 | **Supabase webhook skips signature check when `SUPABASE_WEBHOOK_SECRET` is absent** | P0 | Reject immediately if secret is missing — do not skip |
| 3 | **Direct client-side upload bypasses ownership check (no `asset-token` edge fn in prod)** | P0 | Ship `asset-token` as the official upload path; close bypass |
| 4 | **Model deletion removes DB record but leaves R2 file orphaned** | P1 | Sync delete R2 objects when model record is deleted |
| 5 | **Deployment docs drift between Vercel and Cloudflare** | P1 | Consolidate README / technical.md; mark Cloudflare as "deprecated / migration complete" |
| 6 | **`@supabase/auth-helpers-nextjs` deprecated package still in deps** | P1 | Remove; confirm all usage migrated to `@supabase/ssr` |
| 7 | **`next lint` is a npm script wrapper instead of ESLint CLI (Next.js 16 requirement)** | P1 | Migrate to ESLint flat config or ESLint CLI per Next.js 16 upgrade guide |

---

## 10. Viral Growth: What Makes OasisBio Worth Sharing

> Source: Viral Growth Report

### Core Insight
> **"Don't market OasisBio as a 'feature-rich repo'; make it so that when a user publishes, they automatically get an identity asset worth forwarding, forking, and integrating."**

### Viral Feature Assessment

| Feature | Why It Goes Viral | Viral Coefficient |
|---------|------------------|-------------------|
| Cross-era identity container (Past/Present/Future/Alternate) | "Past me vs. future me" self-comparison is inherently shareable | ⭐⭐⭐⭐⭐ |
| DCOS "personality script" | Can be framed as "write your own README" — strong dev/creator meme | ⭐⭐⭐⭐⭐ |
| OAuth identity integration | Developers want to build on it; ecosystem drives adoption | ⭐⭐⭐⭐⭐ |
| Nuwa AI distillation | Visualized insight cards are screenshot-worthy | ⭐⭐⭐⭐ |
| 3D model + world/era binding | High visual shareability on social once public pages are polished | ⭐⭐⭐⭐ |
| World builder (6-module) | Great for OC/fandom communities and template sharing | ⭐⭐⭐ |

### New Features for Viral Flywheel

| Feature | Core Idea | Priority |
|---------|-----------|----------|
| **Identity Share Card** | Auto-generate OG/share card on publish: name + era timeline + 3 abilities + 1 Nuwa insight + 1 world tag | P0 |
| **Remix Template Marketplace** | Public OasisBio / World can be forked with source attribution | P0 |
| **Past/Future Comparison Page** | Pick two eras → generate Before/After view; exportable as shareable growth card | P1 |
| **Relationship Graph UI** | `CharacterRelationship` visualized as force-graph; screenshot-shareable | P1 |
| **OAuth Playground** | `/developer/docs` → one-click OAuth flow → live userinfo + resource JSON | P1 |
| **Nuwa Cognitive Radar** | ECharts radar chart from Nuwa output; one-tap save-as-image | P1 |
| **`/u/[username]` public user page** | Social spread entry point per strategic doc | P1 |

### 4-Week Viral Sprint (Gantt)

```
Week 1 — Foundation (must-fix before any marketing):
  D1    → Freeze deployment truth: unify README / technical.md / package scripts
  D2    → Repo hygiene: remove dev.db / .dev.vars, update .gitignore, scan secrets
  D3    → Design OAuth fix plan: HS256→EdDSA, JWKS, token rotation, rollback
  D4    → Enforce SUPABASE_WEBHOOK_SECRET as required in production (fail closed)
  D5    → Ship asset-token as official upload path; close ownership-check bypass
  D6    → Explore search + pagination + cache strategy for public bios
  D7    → Fix all landing CTAs; verify Register→Create→Publish→Share end-to-end

Week 2 — Shareable Assets:
  D8    → Launch v1 share card: name, tagline, 3 abilities, 1 world, 1 Nuwa insight
  D9    → Wire domain_events → OG image generation + page revalidation
  D10   → Publish first build-in-public post: "If README Could Describe a Person"
  D11   → Add GitHub Social Preview + fill missing topics + swap README hero to demo gif
  D12   → Open GitHub Discussions; post welcome thread + roadmap vote
  D13   → Create issue/PR templates; batch-label good first issue + growth
  D14   → First content round: X / LinkedIn / Reddit / HN (hook: "identity isn't a single layer")

Week 3 — Viral Loop:
  D15   → Build Past vs Future comparison page demo + shareable example card
  D16   → Publish one high-quality OasisBio template + one World template
  D17   → Ship Remix this template (min: public template → personal copy)
  D18   → Ship first version of Nuwa shareable insight card
  D19   → Publish second content piece: "Nuwa Doesn't Generate You — It Reads You"
  D20   → Launch relationship graph UI (read-only graph is fine for now)
  D21   → Announce "Write Your README" challenge; collect first batch of entries

Week 4 — Community:
  D22   → Launch OAuth Playground: full login + userinfo + resource JSON visible
  D23   → Set up "Built with Oasis" page; tease integration showcase call
  D24   → Ship Friday: merge growth PRs, publish first official Release
  D25   → Publish third content piece: "Continue with Oasis"
  D26   → Start Worldbound Friday recurring theme (weekly themed identity builds)
  D27   → A/B test top share card variant vs. landing hero
  D28   → Publish "30-day before/after" retrospective thread on X + LinkedIn
  D29   → Curate "Top 10 Public Templates" collection page
  D30   → Retrospective: Stars / Forks / publishes / share CTR / Remix count → decide next 3 priorities
```

### Audience & Channel Matrix

| Audience | Channels | Core Hook |
|----------|----------|-----------|
| Independent devs / AI teams | GitHub / HN / X | OAuth/OIDC Playground + "Continue with Oasis" — not a toy, a real identity layer |
| Worldbuilders / TTRPG / OC fandom | X / Reddit / Bilibili / 小红书 | World builder + Remix templates + relationship graph; screenshot-shareable |
| Personal brand / knowledge workers | LinkedIn / 即刻 / 小红书 | Past–Present–Future comparison + "write your future self as a data structure" |
| Researchers / educators / digital human experimenters | Academic blogs / podcasts / LinkedIn | Structured digital identity + narrative modeling + portable schema |

### Content Pillars (First Month)

| Article | Key Outline Points |
|---------|-------------------|
| If GitHub README Could Describe a Person | Why personal profiles are too shallow; DCOS as personality README; share card demo |
| From Character Card to Identity Infrastructure | Why character cards are flat; Era + World + Ability + DCOS combo value; what it means for creators / devs / researchers |
| Continue with Oasis | Why most character products have no developer ecosystem; OAuth/OIDC in OasisBio; minimal integration demo; future plugin ecosystem |
| Your Future Self Is Not Fantasy — It's a Data Structure | Why Future Self fits growth / education / personal brand; era comparison to boost shareability; real user template examples |
| Nuwa Doesn't Generate You — It Reads You | "Suggestions, not authoring" philosophy; quick/deep modes; visual cognitive cards; how results become public content assets |

---

## 11. Social Copy & Community Building

### Ready-to-Post Social Copy

**Twitter / X — Hook post**
> 你有没有想过，个人主页为什么不能像 GitHub 项目一样有版本、依赖、世界观和 API？
>
> 我们做了 OasisBio：把过去/现在/未来的你、能力树、DCOS、世界构建和 OAuth 放进同一个身份层。
>
> 现在最想听到的反馈是：你会先公开哪一个"时代版本"的自己？
>
> #buildinpublic #nextjs #digitalidentity　[Demo link / Star link]

**Twitter / X — README meme post**
> "如果 README 可以写一个人，会是什么样子？"
>
> OasisBio 把这件事做成了产品：人格脚本、能力池、世界观、3D 形象、甚至 Continue with Oasis。
>
> 回复一句你想给未来的自己写进 README 的话。

**Twitter / X — Roadmap co-creation**
> 刚给 OasisBio 加了一套新方向：不是 character creator，而是 identity infrastructure。
>
> 下一步我们会先做：分享卡、Remix 模板、关系图谱、OAuth Playground。
>
> 你最想先看到哪个？[投票 / 回复 / 提 PR]

**LinkedIn — Thought leadership**
> 大多数"数字身份产品"只停留在 profile。OasisBio 想做得更深：把一个人的跨时代版本、叙事脚本、能力体系、世界设定以及可接入 API 放进同一层。
>
> 对个人品牌、教育、游戏叙事和 AI 产品而言，这不是内容页，而是一个结构化身份资产。
>
> 欢迎一起讨论哪些场景最先成立。

**Reddit (r/SideProject, r/worldbuilding) — Show HN style**
> **Showcase: I'm building a "digital identity infrastructure" that lets one profile have Past/Present/Future selves, worlds, references, and an OAuth layer.**
>
> Most useful feedback: does this feel more like a character tool, a personal OS, or something else entirely?

**Hacker News — Show HN**
> **Show HN: OasisBio – a trans-era identity builder with worlds, DCOS, and OAuth**
>
> *(problem/architecture/why-build-it angle; no marketing tone)*

---

### 5 Viral Community Activities

| Activity | Core Mechanic | Execution Steps |
|----------|--------------|-----------------|
| **Write Your README Challenge** | Turn DCOS into a meme: "If you were an open-source project, what would your README say?" | Post template (4 fields: Mission / Principles / Abilities / Future Version) → users fill → one-click share card → best entries go on homepage template wall |
| **2035 Me Challenge** | Users create a Future Era and compare to Present | Launch challenge post → give 3 prompts → generate comparison card → pick top cases for secondary video content |
| **Worldbound Friday** | Weekly themed worldbound identity showcase | Fixed weekly theme (e.g. Cyber Monastery / Deep Sea Republic / Lunar Archive) → users publish worldbound version → official picks 5 → makes thread collection |
| **Nuwa Before / After** | Show identity expression before vs. after AI distillation | Pick public identity → show raw description vs. Nuwa distillation → audience votes "which is more like this person" |
| **Continue with Oasis Mini-Hackathon** | Encourage devs to build smallest possible integration or widget | Publish Playground + Starter → 7-day integration challenge → official "Built with Oasis" wall for all entries |

---

### GitHub Community Setup

**Label system:**

| Label | Purpose |
|-------|---------|
| `good first issue` | Entry point for first-time contributors |
| `help wanted` | Maintainer actively seeking help |
| `growth` | Share cards, Remix, OG, SEO, templates |
| `demo` | Demo pages, sample assets, screenshot outputs |
| `security` | OAuth, webhook, upload, key governance |
| `docs` | README, developer docs, deployment docs |
| `worldbuilding` | World builder, templates, content ecosystem |
| `developer-experience` | SDK, Playground, OAuth docs |
| `public-page` | Public bio, SEO, share cards, /u page |
| `nuwa` | AI distillation and visualization |

**Viral Feature Request issue template:**
```yaml
name: Viral Feature Request
description: Propose a capability that makes OasisBio easier to share, remix, or discuss
title: "[Growth] "
labels: ["enhancement", "growth"]
body:
  - type: textarea
    id: problem
    attributes:
      label: What sharing problem does this solve?
      placeholder: "e.g. Users have nothing shareable after publishing"
    validations:
      required: true
  - type: textarea
    id: trigger
    attributes:
      label: Why would users want to share it?
      placeholder: "e.g. It lets them show '2035 me' vs. 'now me'"
  - type: textarea
    id: proposal
    attributes:
      label: Your proposal
      placeholder: Interaction flow / entry point / expected screenshot
    validations:
      required: true
  - type: textarea
    id: metrics
    attributes:
      label: Metrics you'd watch
      placeholder: "e.g. share rate, public page CTR, Remix count"
```

**CONTRIBUTING onboarding (excerpt):**
```md
Welcome to OasisBio.

If this is your first contribution, don't start with a big feature.
Pick one of these three tracks instead:
1. Make the public page easier to share
2. Make it easier for developers to integrate Continue with Oasis
3. Make world templates easier to Remix

Before submitting:
- Clearly state which user path your change affects
- Attach a screenshot for any public-facing UI change
- Include a doc update for API / schema changes
- For growth features, state the metric you're trying to move
```

---

*This document synthesizes insights from three research reports. All working hypotheses (user ratios, funnel targets) should be validated against real cohort data as it becomes available.*
