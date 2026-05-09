# Implementation Checklist: Agent Foundation

Companion to `agent-foundation.md`. Read the spec first — this file is just trackable work items.

**For agents picking this up:** check off boxes as you complete them, in the same commit/PR as the work. If a step turns out to be wrong or to need splitting, edit the checklist and explain why in the commit message. If you discover something the spec didn't anticipate, update the spec, not just the checklist.

---

## Milestone 1 — AI SDK upgrade ✅ done

Landed on `main` via PR #135 before this branch. `ai` is on v6; `@ai-sdk/openai` upgraded alongside. `@ai-sdk/react` was **removed** (unused — nlux brings its own client) and will be reinstalled in M3. CVE-affected version is no longer in the lockfile. Bot is functionally working (the previous "broken" symptom was an exhausted API credit balance).

- [x] `ai` upgraded to v6
- [x] `@ai-sdk/openai` upgraded
- [x] `@ai-sdk/react` removed (was unused; reinstall in M3)
- [x] CVE-affected version cleared
- [x] Bot verified working end-to-end before migration begins

## Milestone 2 — Throwaway integration check ✅ done

The existing nlux integration goes through its own client; we still need to exercise `streamText` directly (the AI SDK 6 API surface our new code will use) before building UI on top of it.

- [x] Confirm `OPENAI_API_KEY` is set in the local `.env` and has credit.
- [x] Write a throwaway script (`scripts/ai-smoke.ts`) that calls `streamText` with `gpt-5.4-mini` and prints streamed output.
- [x] Run it; confirm streaming works and the model id resolves.
- [x] If `gpt-5.4-mini` errors, try the dated suffix and note which one we land on. — Initial runs failed with `model_not_found` because the OpenAI project lacked access; after granting access in the console (and ~16h propagation) `gpt-5.4-mini` resolves directly. No dated suffix needed.
- [x] Keep the script under `scripts/` as a sanity-check tool for future SDK/model migrations.

## Milestone 3 — Install AI Elements + dependencies

The earlier M3 (hand-built primitives + Storybook contract) was reset on 2026-05-09 in favor of AI Elements. See spec "Why" section.

- [ ] Install `@ai-sdk/react` at a React-18-compatible version (React 19 is a separate branch).
- [ ] Install Vercel AI Elements via the shadcn registry. Default install location is `components/ai-elements/`. Commit the generated files — they're now project code.
- [ ] Confirm peer deps the registry pulled in (`streamdown`, etc.) are in `package.json`, not just transitively present.
- [ ] Verify the installed components inherit the existing shadcn theme — render one in isolation (e.g. drop a `<Conversation>` with a hardcoded `<Message>` into a throwaway page or story) and confirm colors/spacing look right with no extra setup.
- [ ] No app-level wiring yet — this milestone is just registry install + smoke render.

## Milestone 4 — Build `chat.client.tsx`

- [ ] Create `components/grandmother-bot/chat.client.tsx`. Recipe-agnostic. Takes `{ context: string; initialMessages?: Message[]; api?: string; className?: string }`.
- [ ] Compose `Conversation` / `ConversationContent` / `Message` / `PromptInput` / `PromptInputSubmit` / `Response` from `components/ai-elements/`.
- [ ] Drive everything from `useChat()` directly — no wrapper hook. Pass `status` to `PromptInputSubmit`.
- [ ] Verify the four UX states render correctly:
  - [ ] **Idle**: input enabled, no spinners.
  - [ ] **Submitted**: thinking indicator visible (Elements provides this; confirm it appears).
  - [ ] **Streaming**: tokens render incrementally via `Response` (Streamdown handles partial chunks); input disabled.
  - [ ] **Error**: error visible with a working retry affordance from `useChat`.
- [ ] Write component tests (`components/grandmother-bot/__tests__/chat.test.tsx`). Mock at the network layer (fetch stub or MSW), **not** by mocking `useChat`:
  - [ ] renders user message after submit
  - [ ] idle → submitted → streaming → idle on a happy path
  - [ ] error state + retry on failure
- [ ] (Optional) Add a Storybook story only if there's a composition behavior worth pinning that the registry site doesn't already document.

## Milestone 5 — Wire the route handler

Two pieces of M5 are written **test-first** (see spec "Testing strategy" — these are the spots where the test genuinely shapes the implementation):

- **Prompt assembly** (`lib/ai/prompt.ts`): write the snapshot test first against a fixture recipe, eyeball the rendered prompt, then implement.
- **Route handler security invariants**: write the failing tests for `does not 401 unauthenticated callers` and `loads recipe server-side; ignores client-supplied recipe content` **before** the route exists. These are the assertions we don't want to ship without.

The streaming / happy-path tests can be written after — they're regression coverage, not design pressure.

Steps in order:

- [ ] Create `lib/ai/model.ts` — exports model id constant. (Trivial; not test-driven.)
- [ ] **Test-first:** add `lib/ai/__tests__/prompt.test.ts` with a snapshot test against a fixture recipe. Test fails (no module yet).
- [ ] Create `lib/ai/prompt.ts` — system prompt + context assembly (extracted from existing `lib/actions/ai/`). Make the snapshot test pass; review the snapshot output as part of the diff.
- [ ] **Test-first (security):** add `app/api/grandmother-bot/__tests__/route.test.ts` with two failing tests:
  - [ ] does not 401 unauthenticated callers (no auth header → 200 / streams)
  - [ ] ignores client-supplied recipe content; loads recipe server-side via the loader (pass a request body with a tampered `recipeContent` field and assert the assembled prompt uses the loader's value, not the client's)
- [ ] Create `app/api/grandmother-bot/route.ts` — POST handler using `streamText`. Accepts `{ messages, recipeId }`. Loads the recipe via the existing loader. No `currentUser()` gate. Make the two security tests pass.
- [ ] Add the remaining route handler tests (written after — regression coverage):
  - [ ] assembles system prompt + recipe context correctly (uses the prompt module; this is mostly an integration check)
  - [ ] streams response through (mocked `streamText`)
- [ ] End-to-end manual: temporarily mount `chat.client.tsx` against the real route on a recipe page, confirm streaming reaches the browser.

## Milestone 6 — Replace nlux + delete dead code

- [ ] Update `components/grandmother-bot/chat-panel.client.tsx` to use the new `chat.client.tsx`.
- [ ] Pass `key={recipeId}` to the chat component (enforces the recipe-change reset rule).
- [ ] Verify chat-panel still owns the sheet; chat component does not know about the sheet.
- [ ] Add a panel-level test verifying `key={recipeId}` resets state on recipe change.
- [ ] Remove `@nlux/react` and `@nlux/themes` from `package.json`.
- [ ] Remove any nlux-specific CSS imports / theme files.
- [ ] Delete `components/chat/` (entire directory — `chat-bubble.tsx`, `chat-input.client.tsx`, `chat.client.tsx`, `index.ts`).
- [ ] Delete `stories/chat-bubble.stories.ts`, `stories/chat-input.stories.tsx`, `stories/chat.stories.tsx`.
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

- **2026-05-04 — M2:** OpenAI project initially returned `model_not_found` for `gpt-5.4-mini`. Resolution was granting model access in the OpenAI console (not a code or SDK issue); changes took on the order of hours to propagate. Kept `scripts/ai-smoke.ts` rather than deleting — useful as a sanity check for future SDK/model migrations.
- **2026-05-09 — pivot to AI Elements:** Original M3 (hand-built `chat-primitives/` rename + container/view split + Storybook contract + stub tests) was reset. Switched to Vercel AI Elements: shadcn-style registry built on `@ai-sdk/react`, with `Conversation` / `Message` / `PromptInput` / `Response` (Response uses Streamdown for streaming-aware markdown). This collapses the hand-built primitives, the markdown-rendering subtask, the four-state Storybook contract, and the container/view split. The `use-grandmother-chat` hook seam was dropped (YAGNI — easy to add back; tests can mock at the network layer). Kept commits: spec (`0383356`), smoke script (`5cd4ad6`), `.gitignore` for `/storybook-static` (`a9705eb`).
- **2026-05-09 — chat-primitives rename reverted:** the `components/chat/` → `components/chat-primitives/` rename was part of the reset M3 commit. Files are back at `components/chat/` and will be deleted in M6 rather than renamed.
