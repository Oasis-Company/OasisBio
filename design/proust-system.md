# Proust System — Questionnaire Design & Sharing Cards

## Role in the Product

The Proust system is **not part of the primary onboarding flow**.

It is a **viral growth module** — a self-contained experience designed for one specific user journey:

> Someone saw a beautiful sharing card on social media. They clicked. They arrived here. They have no context.

The Proust system's job is to:
1. Give that person a meaningful, low-friction first experience
2. Generate a shareable card that carries the OasisBio narrative into the world
3. Convert curious visitors into returning users (via account creation)

Direct-registration users (Path A) encounter Proust as an **optional enrichment feature**, not as their primary entry.

See [`attention-migration.md`](./attention-migration.md) for the full Path B user journey.

---

## Why Proust?

Marcel Proust's questionnaire is one of the most enduring self-reflection tools in history.
It asks questions that resist simple answers — questions about identity, memory, desire, time.

These are exactly the questions that feed OasisBio's architecture:
- "What is your idea of perfect happiness?" → feeds DCOS / Era reflections
- "What do you consider your greatest achievement?" → feeds Ability Pool
- "Where would you most like to live?" → feeds World Builder
- "Who are your favorite heroes of fiction?" → feeds Character Relationships

The Proust Questionnaire is not just an entry gimmick. **It is a structured interview with your own identity universe.**

---

## Question Architecture

### The Full Set (35 questions)
OasisBio maintains a curated set of Proust questions, organized by theme:

| Theme | Example Questions |
|-------|------------------|
| **Self** | What is your most marked characteristic? What do you most value in your friends? |
| **Time** | If not yourself, who would you be? How would you like to die? |
| **World** | What is your idea of earthly happiness? What is your greatest fear? |
| **Work & Achievement** | What is your greatest achievement? What talent would you most like to have? |
| **Others** | What do you most dislike about your appearance? What do you consider your greatest weakness? |
| **Future** | What is your motto? What is the quality you most like in a man/woman? |

### First Question Selection (for Path B / sharing card visitors)

The first question shown to a sharing card visitor is **the same question the card creator answered**.
The visitor sees: "This is the question [username] answered. What's your answer?"

This creates continuity between the card and the experience — the visitor steps into the same moment.

### Daily Question Selection (for returning users)
The daily question is selected using this priority:

1. **Thematic continuity**: If yesterday's answer mentioned "time" or "the past," today's question explores that thread
2. **Unasked first**: Questions the user hasn't answered yet
3. **Revisit**: Questions answered more than 6 months ago (identity evolves)

---

## Sharing Card Design

### The Cardinal Rule

> Every sharing card must carry the OasisBio narrative anchor.
> A user sharing their card is not sharing a personality test result.
> They are sharing **a fragment of their identity universe**.

This distinction must be visible and felt — in the visual design, the copy, and the framing.

---

### Card Anatomy

```
┌─────────────────────────────────────────┐
│  [OasisBio wordmark]    [small logo]    │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │  "What is your greatest fear?"   │  │  ← Question (Proust source)
│  └───────────────────────────────────┘  │
│                                         │
│  "[User's answer, displayed as text]"  │  ← Answer (user's words, unchanged)
│                                         │
│  ─────────────────────────────────────  │
│  [Username] · [Era tag if set]          │  ← Identity anchor
│  Their identity universe →              │
│  oasisbio.oasiscompany.org/bio/[slug]   │  ← Call to curiosity
└─────────────────────────────────────────┘
```

### What Must Always Appear
- OasisBio wordmark (top-left)
- The question text (not just the answer)
- The user's answer, unedited
- A URL that leads to their identity page (or OasisBio homepage if no public page)
- The phrase "identity universe" or equivalent in the card language

### What Must Never Appear
- Personality type labels ("You are an INFJ...")
- Scores or rankings
- Comparison to other users
- "Take the test" language — it's not a test

---

## Card Visual Language

### Tone
- **Editorial, not playful.** Think *The New Yorker* quote cards, not BuzzFeed quizzes.
- **Monochromatic base** with one optional accent (per the design system)
- **Typography-led** — the answer text is the hero

### Format Options
| Format | Use Case |
|--------|----------|
| Portrait (4:5) | Instagram, Xiaohongshu |
| Square (1:1) | Twitter/X, Weibo |
| Wide (16:9) | Twitter/X banner, LinkedIn |

### Dark / Light Variants
Both must be available. Users choose, or the system detects their OS preference.

---

## Sharing Flow

```
User answers question
        ↓
"Your answer has been saved to your identity docs."
        ↓
[Generate Sharing Card] button (optional, never forced)
        ↓
Card preview appears → user can edit display name / toggle era tag
        ↓
Download PNG  or  Copy link (links to their OasisBio page)
        ↓
Native share sheet (mobile) or manual share (desktop)
```

**The sharing action is always optional.** The value of answering exists independently of sharing.

---

## Guest (Unauthenticated) Experience

Path B users arriving from a sharing card are initially guests.

The flow:
1. Guest sees the Proust question (same one from the card)
2. Guest can read and reflect — no barrier
3. To **answer** the question: prompted to create an account (framed as "save your answer")
4. After account creation: answer is saved, sharing card is generated

Account creation happens **after** the emotional investment of having an answer in mind — not before.

---

## OG Image Implementation\n\n### Overview\n\nPrimary rendering engine: **Satori** via Next.js `ImageResponse` (`next/og`).\n\nOG Image is the **main battlefield** for viral distribution — it is what shows up when a link is shared on WeChat, WhatsApp, Twitter, etc.\n\nThis document covers the OG Image layer only. Client-side PNG download is out of scope for this phase.\n\n---\n\n### Route\n\n```\nGET /api/og/proust/[username]\n```\n\n- `[username]` = the user's `Profile.username` (not their numeric ID)\n- Returns: `image/png` with dimensions `1200×630`\n- Cache: `public, max-age=86400, stale-while-revalidate=604800`\n\n---\n\n### Data Prerequisite\n\nA `ProustAnswer` model must exist in the schema before this route can function:\n\n```prisma\nmodel ProustAnswer {\n  id        String   @id @default(cuid())\n  userId    String   @map(\"user_id\")\n  question  String                  // question text (not a foreign key — self-contained)\n  answer    String\n  source    String   @default(\"proust\") // \"proust\" | \"daily\" | \"manual\"\n  isPublic  Boolean  @default(true)\n  createdAt DateTime @default(now())\n\n  user User @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@index([userId, createdAt(sort: Desc)])\n  @@map(\"proust_answer\")\n}\n```\n\nIf `ProustAnswer` does not exist yet, create it first before implementing the OG route.\n\n---\n\n### Satori Constraints (Pre-Approved Patterns)\n\nThese work reliably. The rest do not.\n\n```tsx\n// ✅ Works\ndisplay: flex\nflex-direction: row | column\nalign-items: flex-start | center | flex-end\njustify-content: flex-start | center | space-between\nwidth, height, padding, margin\nborder, border-radius\nbackground-color\nfont-size, font-weight, line-height, color\nletter-spacing\nfont-family (system serif only for MVP)\n```\n\n```tsx\n// ❌ Does NOT work — do not attempt\nposition: absolute\ngap (use margin instead)\nbox-shadow\nbackdrop-filter\nmin-width, max-width\ntransform\n```\n\n---\n\n### Card Visual Spec (Satori-Compatible)\n\n**Layout**: Single-column, centered, generous vertical padding.\n\n```\n┌──────────────────────────────────────────────────────────────────┐\n│                                                                  │\n│  OASISBIO · ─────────────────────────────────────               │\n│                                                                  │\n│  What is your idea of perfect happiness?                         │\n│  (small caps, letter-spaced, muted color)                        │\n│                                                                  │\n│                                                                  │\n│  "Sitting in a café in a city I don't know,                     │\n│   with a notebook and no agenda."                                │\n│  (large serif, dark, full width)                                │\n│                                                                  │\n│                                                                  │\n│  ─────────────────────────────────────────────────────────────   │\n│                                                                  │\n│  ceaserzhao · identity universe                                  │\n│  oasisbio.oasiscompany.org/bio/ceaserzhao                       │\n│  (small, muted)                                                  │\n│                                                                  │\n└──────────────────────────────────────────────────────────────────┘\n```\n\n**Typography** (MVP — system fonts only):\n- Question: system sans-serif, 20px, letter-spacing: 0.1em, uppercase, muted\n- Answer: system serif (Georgia / Times New Roman), 36px, line-height: 1.4\n- Footer: system sans-serif, 14px, muted\n\n**Color** (light mode default):\n- Background: `#FAFAF8` (warm off-white, not pure white)\n- Question text: `#888888` (medium gray)\n- Answer text: `#1A1A1A` (near-black)\n- Separator lines: `#E0E0E0`\n- Footer text: `#666666`\n- Accent (wordmark): `#1A1A1A`\n\n---\n\n### API Route Skeleton\n\n```tsx\n// app/api/og/proust/[username]/route.tsx\nimport { ImageResponse } from 'next/og'\nimport { getUserLatestProustAnswer } from '@/lib/proust'\n\nexport async function GET(\n  req: Request,\n  { params }: { params: { username: string } }\n) {\n  const { username } = params\n  const answer = await getUserLatestProustAnswer(username)\n\n  if (!answer) {\n    // Fallback: return OasisBio brand card (no personal answer yet)\n    return new ImageResponse(\n      <FallbackCard />,\n      { width: 1200, height: 630 }\n    )\n  }\n\n  return new ImageResponse(\n    <ProustCard answer={answer} />,\n    {\n      width: 1200,\n      height: 630,\n      headers: { 'Cache-Control': 'public, max-age=86400' }\n    }\n  )\n}\n```\n\n---\n\n### Integration with Bio Page\n\nThe bio page (`/bio/[username]`) must include:\n\n```tsx\n// in app/bio/[username]/page.tsx metadata\nexport async function generateMetadata({ params }) {\n  return {\n    openGraph: {\n      images: [`/api/og/proust/${params.username}`],\n    },\n  }\n}\n```\n\n---\n\n### Out of Scope (This Phase)\n\n- Client-side PNG download button\n- Card editor / preview modal\n- Dark mode variant (add after MVP)\n- Multiple card formats (portrait, square, wide)\n- Caching to Supabase Storage\n- Proust questionnaire UI\n\n---\n\n## Anti-Collapse Safeguards"

The Proust system could position-collapse OasisBio into "a quiz site" if not carefully managed.

| Risk | Safeguard |
|------|-----------|
| Users share cards, their followers think "personality test" | Card design never uses test language; always frames as "identity fragment" |
| Viral moment brings shallow users who don't return | Sharing card URL leads to identity page or homepage — every click is education |
| Platform gets compared to MBTI / 16Personalities | Public messaging always emphasizes *recording over time*, not *classification* |
| Users only do Proust and never go deeper | System surfaces depth prompts after accumulated answers |
| Proust experience overshadows the main product | Proust is never the homepage; direct visitors see the full product first |
