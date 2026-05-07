<p align="center">
  <img src="public/assets/oasisbio-logo-horizontal.svg" alt="OasisBio" width="280">
</p>

<p align="center">
  <strong>A cross-generational identity protocol system for building expandable digital identities across eras, worlds, and dimensions.</strong>
</p>

<p align="center">
  <a href="#-quick-start"><b>Quick Start</b></a> •
  <a href="#-architecture"><b>Architecture</b></a> •
  <a href="#-tech-stack"><b>Tech Stack</b></a> •
  <a href="#-documentation"><b>Docs</b></a> •
  <a href="https://oasisbio.oasiscompany.org"><b>Live Demo →</b></a>
</p>

---

> **One day, humanity achieves digital immortality. Would you choose to return to your 18-year-old self, or continue living your life at 80?**
>
> OasisBio was born for this — a place to record everything that makes you *you*. Your dreams. Your imagined worldview. The way you express yourself.
>
> — [**OasisBio Manifesto**](OasisBio%20Manifesto.md)

---

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.2-black?style=flat-square&logo=next.js" alt="Next.js"/>
  <img src="https://img.shields.io/badge/TypeScript-5.4-blue?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Prisma-6.19-black?style=flat-square&logo=prisma" alt="Prisma"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS"/>
  <img src="https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase&logoColor=white" alt="Supabase"/>
  <img src="https://img.shields.io/badge/Deploy-Vercel-000000?style=flat-square&logo=vercel" alt="Vercel"/>
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License"/>
</p>

## ✨ What is OasisBio?

**OasisBio is not just a character creator. It's a digital identity infrastructure for the metaverse era.**

Build layered, multi-dimensional identities that span across time, fictional worlds, and alternate realities. Record who you are, who you were, and who you might become — then connect it all to the future.

### Core Modules

| Module | What it does |
|--------|-------------|
| 🧬 **Identity Builder** | Multi-mode profiles: real, fictional, hybrid, future, alternate, worldbound |
| ⏳ **Era Timeline** | Past / Present / Future / Alternate / Worldbound versions of one identity |
| 🌍 **World Builder** | 6-module guided worldbuilding (Core → Time → Rules → Civilization → Environment → Narrative) |
| ⚡ **Ability Pool** | Categorized skill system with era/world binding & proficiency levels |
| 📜 **DCOS Repository** | Dynamic Core Operating Script — narrative documents with versioning |
| 🔗 **References Library** | External resources with auto-enrichment (OG metadata extraction) |
| 🎭 **3D Model Viewer** | GLB format viewer powered by Three.js with era-specific previews |
| 🔐 **OAuth Provider** | "Continue with Oasis" — OAuth 2.0 + PKCE + OIDC for third-party apps |
| 🧠 **Nuwa AI** | Cognitive framework distillation: mental models, decision heuristics, expression DNA |
| 🏷️ **Tag System** | Polymorphic tags across entities (bios, worlds, references) |
| 👥 **Relationships** | Bidirectional character-to-character links |

### Identity Modes

| Mode | Description |
|------|-------------|
| **Real** | Your actual self (professional, personal) |
| **Fictional** | Characters, avatars, RPG personas |
| **Hybrid** | Real base + creative elements |
| **Future** | Your goal self (2030 Nobel laureate?) |
| **Alternate** | Parallel universe versions ("what if I became a rockstar?") |
| **Worldbound** | Identities tied to specific fictional worlds |

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                    Next.js 16 (App Router)                   │
│  ┌─────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐ │
│  │ SSR+RSC │ │ API Routes│ │ Middleware│ │ OAuth Provider   │ │
│  └────┬────┘ └────┬─────┘ └────┬─────┘ └──────┬───────────┘ │
│       │          │           │              │               │
│  ┌────▼──────────▼───────────▼──────────────▼─────────────┐ │
│  │            Prisma 6 ORM (PostgreSQL via Supabase)        │ │
│  │              23 models · RLS · RPC functions             │ │
│  └────────────────────────┬────────────────────────────────┘ │
│                           │                                    │
│  ┌────────────────────────▼────────────────────────────────┐ │
│  │  Supabase Auth (OTP) · Storage (images) · Edge Functions │ │
│  └────────────────────────┬────────────────────────────────┘ │
│                           │                                    │
│                    Cloudflare R2 (3D models · exports)         │
└──────────────────────────────────────────────────────────────┘
```

### By The Numbers

| Metric | Value |
|--------|-------|
| **Source Code** | ~71K lines across 222 files |
| **API Endpoints** | 53 REST routes |
| **Database Models** | 23 Prisma models |
| **Test Suites** | Jest + fast-check property-based testing |
| **Commits** | 305+ commits of iterative development |
| **License** | MIT |

---

## 🛠️ Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 16.2 |
| Language | TypeScript | 5.4 (strict) |
| Styling | Tailwind CSS | 3.4 (OKLCH color space) |
| Database | PostgreSQL via Supabase | — |
| ORM | Prisma | 6.19 |
| Auth | Supabase Auth (OTP/passwordless) | — |
| AI Pipeline | OpenAI-compatible LLM | — |
| 3D Rendering | Three.js (GLTFLoader) | 0.183 |
| Testing | Jest + fast-check | latest |
| Deployment | **Vercel** | — |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+**
- A [Supabase](https://supabase.com) project (free tier works)
- A [Cloudflare](https://cloudflare.com) account with **R2** enabled (for 3D models)

```bash
# Clone the repository
git clone https://github.com/zbbsdsb/oasisbio.git
cd oasisbio && npm install

# Configure environment
cp .env.example .env

# Push schema & generate Prisma client
npx prisma db push && npx prisma generate

# Run database setup scripts in Supabase SQL Editor (in order):
#   scripts/db/01_enable_rls.sql
#   scripts/db/02_add_indexes.sql
#   scripts/db/04_storage_policies.sql
#   scripts/db/05_domain_events_audit_logs.sql
#   scripts/db/06_publish_bio_rpc.sql
#   scripts/db/07_oauth_tables.sql

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 📁 Project Structure

```
oasisbio/
├── src/
│   ├── app/
│   │   ├── api/                  # 53 REST endpoints
│   │   │   ├── oauth/            # OAuth 2.0 + OIDC (authorize/token/userinfo/JWKS)
│   │   │   ├── nuwa/             # AI distillation pipeline (5 endpoints)
│   │   │   └── ...               # bios, worlds, abilities, dcos, refs, etc.
│   │   ├── dashboard/oasisbios/[id]/  # Character editor (8 sub-tabs)
│   │   │   ├── page.tsx          # Identity editor
│   │   │   ├── eras/page.tsx     # Era timeline
│   │   │   ├── abilities/page.tsx # Ability pool
│   │   │   ├── worlds/           # World builder (list + wizard + detail)
│   │   │   ├── dcos/page.tsx    # DCOS documents
│   │   │   ├── references/page.tsx # References library
│   │   │   ├── relationships/page.tsx # Character relationships
│   │   │   └── nuwa/page.tsx     # AI workspace (685 lines)
│   │   ├── bio/[slug]/page.tsx   # Public profile (SEO-optimized)
│   │   ├── developer/            # OAuth developer portal
│   │   └── page.tsx             # Landing page (7-section Swiss grid design)
│   ├── components/
│   │   ├── world/                # World builder UI (StepWizard, ModuleSection)
│   │   ├── auth/                 # Login/register forms
│   │   └── Tooltip.tsx           # Accessible guidance system (22 test cases)
│   ├── lib/
│   │   ├── nuwa/                 # AI distillation core (5 modules)
│   │   │   ├── types.ts          # Type contracts (~25 interfaces)
│   │   │   ├── source-snapshot.ts # Snapshot builder + hash
│   │   │   ├── llm.ts            # OpenAI-compatible LLM client
│   │   │   ├── orchestrator.ts   # Pipeline coordinator
│   │   │   └── apply.ts          # Suggestion applier
│   │   ├── oauth/                # OAuth provider (crypto/middleware/scopes)
│   │   ├── supabase/            # SSR/browser/middleware clients
│   │   └── storage.ts           # Unified Supabase + R2 storage layer
│   └── services/                # Import/Export service (ZIP)
├── prisma/schema.prisma         # 23 models, RLS enabled
├── scripts/db/                   # 7 SQL setup scripts
├── docs/
│   ├── technical.md             # Full architecture reference (2000+ lines)
│   ├── nuwa-integration.md      # AI pipeline docs (620 lines)
│   ├── design.md                # Design system (Swiss grid, OKLCH palette)
│   ├── OasisBio Strategic Plan.md # Product roadmap (English)
│   └── features/                # Feature specs (oauth, worlds, abilities...)
├── public/assets/                # Logo, sample images, 3D models
├── OasisBio Manifesto.md        # Vision statement
└── LICENSE                       # MIT
```

---

## 🧪 Testing

```bash
npm test                  # Jest unit + property tests
npm run test:watch        # Watch mode
npm run test:coverage     # Coverage report
```

| Area | Tests | Status |
|------|-------|--------|
| User sync (property-based) | 4 properties | ✅ Passing |
| Route protection (property-based) | 1 property | ✅ Passing |
| Auth state machine (property-based) | 1 property | ✅ Passing |
| OAuth crypto / validate / middleware | 16 test files | ✅ Passing |
| Tooltip component | 22 test cases | ✅ Passing |
| Nuwa Integration | — | 🔲 Pending (Phase 4) |

---

## 📖 Documentation

| Document | Description |
|----------|-------------|
| [**Technical Reference**](docs/technical.md) | Architecture, auth flow, DB schema, all API endpoints, OAuth provider, testing, deployment |
| [**Nuwa AI Integration**](docs/nuwa-integration.md) | AI distillation architecture, data model, 5 API endpoints, caching strategy, roadmap |
| [**Strategic Plan**](docs/OasisBio%20Strategic%20Plan.md) | Product roadmap: Phase 1–4, core mission, what we won't do |
| [**Design System**](docs/design.md) | Swiss grid, OKLCH color space, typography, component specs, accessibility |
| [**World Design Spec**](docs/world-design-spec.md) | 6-module worldbuilding standard with field definitions |
| [**OAuth Developer Guide**](docs/features/oauth.md) | "Continue with Oasis" integration guide + React example |
| [**Manifesto**](OasisBio%20Manifesto.md) | Vision: digital immortality, cross-generational identity protocol |

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. Create a feature branch (`git checkout -b feature/amazing`)
3. Make changes with **clear commit messages**
4. Run `npm run lint` and `npm test` to validate
5. Push to your fork and open a **Pull Request**

### Development Workflow

- This project uses **TypeScript strict mode** — all code must pass type checking
- Follow the existing code style (ESLint config included)
- New features should include tests where practical (Jest + fast-check)
- For database schema changes, update both `schema.prisma` and relevant SQL setup scripts

### Code Quality Checklist

- [ ] TypeScript compiles without errors (`npx tsc --noEmit`)
- [ ] ESLint passes (`npm run lint`)
- [ ] Tests pass (`npm test`)
- [ ] New API routes use `requireAuth()` and proper error handling
- [ ] New frontend components follow existing patterns (Tailwind, lucide-react icons)

---

## 📄 License

MIT © 2026 [ceaserzhao](https://github.com/zbbsdsb) ([Oasis Company](https://github.com/zbbsdsb))

See [LICENSE](LICENSE) for details.

---

<div align="center">

**Built with care by [Oasis Company](https://github.com/zbbsdsb).**

*Digital identities for the metaverse era.* 🌊

[Report Bug](https://github.com/zbbsdsb/oasisbio/issues) · [Request Feature](https://github.com/zbbsdsb/oasisbio/issues) · [Live Demo](https://oasisbio.oasiscompany.org)

</div>
