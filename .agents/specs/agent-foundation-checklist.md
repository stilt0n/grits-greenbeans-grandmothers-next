# Implementation Checklist: Agent Foundation

Companion to `agent-foundation.md`. Read the spec first — this file is just trackable work items.

**For agents picking this up:** check off boxes as you complete them, in the same commit/PR as the work. If a step turns out to be wrong or to need splitting, edit the checklist and explain why in the commit message. If you discover something the spec didn't anticipate, update the spec, not just the checklist.

---

## Milestone 1 — AI SDK upgrade ✅ done

Landed via rebase before this checklist was authored. `ai` is on v6; `@ai-sdk/openai` upgraded alongside. `@ai-sdk/react` was **removed** (unused — nlux brings its own client) and will be reinstalled in Milestone 4 when we build `chat.client.tsx`. CVE-affected version is no longer in the lockfile. Bot is functionally working (the previous "broken" symptom was an exhausted API credit balance).

- [x] `ai` upgraded to v6
- [x] `@ai-sdk/openai` upgraded
- [x] `@ai-sdk/react` removed (was unused; reinstall in M4)
- [x] CVE-affected version cleared
- [x] Bot verified working end-to-end before migration begins

## Milestone 2 — Throwaway integration check ✅ done

The existing nlux integration goes through its own client; we still need to exercise `streamText` directly (the AI SDK 6 API surface our new code will use) before building UI on top of it.

- [x] Confirm `OPENAI_API_KEY` is set in the local `.env` and has credit (the previous "broken" symptom was an empty balance — don't repeat).
- [x] Write a throwaway script (`scripts/ai-smoke.ts`) that calls `streamText` with `gpt-5.4-mini` and prints streamed output.
- [x] Run it; confirm streaming works and the model id resolves.
- [x] If `gpt-5.4-mini` errors, try the dated suffix `gpt-5.4-mini-2026-03-17` and note which one we land on. — Initial runs failed with `model_not_found` because the OpenAI project lacked access; after granting access in the console (and ~16h propagation) `gpt-5.4-mini` resolves directly. No need for the dated suffix.
- [x] Delete the script (or keep it under `scripts/` if useful as a debug tool — author's call). — Kept under `scripts/` as a sanity-check tool for future SDK/model migrations. Confirmed nothing sensitive in the file.

## Milestone 3 — Tests + Storybook stories first

- [ ] Decide on the `chat.client.tsx` props shape (system prompt / context, optional `initialMessages`, anything else needed for the four UX states). Document inline.
- [ ] Create `components/grandmother-bot/chat.stories.tsx` (or appropriate path) with one story per UX state: idle-empty, idle-with-history, submitted, streaming, error.
- [ ] Stories use a mocked `useChat` (or the AI SDK's testing helpers if available) — no real network.
- [ ] Create `components/grandmother-bot/chat.test.tsx` with the assertions from the spec's testing section:
  - [ ] renders user message after submit
  - [ ] idle → submitted → streaming → idle on happy path
  - [ ] error state + retry on failure
- [ ] Tests should fail (component doesn't exist yet) — that's the contract.

## Milestone 4 — Build `chat.client.tsx`

- [ ] Reinstall `@ai-sdk/react` (removed during the AI SDK 6 rebase; needed for `useChat`). Pick a version compatible with React 18 — React 19 is a separate branch.
- [ ] Create `components/grandmother-bot/chat.client.tsx` — recipe-agnostic, takes context as a prop.
- [ ] Use shadcn/ui primitives where applicable (per AGENTS.md).
- [ ] Implement the four UX states: idle, submitted (thinking indicator), streaming (with blinking cursor), error (with retry).
- [ ] Make all stories render correctly.
- [ ] Make all component tests pass.

## Milestone 5 — Wire the route handler

- [ ] Create `app/api/grandmother-bot/route.ts` — POST handler using `streamText`.
- [ ] Create `lib/ai/model.ts` — exports model id constant.
- [ ] Create `lib/ai/prompt.ts` — system prompt + context assembly (extracted from existing `lib/actions/ai/`).
- [ ] Route handler accepts `{ messages, recipeId }` from the request body.
- [ ] Handler loads the recipe server-side via the existing loader (do not trust client-supplied recipe content).
- [ ] No `currentUser()` gate — endpoint is public.
- [ ] Write route handler tests (mocked `streamText`):
  - [ ] assembles system prompt + recipe context correctly
  - [ ] streams response through
  - [ ] does not 401 unauthenticated callers
  - [ ] snapshot test for prompt assembly with a fixture recipe
- [ ] End-to-end manual: hit the route via the throwaway client (or curl), confirm streaming reaches the browser/terminal.

## Milestone 6 — Replace nlux

- [ ] Update `components/grandmother-bot/chat-panel.client.tsx` to use the new `chat.client.tsx`.
- [ ] Pass `key={recipeId}` to the chat component (enforces the recipe-change reset rule).
- [ ] Verify chat-panel still owns the sheet; chat component does not know about the sheet.
- [ ] Add a panel-level test verifying `key={recipeId}` resets state on recipe change.
- [ ] Remove `@nlux/react` and `@nlux/themes` from `package.json`.
- [ ] Remove any nlux-specific CSS imports / theme files.
- [ ] `bun install` to update lockfile.
- [ ] Grep the repo for any remaining `nlux` references; remove.
- [ ] Delete the now-unused server actions in `lib/actions/ai/` (or whatever's left from the old integration). Confirm nothing else imports them.

## Milestone 7 — Polish + verify

Manual smoke on the recipe detail page:

- [ ] Open the sheet on a recipe page.
- [ ] Ask a question; confirm thinking indicator → streaming → idle transitions.
- [ ] Mid-streaming: input is disabled.
- [ ] Close the sheet, reopen — history is preserved.
- [ ] Navigate to a different recipe — history is cleared.
- [ ] Navigate away from any recipe page — history is cleared.
- [ ] Trigger an error (e.g. break the API key locally), confirm the error state renders with a working retry.

CI gates:

- [ ] `bun run check:types`
- [ ] `bun run lint`
- [ ] `bun test`
- [ ] `bun run build`
- [ ] `bun run build-storybook`
- [ ] `bun run format` (per AGENTS.md, must run before PR)

PR:

- [ ] Open PR against `main`. Title is short; body summarizes the change and links the spec.
- [ ] Confirm the diff does not contain any `@nlux/*` references, no Next 15 changes, no React 19 changes.

---

## Discoveries / scope changes

(Agents: append a short note here whenever you change the spec or discover something the spec didn't anticipate. Keep it tight — date, what changed, why.)

- **2026-05-04 — M2:** OpenAI project initially returned `model_not_found` for `gpt-5.4-mini`. Resolution was granting model access in the OpenAI console (not a code or SDK issue); changes took on the order of hours to propagate. Kept `scripts/ai-smoke.ts` rather than deleting — useful as a sanity check for future SDK/model migrations. Settled on the unsuffixed `gpt-5.4-mini` id as the spec intended.
