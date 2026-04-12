# OasisBio

OasisBio is a digital identity builder and character creator platform for building expandable fictional character identities across eras. Users can create rich character profiles with ability pools, worldbuilding, DCOS documents, references, and 3D model support.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5.4
- **Styling**: Tailwind CSS 3.4
- **Database**: PostgreSQL via Supabase (Prisma 6 ORM)
- **Auth**: Supabase Auth (OTP / passwordless)
- **Storage**: Supabase Storage (images) + Cloudflare R2 (3D models, exports)
- **Deployment**: Cloudflare Pages

## Quick Start

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project
- A [Cloudflare](https://cloudflare.com) account with R2 enabled

### Setup

```bash
# 1. Clone and install
git clone https://github.com/yourusername/oasisbio.git
cd oasisbio
npm install

# 2. Configure environment
cp .env.example .env
# Fill in all values in .env (see Environment Variables section below)

# 3. Push database schema
npx prisma db push
npx prisma generate

# 4. Run database setup scripts (in Supabase SQL Editor)
# Execute in order:
#   scripts/db/01_enable_rls.sql
#   scripts/db/02_add_indexes.sql
#   scripts/db/04_storage_policies.sql
#   scripts/db/05_domain_events_audit_logs.sql
#   scripts/db/06_publish_bio_rpc.sql

# 5. Start dev server
npm run dev
```

### Environment Variables

```env
# Database (Supabase)
DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[ref]:[password]@aws-[region].supabase.com:5432/postgres"

# Supabase API
NEXT_PUBLIC_SUPABASE_URL="https://[ref].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..."
SUPABASE_SERVICE_ROLE_KEY="eyJ..."

# Cloudflare R2
CLOUDFLARE_R2_ACCESS_KEY_ID="..."
CLOUDFLARE_R2_SECRET_ACCESS_KEY="..."
CLOUDFLARE_R2_ENDPOINT="https://[account-id].r2.cloudflarestorage.com"
CLOUDFLARE_R2_BUCKET_NAME="..."
CLOUDFLARE_R2_ACCOUNT_ID="..."
```

## Project Structure

```
oasisbio/
├── src/
│   ├── app/
│   │   ├── api/                  # API routes
│   │   ├── auth/                 # Login / register pages
│   │   ├── dashboard/            # Authenticated dashboard
│   │   └── bio/[slug]/           # Public character pages
│   ├── components/
│   │   ├── auth/                 # Auth UI components
│   │   └── world/                # World builder components
│   ├── lib/
│   │   ├── supabase/             # SSR/browser/middleware clients
│   │   ├── auth.ts               # Server auth utilities
│   │   ├── auth-utils.ts         # requireAuth, ownership checks
│   │   ├── user-sync.ts          # Supabase → Prisma sync
│   │   ├── world-utils.ts        # World completion score, validation
│   │   └── storage.ts            # Storage abstraction layer
│   ├── types/
│   │   └── world.ts              # World form types and step config
│   └── middleware.ts             # Route protection
├── prisma/
│   └── schema.prisma             # Database schema
├── scripts/
│   └── db/                       # SQL setup scripts
└── docs/                         # Documentation
```

## Key Features

- **OasisBio Builder** — step-by-step character creation with era system
- **World Builder** — 6-module guided worldbuilding wizard
- **Ability Pool** — categorized skills with era/world binding
- **DCOS Repository** — character narrative documents
- **References Library** — external links and resources
- **3D Model Viewer** — GLB format with Three.js
- **Import/Export** — ZIP-based character data portability
- **Publish System** — atomic publish/unpublish via database RPC

## Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run lint         # ESLint
npm test             # Jest unit + property tests
```

## Documentation

See [`docs/`](docs/) for detailed documentation:

- [`docs/technical.md`](docs/technical.md) — Architecture, API reference, database schema
- [`docs/design.md`](docs/design.md) — Design system and UI guidelines
- [`scripts/db/`](scripts/db/) — Database setup SQL scripts

## License

MIT — see [LICENSE](LICENSE)
