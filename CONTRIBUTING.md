# Contributing

Thanks for your interest in contributing to Grits, Greenbeans and Grandmothers. This guide covers what you need to know to get the project running locally and find your way around the codebase.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Package Manager**: Bun (Next.js still uses Node for the runtime)
- **Database**: Turso (LibSQL) with Drizzle ORM
- **Authentication**: Clerk
- **Image Storage**: Backblaze B2 (via AWS S3 SDK), Sharp for preprocessing
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Form Handling**: react-hook-form + Zod
- **Rich Text Editor**: TipTap
- **Image Cropper**: react-image-crop
- **AI**: OpenAI via Vercel AI SDK; nlux for the chat component
- **Testing**: Bun test + React Testing Library (unit), Playwright (E2E)
- **Hosting**: Vercel

## Getting Started

```sh
bun install
bun run dev
```

You will need environment variables for Clerk, Turso, Backblaze B2, and OpenAI. Reach out if you need help getting set up.

### Useful Scripts

- `bun run dev` — start the development server
- `bun run build` — production build
- `bun run lint` — ESLint
- `bun run format` — Prettier
- `bun run check:types` — TypeScript
- `bun run studio` — open Drizzle Studio
- `bun run backup` — run the backup script

## Project Structure

### Frontend

- **`app/`** — Next.js App Router pages and layouts. Server components by default; client components opt in with `'use client'` and use a `.client.tsx` suffix.
- **`components/`** — React components organized by feature. `components/ui/` holds shadcn/ui primitives — prefer these when something fits.
- **`hooks/`** — Custom React hooks.

### Backend (`lib/`)

- **`lib/loaders/`** — Server-side data reading. Called from server components, returns data ready for rendering.
- **`lib/actions/`** — Server Actions (`'use server'`). Handle mutations. AI features live in `lib/actions/ai/`.
- **`lib/repository/`** — Data access layer.
  - `recipe-store/` — CRUD for recipes (Drizzle ORM), split into `create.ts`, `read.ts`, `update.ts`, `utils.ts`.
  - `image-store/` — Image upload to Backblaze B2.
- **`lib/translation/`** — Bridges the Drizzle schema (snake_case, DB types) and the frontend schema (camelCase). Zod schemas in `schema.ts`, conversion functions in `parsers.ts`.
- **`lib/auth.ts`** — Clerk helpers including `hasElevatedPermissions` and `hasAdminPermissions`.

### Database (`db/`)

- **`db/schema.ts`** — Drizzle schema. Tables: `recipes`, `tags`, `recipesToTags`. Type exports like `InsertRecipe`, `SelectRecipe`.
- **`db/index.ts`** — DB connection and client.
- **`migrations/`** — Drizzle-generated migrations.

### Other

- **`scripts/`** — Utility scripts (backup, upload, etc.)
- **`e2e/`** — Playwright tests
- **`components/__tests__/`** — Unit tests (also co-located with code)
- **`stories/`** — Storybook
- **`config/`** — Test config (`testing-library.ts`, `happydom.ts`)

## Conventions

- **Path alias**: `@/` maps to the project root (see `tsconfig.json`).
- **Client components**: suffix files with `.client.tsx`.
- **shadcn/ui first**: check `components/ui/` before pulling in new component libraries.
- **Validation at boundaries**: Zod schemas validate in loaders and actions; the repository layer stays as pure data access.

### Data Flow

- **Reading**: Server Component → `lib/loaders/*` → `lib/repository/recipe-store/read.ts` → DB
- **Writing**: Client Component → `lib/actions/*` → `lib/repository/recipe-store/*` → DB
- Use `lib/translation/` to convert between backend and frontend formats.

## Common Tasks

### Add a new recipe field

1. Update `db/schema.ts`.
2. Generate a migration (`bun run studio` or drizzle-kit).
3. Update Zod schemas in `lib/translation/schema.ts`.
4. Update parsers in `lib/translation/parsers.ts`.
5. Update repository read/write functions.
6. Update UI components and forms.

### Add a new page

1. Add the route under `app/`.
2. Add a loader in `lib/loaders/` if it needs server-side data.
3. Build out components under `components/`.

### Add a new form action

1. Create the server action under `lib/actions/`.
2. Add a repository function if needed.
3. Wire it up in the relevant client component.

## Testing

- **Unit tests** — Bun test runner with React Testing Library. Tests live in `components/__tests__/` or co-located with the code under test.
- **E2E tests** — Playwright, configured in `playwright.config.ts`, tests in `e2e/`.

Prefer the `package.json` scripts over running the runners directly.
