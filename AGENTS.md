# AI Agent Guide

This document provides context and conventions for AI agents working on this codebase.

## Project Overview

Grits, Greenbeans and Grandmothers is a Next.js recipe website that digitizes family recipe books. It allows authenticated family members to create, edit, and view recipes, with AI-powered features for recipe assistance and description generation.

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Package Manager**: Bun
- **Database**: Turso (LibSQL) with Drizzle ORM
- **Authentication**: Clerk
- **Image Storage**: Backblaze B2 (using AWS S3 SDK)
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Form Handling**: react-hook-form with zod validation
- **Rich Text Editor**: TipTap
- **AI**: OpenAI via Vercel AI SDK
- **Testing**: Bun test runner (unit tests), Playwright (E2E tests)

## Project Structure

### Frontend (`app/`, `components/`, `hooks/`)

- **`app/`**: Next.js App Router pages and layouts
  - Routes follow Next.js App Router conventions
  - Server components by default
  - Client components marked with `'use client'`
- **`components/`**: React components
  - Organized by feature/domain
  - `ui/`: shadcn/ui components (prefer these when available)
  - Client components use `.client.tsx` suffix
- **`hooks/`**: Custom React hooks

### Backend (`lib/`)

- **`lib/loaders/`**: Server-side data reading functions
  - Called from server components
  - Return data for rendering
  - Examples: `loadRecipePage`, `loadGalleryPage`, `loadRecipeForm`
- **`lib/actions/`**: Next.js Server Actions
  - Marked with `'use server'`
  - Handle data mutations (create, update, delete)
  - Examples: `createRecipeAction`, `updateRecipeAction`
  - Located in `lib/actions/`
- **`lib/repository/`**: Data access layer
  - **`recipe-store/`**: CRUD operations for recipes (uses Drizzle ORM)
    - `create.ts`: Create operations
    - `read.ts`: Read operations
    - `update.ts`: Update operations
    - `utils.ts`: Query building utilities
  - **`image-store/`**: Image upload to Backblaze B2
    - Uses AWS S3 SDK
    - Handles image preprocessing and upload
- **`lib/translation/`**: Schema translation layer

  - Translates between backend (Drizzle) and frontend schemas
  - Uses Zod for validation
  - `schema.ts`: Zod schemas
  - `parsers.ts`: Conversion functions
  - `utils.ts`: Translation utilities

- **`lib/auth.ts`**: Authentication utilities (Clerk integration)

### Database (`db/`)

- **`db/schema.ts`**: Drizzle ORM schema definitions

  - Tables: `recipes`, `tags`, `recipesToTags`
  - Relations defined using Drizzle relations API
  - Type exports: `InsertRecipe`, `SelectRecipe`, etc.

- **`db/index.ts`**: Database connection and client setup

### Other Directories

- **`scripts/`**: Utility scripts (backup, upload, etc.)
- **`tests/`**: Playwright E2E tests
- **`components/__tests__/`**: Unit tests for components
- **`stories/`**: Storybook stories
- **`migrations/`**: Drizzle database migrations
- **`config/`**: Test configuration files

## Key Conventions

### Component Naming

- Client components: Use `.client.tsx` suffix (e.g., `recipe-edit-form.client.tsx`)
- Server components: No special suffix
- Prefer shadcn/ui components when available (check `components/ui/`)

### Data Flow

1. **Reading Data**: Server Component → `lib/loaders/*` → `lib/repository/recipe-store/read.ts` → Database
2. **Writing Data**: Client Component → Server Action (`lib/actions/*`) → `lib/repository/recipe-store/*` → Database
3. **Schema Translation**: Use `lib/translation/` to convert between backend and frontend formats

### Server Actions Pattern

```typescript
'use server';

export const myAction = async (formData: FormData) => {
  // 1. Authentication check
  const user = await currentUser();
  if (!hasElevatedPermissions(user)) {
    return; // or throw error
  }

  // 2. Parse/validate input (often using translation layer)
  const data = convertFormDataToRecipe(formData);

  // 3. Business logic (image processing, sanitization, etc.)

  // 4. Call repository function
  return createRecipe(data);
};
```

### Loader Pattern

```typescript
export const loadSomething = async (args: LoadArgs) => {
  // 1. Query database via repository
  const result = await getRecipes({ ... });

  // 2. Validate with Zod schema
  const validated = schema.parse(result);

  // 3. Return data
  return validated;
};
```

### Repository Pattern

- Repository functions are pure data access
- Use Drizzle query builders (`createWhereClause`, `createPaginateClause`, etc.)
- Return raw database results
- Validation happens in loaders/actions, not repository

### Translation Layer

- **Purpose**: Bridge between Drizzle schema (snake_case, database types) and frontend schema (camelCase, frontend types)
- **Usage**:
  - `convertFormDataToRecipe`: Form → Backend format
  - `convertPageToForm`: Backend format → Form format
  - Zod schemas validate at boundaries

### Image Handling

- Images uploaded via `lib/repository/image-store/upload.ts`
- Preprocessing via `lib/repository/image-store/utils.ts` (uses Sharp)
- Images stored on Backblaze B2
- Enforced aspect ratio via image cropper component

## Testing

### Unit Tests

- Use Bun test runner
- Located in `components/__tests__/` or co-located with code
- Use `@testing-library/react` for component tests
- Configuration in `config/testing-library.ts` and `config/happydom.ts`

### E2E Tests

- Use Playwright
- Located in `tests/`
- Configuration in `playwright.config.ts`

### Running Tests

- Check `package.json` scripts for test commands
- Prefer using npm/bun scripts over direct terminal commands

## Development Workflow

### Common Tasks

1. **Add a new recipe field**:

   - Update `db/schema.ts`
   - Create migration (`bun run studio` or drizzle-kit)
   - Update translation schemas in `lib/translation/schema.ts`
   - Update parsers in `lib/translation/parsers.ts`
   - Update repository read/write functions
   - Update UI components

2. **Add a new page**:

   - Create route in `app/`
   - Add loader in `lib/loaders/` if needed
   - Create components in `components/`

3. **Add a new form action**:
   - Create server action in `lib/actions/`
   - Add repository function if needed
   - Wire up in client component

### Scripts

- `bun run dev`: Start development server
- `bun run build`: Build for production
- `bun run lint`: Run ESLint
- `bun run format`: Format code with Prettier
- `bun run check:types`: Type check with TypeScript
- `bun run studio`: Open Drizzle Studio
- `bun run backup`: Run backup script

## Important Notes

- **Authentication**: Routes protected via middleware (`middleware.ts`) and server action checks
- **Permissions**: Use `hasElevatedPermissions()` or `hasAdminPermissions()` from `lib/auth.ts`
- **HTML Sanitization**: TipTap output is sanitized, but server actions also sanitize as defense-in-depth
- **Path Aliases**: Use `@/` prefix for imports (configured in `tsconfig.json`)
- **Type Safety**: Prefer Zod schemas for runtime validation at API boundaries
- **Error Handling**: Server actions typically return `undefined` on error (check return values)

## AI Features

- **grandmother_bot**: AI assistant accessible on recipe pages
- **Recipe description generation**: AI-powered description generation in recipe forms
- AI code lives in `lib/actions/ai/`
- Uses OpenAI via Vercel AI SDK
