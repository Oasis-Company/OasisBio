# Attention Migration — The Entry Model

## Clarification: Two Entry Paths

OasisBio has **two distinct user entry paths**. This document covers **Path B** (viral entry).

| Path | Source | First Experience | Document |
|------|--------|-----------------|----------|
| **Path A — Direct Registration** | Homepage, search, word of mouth | Normal onboarding flow | See [`onboarding.md`](./onboarding.md) |
| **Path B — Sharing Card** | Someone shared a Proust card | Proust Questionnaire experience | This document |

Both paths eventually lead to the same place: a user's identity universe.
The difference is the entry temperature — Path A users arrive with intent, Path B users arrive with curiosity.

---

## The Problem We're Solving (Path B specific)

A user sees a beautiful sharing card on social media.
They click through.
They land on OasisBio.

They have **zero context**, **zero intent to "create"**, and **5 seconds of attention**.

If we greet them with a full product tour or a registration form, they leave.
If we greet them with a single, beautiful question — they might stay.

**Attention Migration** is the design pattern for this exact moment.

---

## The Core Idea

> Don't ask a curious visitor to build a universe.
> Ask them one question. Then another. Let the universe emerge.

The metaphor is geological: **sediment, not construction**.

An identity isn't built in a day. It accumulates — a question answered here,
a memory surfaced there, a small realization written down before bed.
Over time, the sediment hardens into something real.

OasisBio's job is to be the container that makes that accumulation feel worthwhile.

---

## The Three-Phase Migration (Path B)

### Phase 1 — Entry (Proust Questionnaire)

The sharing card link lands on a **standalone Proust experience** — no navbar, no product tour.

Just a question. Beautiful typography. A text field.

**Framing**: "Your past and your future" — not a test, not a profile, not a form.
A question that has been asked of great minds for a century, now asked of you.

The user answers.
- If not logged in: prompted to create an account to save their answer (account creation is framed as "save your universe")
- If already logged in: answer is saved immediately to their DCOS

A sharing card is generated from their answer.
The card carries the OasisBio identity — it educates the world about what this place is.

**What the user feels**: *I was asked a meaningful question. I answered it. Something beautiful was made from my answer.*

**What they do NOT feel**: pressure to complete anything.

---

### Phase 2 — Return (Daily Loop)

The next day (and every day after), the user returns to one of two things:

**Option A — Daily Question**
A new Proust question, or a question derived from their previous answers.
One question. No pressure. Takes 2 minutes.

**Option B — Free Writing**
"Add something to your docs." No structure. No format. A notepad that lives in their identity universe.

Both options accumulate into the DCOS system — their growing archive of self.

**What the user feels**: *This is like a journal, but it's building something.*

---

### Phase 3 — Depth Discovery (Organic Pull)

After enough accumulation, the system gently surfaces depth:

> "Your answers mention different versions of yourself across time.
> Want to give them a structure? → Create your first Era."

Or:

> "You've written about the world 12 times. Want to map it? → Open World Builder."

The user is **pulled** into depth by their own content, not pushed by onboarding flows.

**What the user feels**: *I already have something here. I want to make it more complete.*

---

## Design Rules for Attention Migration

1. **Never show all features at once.** Depth is revealed by the user's own content, not by a feature tour.

2. **Every entry point leads somewhere meaningful.** An answered question becomes a DCOS entry. A shared card has a permanent URL. Nothing is a dead end.

3. **Time is a feature.** The difference between your answer today and your answer in a year is data. Design for longitudinal value.

4. **Exit gracefully.** If a user doesn't come back for a month, welcome them without guilt. Their past answers are waiting.

5. **Proust is the entry, not the product.** Path B users who only ever answer Proust questions are still valid OasisBio users. The migration to depth is an invitation, not a requirement.

---

## What This Is Not

- Not a gamification scheme (no streaks, no badges, no pressure)
- Not an onboarding checklist (no "Complete your profile 40%")
- Not a forced funnel (users can skip any phase indefinitely)
- Not the primary onboarding flow (that's [`onboarding.md`](./onboarding.md))

The migration happens because the product earns it — not because the UI demands it.
