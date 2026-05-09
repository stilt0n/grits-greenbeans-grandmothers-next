# Specs

This folder holds design specs for **large, multi-step features** — work that benefits from being thought through before code starts, and from leaving a trail future-us (or future-agent) can read back later.

Small bug fixes, one-off cleanups, and individually-reviewable changes don't belong here. If the work fits in a single PR and the diff explains itself, skip the spec.

## When to write a spec

Reach for a spec when at least one of these is true:

- **The work spans more than ~3 distinct PRs/commits.**
- **There are real architectural choices to make** (e.g. "where does this live", "API route vs server action", "what gets persisted").
- **You want to capture _why_ — constraints, trade-offs, things deliberately deferred —** so the next person doesn't relitigate.
- **The change touches multiple subsystems** (DB schema + API + UI + tests).
- **There's a meaningful chance you'll abandon or pivot mid-implementation** and want a record of the original framing.

If you're just adding a Zod field, fixing a regression, or renaming a variable — don't open a spec. The PR description is enough.

## Layout

Each spec lives in its own folder, named for the feature/branch:

```
.agents/specs/
  README.md                       ← this file
  agent-foundation/
    spec.md                       ← the design doc
    checklist.md                  ← trackable work items
  <next-feature>/
    spec.md
    checklist.md
```

One folder per spec keeps the top-level navigable as we accumulate more of them. Specs stay in source control after they ship — they're a record of decisions, not throwaway planning.

## The two-file convention

We split each spec into a **spec** (the _why_) and a **checklist** (the _what_) for a reason:

- The **spec** is for understanding. It's read by humans deciding whether the design holds up, and by agents that need context before they can make judgment calls. It changes when the _plan_ changes — when something is discovered mid-implementation that the original framing got wrong.
- The **checklist** is for tracking. It's the punch list. Boxes get checked off in the same commit as the work; new boxes get added when scope grows; boxes get crossed out (with a reason) when scope shrinks.

Mixing the two leads to a doc that's hard to read either way: the _why_ gets buried in checkboxes, and the _what_ loses the rationale that made it possible to amend it intelligently.

### `spec.md` structure

There's no rigid template, but these sections tend to earn their keep:

- **Status / branch / last updated** — at the top, so a stale spec is easy to spot.
- **Why** — the motivation. What's broken or missing. _Lead with this._
- **Goals (v1)** — what shipping looks like, scoped tightly.
- **Non-goals** — what's deliberately out of scope. This is often the most valuable section: it's where future scope creep gets headed off.
- **Current state audit** — what exists today that the change interacts with. Include file paths.
- **Target architecture** — where new code will live and the shape of its interfaces. A small ASCII tree often beats prose.
- **Key shape decisions** — the things you'd otherwise have to re-derive. _Why_ this lives behind an API route vs. a server action; _why_ there's no hook seam; etc.
- **Testing strategy** — what gets tested, what gets mocked, what gets manually smoked. Calls out anything written test-first vs. test-after.
- **Milestones** — the rough sequence (M1, M2, …). The granular work items live in `checklist.md`, not here.
- **Open questions** — things you don't have an answer for yet. Honest is better than confident.
- **Out-of-scope reminders** — same as non-goals but specifically the ones you keep being tempted to sneak in. Future-you will thank present-you.

### `checklist.md` structure

- One section per milestone, mirroring the spec's milestones.
- Use GitHub-flavored task list syntax (`- [ ]` / `- [x]`). Strikethrough (`~~…~~`) for items deliberately dropped, with a one-line reason.
- A **Discoveries / scope changes** section at the bottom for short, dated notes when the spec or checklist had to change mid-flight (e.g. _"2026-05-09 — pivot to AI Elements; original M3 reset"_). These are the breadcrumbs that explain the diff history later.

## How agents should treat specs

- **Read the spec first.** If you're picking up work mid-stream, the spec gives you the framing the checklist alone can't.
- **Update both as you go.** Check off boxes when work lands. If you discover something the spec didn't anticipate, update **the spec** — not just the checklist.
- **Append to Discoveries** when you change scope. Date + one or two lines. This is what makes the spec a useful artifact six months later instead of a stale wishlist.
- **Specs are not contracts.** If the original plan turns out to be wrong, change it; don't follow it off a cliff.

## Completed specs

For now, completed specs stay in place. If we accumulate enough that this folder feels noisy, we'll add a `completed/` subdirectory and move them in — but not preemptively.
