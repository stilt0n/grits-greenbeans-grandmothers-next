# AI Agent Guide

Context and conventions for AI agents working on this codebase. This file focuses on things that are easy to miss by exploring the code alone — for a general project tour, tech stack, and contributor onboarding, see `CONTRIBUTING.md`.

## Architecture: the layers that matter

Data flows through four layers, and getting them right is the most common source of subtle bugs:

1. **Loaders** (`lib/loaders/`) — server-side reads. Called from server components.
2. **Actions** (`lib/actions/`, `'use server'`) — mutations. AI features live in `lib/actions/ai/`.
3. **Repository** (`lib/repository/recipe-store/`, `lib/repository/image-store/`) — pure data access via Drizzle. No validation here.
4. **Translation** (`lib/translation/`) — bridges Drizzle's snake_case DB types and the frontend's camelCase types. Zod schemas in `schema.ts`, converters in `parsers.ts` (e.g. `convertFormDataToRecipe`, `convertPageToForm`).

Validation happens in loaders and actions, **not** in the repository. The repository returns raw DB results.

## Server Action pattern

```typescript
'use server';

export const myAction = async (formData: FormData) => {
  // 1. Auth check
  const user = await currentUser();
  if (!hasElevatedPermissions(user)) {
    return; // server actions typically return undefined on error
  }

  // 2. Parse/validate via the translation layer
  const data = convertFormDataToRecipe(formData);

  // 3. Business logic (image processing, sanitization, etc.)

  // 4. Repository call
  return createRecipe(data);
};
```

Notes:

- **Server actions return `undefined` on error.** Callers must check return values rather than relying on thrown exceptions.
- **Auth is checked twice**: once in `middleware.ts` for route access, again inside server actions as defense-in-depth. Don't skip the in-action check.
- Use `hasElevatedPermissions()` (family or admin) or `hasAdminPermissions()` from `lib/auth.ts`.

## Loader pattern

```typescript
export const loadSomething = async (args: LoadArgs) => {
  const result = await getRecipes({ ... });   // repository
  const validated = schema.parse(result);     // Zod boundary validation
  return validated;
};
```

## Adding a new recipe field

This touches every layer; it's easy to forget one.

1. `db/schema.ts`
2. Generate a migration
3. `lib/translation/schema.ts` (Zod)
4. `lib/translation/parsers.ts` (converters in both directions)
5. `lib/repository/recipe-store/` read and write functions
6. UI components and forms

## Non-obvious things

- **HTML sanitization** — TipTap output is sanitized client-side, but server actions sanitize again as defense-in-depth. Don't remove the server-side sanitization assuming the client already did it.
- **Images** — uploads go through `lib/repository/image-store/upload.ts`; preprocessing (Sharp) lives in `lib/repository/image-store/utils.ts`. The aspect ratio is enforced by the cropper component on the client.
- **Repository query helpers** — use `createWhereClause`, `createPaginateClause`, etc. from `lib/repository/recipe-store/utils.ts` rather than hand-rolling Drizzle predicates.
- **Client components** use a `.client.tsx` suffix.
- **shadcn/ui first** — check `components/ui/` before reaching for a new component or library.
