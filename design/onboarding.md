# Onboarding — Direct Registration Flow (Path A)

## Who This Is For

Users who arrive at OasisBio directly — through:
- The homepage
- Search engines
- Word of mouth
- Social media (but not via a Proust sharing card)

These users have **some prior intent**. They want to know what OasisBio is, and whether it's worth their time.

This is different from Path B users (see [`attention-migration.md`](./attention-migration.md)), who arrive via a sharing card with curiosity but no context.

---

## Design Principles

1. **Show, don't explain.** The product demo is the best explanation. Get the user doing something real as fast as possible.

2. **Minimal required fields.** The initial setup collects only what's necessary to create a functional identity — everything else can come later.

3. **Make the first output feel real.** A half-empty profile feels like a broken promise. The first session should end with something the user can actually look at and feel proud of.

4. **No feature tour.** We don't walk users through Era Timeline, World Builder, DCOS, etc. on day one. Depth is discovered, not introduced.

---

## Registration Flow

### Step 1 — Account Creation

Required fields only:
- Email (OTP, no password)
- Username (slug for their public page)

No avatar upload, no bio, no display name — those come after.

**Copy tone**: "Start building your identity universe. It takes 30 seconds."

---

### Step 2 — First OasisBio Setup

After email verification, the user is asked to create their first OasisBio with the minimum viable fields:

| Field | Required? | Note |
|-------|-----------|------|
| Title / Name | ✅ | This is the name of their identity — could be their real name, a username, or a persona |
| Tagline | Optional | One sentence. "What's one thing true about you right now?" |
| Visibility | ✅ | Public / Private — set the expectation immediately |

That's it. No cover image upload. No World Builder. No Era selector.

**What they see after**: Their OasisBio page, with the fields they just filled — sparse but real. A beginning.

---

### Step 3 — The First Invitation

Immediately after the initial setup, one gentle invitation:

> "Want to answer a question? It takes 2 minutes, and the answer becomes your first identity entry."

This leads to the **daily writing loop** — either a Proust question or a free write.

**This is optional.** The user can skip and explore the product freely.

---

## What Happens After

The onboarding is over. The user is now in the product.

No checklist. No "complete your profile" nudge. No feature tour popups.

What they see:
- Their sparse OasisBio page
- A nav that includes: Overview / Eras / World / Abilities / Docs / Nuwa
- If they haven't written anything: the first daily question, quietly presented

The product is there. The depth is there. They explore it at their own pace.

---

## Progressive Disclosure (Days 1–30)

As users engage, new surfaces are gently introduced:

| Trigger | What's Shown |
|---------|-------------|
| User saves first entry | "This is now in your Docs. Want to give it a folder?" |
| User has 3+ entries | "Your story is starting to take shape. Want to map your Eras?" |
| User opens Docs 5x | "You've been writing a lot. Nuwa can help you see patterns." |
| User has been active 7 days | "Your identity universe has been growing for a week. Here's what it looks like." |

The depth features (Era Timeline, World Builder, Ability Pool, Nuwa) are **earned through use**, not presented upfront.

---

## What Path A Users Can Do With Proust

Path A users are not excluded from the Proust system — it's available to them as an **optional feature**:

- Accessible from the Docs section ("Answer a Proust question")
- Can generate sharing cards at any time
- Daily question can replace or supplement the free writing prompt

Proust is enrichment for Path A users. It is the entry for Path B users. The distinction is in how it's presented, not in the functionality.

---

## Anti-Patterns to Avoid

| Anti-Pattern | Why It Fails |
|--------------|--------------|
| "Complete your profile X%" | Creates anxiety, not motivation. The identity is never "complete." |
| Feature tour ("Here's World Builder, here's Era Timeline...") | Overwhelming. Users need to feel, not be taught. |
| Forced avatar upload at registration | Friction before value. Let them upload when they care. |
| "Invite friends" prompt on day 1 | They have nothing to show yet. Sharing happens when there's something worth sharing. |
| Mandatory bio/tagline | Some users don't know what to write yet. That's fine — the identity emerges over time. |
