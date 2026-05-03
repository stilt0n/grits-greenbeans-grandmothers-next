# Spec: Agent Foundation

**Status:** draft
**Branch:** `agent-foundation`
**Author:** mleino (with Claude)
**Last updated:** 2026-05-03 (AI SDK 6 upgrade landed via rebase)
**Implementation checklist:** [`agent-foundation-checklist.md`](./agent-foundation-checklist.md) — trackable work items, milestone-by-milestone. Agents should update it as they complete steps, and update **this spec** (not just the checklist) when they discover something it didn't anticipate.

## Why

`@nlux/react` got us a working chat fast, but it caps us at React 18 (blocking the Next 15 / React 19 upgrade), and its abstractions get in the way of building grandmother-bot into a real agent. This is the foundation for everything agentic that comes after, so the goal is to **replace the chat plumbing without expanding scope** — keep today's user-visible behavior, but on infrastructure that can grow.

(Earlier framing said the OpenAI integration was broken from API drift. After the AI SDK 6 upgrade and topping up API credits, the bot is actually working — the failure was a billing issue, not a code issue. The migration motivation stands on its own: remove nlux to unblock React 19 and to give us a chat layer we can extend with tool calls.)

A separate follow-up branch will then do the Next 15 + React 19 upgrade.

## Goals (v1)

1. Remove `@nlux/react` and `@nlux/themes` entirely.
2. Replace the nlux UI with chat plumbing built directly on Vercel AI SDK 6 (already upgraded).
3. Keep the chat surface a modular component, decoupled from the left sheet — so future placements (e.g. a `/chat` route, a recipe-card popover) cost nothing.
4. Get on a current OpenAI mini model: `gpt-5.4-mini` (no date suffix — let OpenAI route to current).
5. Keep capabilities at parity with today: ask questions about the current recipe, get back streamed markdown.

## Non-goals (deferred)

- **Persistence of chat history.** Ephemeral by design — see Persistence section. Not just deferred; persistence raises real UX questions (unbounded history, recipe-keying vs. global history, decoupling chat from a specific recipe) that we don't want to answer under time pressure.
- **Tool use / function calling.** No tools in v1. The route handler should be structured so adding tools later is a localized change. (See "Tool architecture" below for the shape we're prepping for — first anticipated tool is recipe math, currently jerry-rigged as separate prompts.)
- **Multi-model routing.** Single model in v1; the AI SDK provider abstraction means we can swap later.
- **Generative UI / structured outputs.** Plain streamed markdown.
- **Standalone `/chat` route.** Sidebar only — but the component must not assume sidebar.
- **Migration off OpenAI** (GLM, etc.) — evaluate after v1 ships.
- **Next 15 / React 19 upgrade** — separate branch once nlux is gone.

## Current state audit

- `components/grandmother-bot/chat-panel.client.tsx` — left-sheet wrapper around nlux's `<AiChat />`.
- `lib/actions/ai/` — server action(s) that call OpenAI. Currently working (the previous "broken" symptom was an exhausted API credit balance, not code).
- `convertRecipeToPromptContext` in `lib/translation/parsers.ts` — turns a loaded recipe into prompt context. Reusable as-is.
- Deps to remove: `@nlux/react`, `@nlux/themes`.
- Deps already current: `ai` v6, `@ai-sdk/openai` — upgraded ahead of this work via rebase. CVE-affected version is no longer in the lockfile.
- `@ai-sdk/react` was **removed** during the rebase (unused — nlux brings its own client). Reinstall it in Milestone 4 when we build `chat.client.tsx` on top of `useChat`.

(Verify exact file paths and shape during implementation — this audit is from spec time, not gospel.)

## Target architecture

```
components/grandmother-bot/
  chat-panel.client.tsx         # left-sheet placement (existing surface)
  chat.client.tsx               # NEW: presentation-only chat UI (messages, input, streaming)
  use-grandmother-chat.ts       # NEW: thin wrapper over AI SDK's useChat (system prompt, recipe context)

app/api/grandmother-bot/
  route.ts                      # NEW: streaming POST handler; AI SDK streamText; auth check; recipe context

lib/ai/
  prompt.ts                     # system prompt + context assembly (extracted from current actions)
  model.ts                      # model id constant; one place to swap
```

Key shape decisions:

- **Route handler, not server action.** AI SDK's `useChat` expects a streaming HTTP endpoint. This also fits our design philosophy (see below): server actions are for client→server CRUD that extends the UI; an agent loop is closer to a standalone service and belongs behind an API route.
- **Recipe context flows via request body**, not URL. Client passes `recipeId`; handler loads the recipe server-side (don't trust client-supplied recipe content).
- **`chat.client.tsx` is recipe-agnostic.** It takes a context/system-prompt prop and exposes pure chat behavior. It does not import recipe types, doesn't know about sheets, and doesn't know about routes. `chat-panel.client.tsx` is the recipe-aware wrapper that loads the recipe, builds the context, and owns the sheet. A future `/chat` route would be a different wrapper, not a new chat component.
- **Public endpoint.** Grandmother bot is accessible to all visitors, not just signed-in users. The route handler does not gate on `currentUser()`. Rate limiting is **not** in v1 but is a hard prerequisite before any tool calls ship (see Tool architecture).

## Design philosophy: server actions vs API routes

Where new server-side logic lives:

- **Server actions** — for client→server CRUD that's an extension of the UI. `FormData` in, simple value or `undefined` out. The shape exists because of the React-server boundary, not because the work is interesting.
- **API routes** — for callers that aren't a React component (streaming chat transports, webhooks, future external consumers, agent loops), or for work that would naturally exist as a standalone service if extracted.

The repository layer is shared by both. Validation (Zod schemas in `lib/translation/schema.ts`) is shared by both. We don't double-wrap the repository in a service just because something is now behind an API route.

## Tool architecture (prep for v2; no tools in v1)

When tools land, they live in `lib/ai/tools/` as a **peer** to loaders and actions, not a layer on top of either. All three call the repository directly.

- **Reads:** tools usually want a different projection than the UI does (smaller payloads, LLM-friendly fields, different ranking). Don't presume loader reuse — reuse only when the shape genuinely matches. A tool that says "find me a side dish that pairs with this" wants something different from a recipe-search loader.
- **Writes:** out of scope, by policy. Grandmother bot is public; write permissions are family/admin only. A future write-capable agent would be a separate, authenticated endpoint with its own tool surface — not a flag on this one.
- **Auth in tools:** inherits the surrounding request context. Since the chat endpoint is public, tools must assume an unauthenticated caller and only touch data that's safe for anyone to see (e.g. published recipes — confirm loaders/repository queries don't leak drafts before exposing them).
- **Rate limiting must land before tools do.** An unauthenticated agent endpoint without rate limiting + tool calls = unbounded loop-burn risk.

## Persistence — ephemeral, with rules

Persistence is intentionally not in scope and not on the near roadmap. The UX questions it raises (unbounded history, recipe-keyed vs. global, chat decoupled from a specific recipe) are real and need their own design pass. Until then:

**The rules:**

- Closing the sheet **preserves** chat history (you can reopen and pick up where you left off).
- Navigating away from the recipe page **clears** history.
- Switching to a different recipe **clears** history (each recipe gets a fresh chat).

**How that falls out of the architecture, with no extra machinery:**

- Chat state lives in React state owned by a component mounted on the recipe page. Sheet open/close just toggles visibility — state is not unmounted.
- Route navigation unmounts the page → state is gone.
- Recipe-change reset is achieved by passing `key={recipeId}` to the chat component. Different recipe → React tears down and remounts → fresh history. No store, no context, no effect coordination.

**No localStorage.** It would only matter for cross-visit continuity, which is the persistence question we're explicitly not answering. Skip it.

**The route handler accepts `messages: Message[]` from the client** (AI SDK convention). If we ever revisit persistence, that contract is unchanged — only the source of `initialMessages` differs.

## UX states

The visible behavior we're committing to. Build for these explicitly; don't let them emerge accidentally.

- **Idle** — input enabled, no spinners, history (if any) visible.
- **Submitted** (`status === 'submitted'`) — request sent, no tokens yet. Show a small "thinking…" indicator. With a mini model this is sub-second, but silence here feels broken.
- **Streaming** (`status === 'streaming'`) — tokens render as they arrive (no animation needed for the tokens themselves). Append a blinking cursor to the in-progress assistant message until the stream completes. Input disabled during streaming.
- **Error** — visible failure with a retry affordance. No silent failures.

`useChat` exposes `status` and `error` directly — these states are reads off the hook, not a custom state machine.

Out of scope for v1: virtualized message lists (only valuable once history grows, which it can't given ephemeral rules), markdown rendering polish beyond what the AI SDK gives us by default, message editing/regeneration.

## Testing strategy

**Approach: tests and Storybook stories first.** The visible behavior is small and well-defined (the four UX states above). Writing the stories and component tests up front lets us iterate on the UI without an API key in the loop and guarantees the states are real, not accidental.

**Storybook stories** for `chat.client.tsx`, one per UX state:

- Idle (empty), idle (with prior messages)
- Submitted (thinking indicator visible)
- Streaming (partial assistant message + cursor)
- Error (with retry affordance)

Stories double as visual regression coverage and a living style reference.

**Unit / integration (default — no API cost):**

- Mock `streamText` to return a canned stream; assert the route handler:
  - assembles the system prompt + recipe context correctly
  - streams the response through
  - public endpoint: does not 401 unauthenticated callers
- Component tests for `chat.client.tsx` (mock `useChat` or its transport):
  - renders user message after submit
  - transitions idle → submitted → streaming → idle on a happy path
  - transitions to error on a failed request, retry works
  - `key={recipeId}` resets state across recipe changes (verify at the panel-wrapper level)
- Snapshot the system prompt assembly given a fixture recipe.

**Live smoke tests (opt-in, gated):**

- One Playwright test that hits a real model, gated behind `RUN_LIVE_AI_TESTS=1`. Not run in CI by default.
- Defer until we've ballparked the per-run cost. With a mini model and a single short turn, this is plausibly <$0.001/run, but confirm before wiring into any automation.

## Milestones

Each milestone is a reviewable commit or small PR. Granular per-step work items live in [`agent-foundation-checklist.md`](./agent-foundation-checklist.md).

1. **AI SDK 6 upgrade.** ✅ Already landed via rebase. `ai` and `@ai-sdk/openai` on v6; `@ai-sdk/react` removed (unused) and will be reinstalled in Milestone 4. CVE-affected version no longer in lockfile.
2. **Throwaway integration check.** A minimal script or temporary route that hits `gpt-5.4-mini` via AI SDK 6 (`streamText`) and prints a streamed response. Confirms the model id and v6 API shape before we touch UI. Discarded after. (Still useful even though the existing nlux-backed integration works — the new code path uses `streamText` directly, which we haven't exercised.)
3. **Tests + Storybook stories first.** Define the four UX states as stories. Write component tests against a mocked `useChat`. Tests should fail (no component yet) — this is the contract.
4. **Build `chat.client.tsx`.** Recipe-agnostic, takes context as a prop. shadcn/ui primitives (per AGENTS.md). Make the stories and tests pass.
5. **Wire the route handler.** `app/api/grandmother-bot/route.ts` with `streamText`. Real end-to-end streaming on the recipe page via a temporary mount.
6. **Replace nlux in `chat-panel.client.tsx`.** Swap the sheet wrapper to use the new component. Pass `key={recipeId}` to enforce the recipe-change reset rule. Remove `@nlux/react` and `@nlux/themes` from `package.json` and lockfile.
7. **Polish + verify.** Full manual smoke on the recipe detail page: open sheet, ask a question, verify thinking → streaming → idle, close + reopen (history preserved), navigate to another recipe (history cleared). `bun run check:types`, `bun run lint`, `bun run build`, `bun test`, `bun run build-storybook`, `bun run format`.

## Open questions

- [ ] Rate limiting strategy and provider — must be decided before any tool calls land. Not v1.
- [ ] Verify published-only filtering on the loaders/repository queries the agent will eventually call (so a public endpoint can't surface drafts when tools land).

## Out of scope reminders (so future-me doesn't sneak them in)

- No agent loops / tool calling in v1.
- No model router.
- **Ephemeral by design.** No DB persistence, no localStorage, no anonymous persistence. Persistence is a separate UX project, not a deferred line item.
- No write tools (and no plan to give the public-facing bot write access).
- No virtualized message lists (only valuable with persistence; we don't have it).
- No Next 15 / React 19 work on this branch.
