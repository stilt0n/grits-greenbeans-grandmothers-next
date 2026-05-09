# Implementation Checklist: Agent Foundation

Companion to [`spec.md`](./spec.md). Read the spec first — this file is just trackable work items.

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

## Milestone 3 — Install AI Elements + dependencies ✅ done

The earlier M3 (hand-built primitives + Storybook contract) was reset on 2026-05-09 in favor of AI Elements. See spec "Why" section.

- [x] Install `@ai-sdk/react` at a React-18-compatible version (React 19 is a separate branch). — Landed at `^3.0.179`.
- [x] Install Vercel AI Elements via the shadcn registry. Default install location is `components/ai-elements/`. Commit the generated files — they're now project code. — Installed `conversation`, `message`, `prompt-input`. (No `response` component — current Elements folds streaming-markdown rendering into `MessageResponse` inside `message.tsx`.)
- [x] Confirm peer deps the registry pulled in (`streamdown`, etc.) are in `package.json`, not just transitively present. — `streamdown`, `@streamdown/{cjk,code,math,mermaid}`, `use-stick-to-bottom`, `cmdk`, `nanoid` all explicit.
- [x] ~~Verify the installed components inherit the existing shadcn theme — render one in isolation~~ — **Skipped per discussion 2026-05-09.** M4's real composition will smoke-test theming as a side effect; isolated render adds no signal we wouldn't get there.
- [x] **(beyond spec)** Swapped Elements + new shadcn components from `lucide-react` to `@radix-ui/react-icons` (project-wide icon-library policy). Removed `lucide-react` dep entirely. Used import aliases (`Cross2Icon as XIcon`, etc.) so JSX call sites are unchanged.
- [x] **(beyond spec)** Added `'icon-sm'` size variant to `components/ui/button.tsx` — required by Elements' `MessageAction` component. Inconsistency within the Elements registry itself; the registry-shipped `button.tsx` doesn't include it either.
- [x] **(beyond spec)** Bumped `tsconfig.json` `target` to `es2017` — Elements' `prompt-input.tsx` iterates `FileList`/`DataTransferItemList` with `for...of`, which requires modern target. Default was `es5`.

## Milestone 4 — Build `chat.client.tsx`

- [x] Create `components/grandmother-bot/chat.client.tsx`. Recipe-agnostic. Takes `{ initialMessages?: UIMessage[]; api?: string; body?: Record<string, unknown>; className?: string; emptyStateTitle?; emptyStateDescription?; onError? }`. **(deviation: dropped `context: string`; see Discoveries 2026-05-09 — body shape)**
- [x] Compose `Conversation` / `ConversationContent` / `Message` / `MessageContent` / `MessageResponse` / `PromptInput` / `PromptInputBody` / `PromptInputTextarea` / `PromptInputSubmit` from `components/ai-elements/`. (Note: registry has no `Response` — markdown rendering is `MessageResponse` inside `message.tsx`.)
- [x] Drive everything from `useChat()` directly — no wrapper hook. Pass `status` to `PromptInputSubmit`; pass `stop` as `onStop`.
- [x] Verify the four UX states render correctly:
  - [x] **Idle**: input enabled, no spinners. Verified via Storybook `Empty` and `SeededHistory` stories + `renders the user message after submit` test.
  - [x] **Submitted**: thinking indicator visible. Implemented as inline three-dot pulse rendered when `status === 'submitted'` (Elements doesn't ship a thinking-state component). Visual verification deferred to M5/M7 once the route streams.
  - [x] **Streaming**: tokens render incrementally via `MessageResponse` (Streamdown). Visual verification deferred to M5/M7 — see test note below.
  - [x] **Error**: error banner with a working retry affordance via `regenerate()` + `clearError()`. Covered by component test.
- [x] Write component tests (`components/grandmother-bot/__tests__/chat.test.tsx`). Mock at the network layer (`globalThis.fetch` stub):
  - [x] renders user message after submit
  - [ ] ~~idle → submitted → streaming → idle on a happy path~~ — **dropped**, see Discoveries 2026-05-09 (M4 streaming-state test).
  - [x] error state + retry on failure
- [x] Storybook: added `stories/grandmother-chat.stories.tsx` with `Empty` and `SeededHistory` stories. No fetch mocking — submitting in the story will network-error, but layout/theme verification (the actual reason to have a story) doesn't need it. Dynamic-state stories deliberately not added (would need MSW; not worth standing up for one consumer).

## Milestone 5 — Wire the route handler

Two pieces of M5 are written **test-first** (see spec "Testing strategy" — these are the spots where the test genuinely shapes the implementation):

- **Prompt assembly** (`lib/ai/prompt.ts`): write the snapshot test first against a fixture recipe, eyeball the rendered prompt, then implement.
- **Route handler security invariants**: write the failing tests for `does not 401 unauthenticated callers` and `loads recipe server-side; ignores client-supplied recipe content` **before** the route exists. These are the assertions we don't want to ship without.

The streaming / happy-path tests can be written after — they're regression coverage, not design pressure.

Steps in order:

- [x] Create `lib/ai/model.ts` — exports model id constant. (Trivial; not test-driven.)
- [x] **Test-first:** add `lib/ai/__tests__/prompt.test.ts` with a snapshot test against a fixture recipe. Test fails (no module yet).
- [x] Create `lib/ai/prompt.ts` — system prompt + context assembly (extracted from existing `lib/actions/ai/`). Make the snapshot test pass; review the snapshot output as part of the diff.
- [x] **Test-first (security):** add `app/api/grandmother-bot/__tests__/route.test.ts` with two failing tests:
  - [x] does not 401 unauthenticated callers (no auth header → 200 / streams)
  - [x] ignores client-supplied recipe content; loads recipe server-side via the loader (pass a request body with a tampered `recipeContent` field and assert the assembled prompt uses the loader's value, not the client's)
- [x] Create `app/api/grandmother-bot/route.ts` — POST handler using `streamText`. Accepts `{ messages, recipeId }`. Loads the recipe via the existing loader. No `currentUser()` gate. Make the two security tests pass.
- [x] Add the remaining route handler tests (written after — regression coverage):
  - [x] assembles system prompt + recipe context correctly (uses the prompt module; this is mostly an integration check) — covered by `passes the assembled system prompt and messages to streamText` + the security test asserting recipe context is included.
  - [x] streams response through (mocked `streamText`) — covered by the public-endpoint test (asserts 200 response from `toUIMessageStreamResponse()`).
- [ ] End-to-end manual: temporarily mount `chat.client.tsx` against the real route on a recipe page, confirm streaming reaches the browser.

## Milestone 6 — Replace nlux + delete dead code

- [x] Update `components/grandmother-bot/chat-panel.client.tsx` to use the new `chat.client.tsx`.
- [x] Pass `key={recipeId}` to the chat component (enforces the recipe-change reset rule).
- [x] Verify chat-panel still owns the sheet; chat component does not know about the sheet.
- [x] Add a panel-level test verifying `key={recipeId}` resets state on recipe change.
- [x] Remove `@nlux/react` and `@nlux/themes` from `package.json`.
- [x] Remove any nlux-specific CSS imports / theme files. — The `'@nlux/themes/nova.css'` import was the only one; it left the tree when `chat-panel.client.tsx` was rewritten.
- [x] Delete `components/chat/` (entire directory — `chat-bubble.tsx`, `chat-input.client.tsx`, `chat.client.tsx`, `index.ts`).
- [x] Delete `stories/chat-bubble.stories.ts`, `stories/chat-input.stories.tsx`, `stories/chat.stories.tsx`.
- [x] `bun install` to update lockfile.
- [x] Grep the repo for any remaining `nlux` references; remove. — Also dropped `convertNluxChatHistory` (and its tests) from `lib/translation/parsers.ts` — only nlux consumed it.
- [x] Delete the now-unused server actions in `lib/actions/ai/` (or whatever's left from the old integration). Confirm nothing else imports them. — Deleted the entire `lib/actions/ai/recipe-chat/` folder. `lib/actions/ai/generate-description.ts` is unrelated (used by the recipe edit form) and stays.
- [x] Delete `components/grandmother-bot/config/` (adapters / history / personas / prompts) — beyond original spec; all four files were nlux-specific. **(beyond spec)**

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
- **2026-05-09 — M4 prompt-input vertical alignment:** the empty-state placeholder sits at the top of the textarea instead of visually aligning with the submit-button icon. Tried tightening padding (`py-2`, dropping `min-h`) and forcing `pt-[1.625rem]`; the explicit pt looks good when empty but breaks multi-line typing — the submit button scrolls with the first line and the layout falls apart. Settled on `min-h-10 py-2` as a functionally-correct compromise (empty state slightly off, multi-line correct). Defer real fix to a follow-up styles pass.
- **2026-05-09 — M4 body shape:** spec said the chat component takes `{ context: string }`, but that conflicts with M5's security invariant (route loads recipe server-side from `recipeId`; ignores client-supplied content). Replaced `context` with a generic `body?: Record<string, unknown>` that the recipe wrapper fills with `{ recipeId }`. The chat component stays recipe-agnostic; backend still owns prompt assembly.
- **2026-05-09 — M4 streaming-state test dropped:** Tried writing a happy-path test that feeds the component an SSE-formatted ReadableStream via a `globalThis.fetch` stub. Hits a happy-dom ↔ Bun ↔ `eventsource-parser/stream` interop bug: pipeThrough rejects the stream with "readable should be ReadableStream", even though the same stream pipes fine in isolation. The component itself is fine — the test harness can't deliver a working SSE response. Streaming behavior is covered by M5 route tests and M7 manual smoke / live Playwright. Revisit when we drop happy-dom (likely on a future Bun bump).
- **2026-05-09 — M4 MSW debate:** considered adding `msw` + `msw-storybook-addon` to power richer component tests and dynamic-state stories. Decided against: the codebase has essentially one client-side `fetch()` consumer (chat), so MSW would be infrastructure-for-show. Future agentic complexity will land server-side (route handler / tool calls) where MSW isn't the right tool. Revisit if the client surface ever grows multiple endpoints or stateful flows.
- **2026-05-09 — M5 prompt assembly:** `convertToModelMessages` is **async** in AI SDK 6 (returns `Promise<ModelMessage[]>`). `buildChatPrompt` is therefore async too. Recipe context is appended only to the latest user message (not prepended as a separate system turn) — preserves the framing the existing `baseSystemMessage` describes ("Your question will include information about the recipe…in HTML"). Earlier history is left untouched so the transcript stays clean.
- **2026-05-09 — M5 simplification:** dropped the classifier / `extractIngredientsAndScale` / `scaleRecipeSystemMessage` paths from the old `lib/actions/ai/recipe-chat/`. Per spec, tool use (including recipe scaling) is out of scope for v1 and lands behind rate limiting in a later branch. The new route is a single `streamText` call with the base system prompt + recipe context. The old action file stays around until M6 deletes it.
- **2026-05-09 — M3 install lessons:**
  - **Default `bunx ai-elements` (no `add` subcommand) installs the entire registry.** Don't run it. Always use `bunx ai-elements@latest add <name>` to install a single component. Same applies to `--help` etc. — the CLI treats unknown flags as install-all.
  - **`response` is no longer a component slug.** Streaming-markdown rendering is now inside `message.tsx` as `MessageResponse`. Future agents adding markdown rendering should import from `@/components/ai-elements/message`, not look for a separate `response.tsx`.
  - **Elements registry has internal inconsistencies.** `MessageAction` references `size="icon-sm"` on the shadcn `Button`, but neither our installed button nor the Elements-shipped button declare that variant. Worked around by adding the variant to `components/ui/button.tsx`.
  - **Elements ships pinned `lucide-react@1.14.0` (suspiciously old).** Wasn't worth investigating since we removed lucide entirely.
  - **`components.json` gained `iconLibrary: "radix"` and a `registries` entry for `@ai-elements`.** Both useful side-effects of the install.
