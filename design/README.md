# OasisBio Design Docs

This folder contains the foundational design thinking behind OasisBio —
not just "how it looks," but **why it exists and how it should feel**.

These documents are intended for:
- **Team members** building new features
- **Community contributors** who want to understand the philosophy before writing code
- **Future collaborators** — designers, writers, builders — who resonate with the vision

---

## Two Entry Paths

OasisBio has two distinct user entry paths. Understanding this distinction is essential before reading any other doc.

| Path | Source | First Experience |
|------|--------|-----------------|
| **Path A — Direct Registration** | Homepage, search, word of mouth | Normal onboarding → full product |
| **Path B — Sharing Card** | Someone shared a Proust card on social media | Proust question → account creation → gradual depth |

Both paths lead to the same place: a user's identity universe.
The Proust system and attention migration pattern are **Path B specific** — they are the viral growth layer, not the primary product flow.

---

## Document Index

| File | What It Covers | Relevant Path |
|------|----------------|---------------|
| [`vision.md`](./vision.md) | The core philosophy — why OasisBio exists | Both |
| [`onboarding.md`](./onboarding.md) | Direct registration user flow | Path A |
| [`attention-migration.md`](./attention-migration.md) | The "attention migration" pattern — viral entry model | Path B |
| [`proust-system.md`](./proust-system.md) | Proust Questionnaire system design & sharing card principles | Path B |
| [`daily-writing.md`](./daily-writing.md) | The daily lightweight writing loop | Both |

---

## Reading Order

If you're new here, read in this order:

1. `vision.md` — understand *what* we're building
2. `onboarding.md` — understand *how* direct users enter
3. `attention-migration.md` — understand *how* viral users enter
4. `proust-system.md` — understand the sharing card system
5. `daily-writing.md` — understand the retention loop

---

## Contributing

Design decisions are never final. If you have a reasoned disagreement or a better idea,
open a discussion or PR. Design docs evolve with the product.

The one thing that doesn't change: **OasisBio is an identity universe compiler, not a personality test.**
