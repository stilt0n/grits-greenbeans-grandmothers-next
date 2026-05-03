import { describe, it, expect, beforeAll } from 'bun:test';
import { setupTestDb } from '@/lib/__tests__/helpers/test-db';
import { getDb } from '@/db';
import * as schema from '@/db/schema';
import { getRecipes, getRecipesFilteredByTag, getRecipeCount } from '../read';

const getTestDb = setupTestDb();

const SOUTHERN = '__TEST_FIXTURE_southern__';
const BREAKFAST = '__TEST_FIXTURE_breakfast__';
const SIDE = '__TEST_FIXTURE_side__';
const CORNBREAD = '__TEST_FIXTURE_Cornbread__';
const GREENS = '__TEST_FIXTURE_Greens__';
const BISCUITS = '__TEST_FIXTURE_Biscuits__';

beforeAll(async () => {
  const db = getTestDb();

  const recipeRows = await db
    .insert(schema.recipes)
    .values([
      {
        title: CORNBREAD,
        description: 'Classic southern cornbread',
        instructions: 'Mix and bake',
      },
      {
        title: GREENS,
        description: 'Slow-cooked collard greens',
        instructions: 'Simmer for hours',
      },
      {
        title: BISCUITS,
        description: 'Buttermilk biscuits',
        instructions: 'Fold and bake',
      },
    ])
    .returning({ id: schema.recipes.id, title: schema.recipes.title });

  const tagRows = await db
    .insert(schema.tags)
    .values([{ name: SOUTHERN }, { name: BREAKFAST }, { name: SIDE }])
    .returning({ id: schema.tags.id, name: schema.tags.name });

  const recipeId = (title: string) =>
    recipeRows.find((r) => r.title === title)!.id;
  const tagId = (name: string) => tagRows.find((t) => t.name === name)!.id;

  await db.insert(schema.recipesToTags).values([
    { recipeId: recipeId(CORNBREAD), tagId: tagId(SOUTHERN) },
    { recipeId: recipeId(CORNBREAD), tagId: tagId(SIDE) },
    { recipeId: recipeId(GREENS), tagId: tagId(SOUTHERN) },
    { recipeId: recipeId(BISCUITS), tagId: tagId(BREAKFAST) },
  ]);
});

describe('AsyncLocalStorage propagation', () => {
  it('binds getDb() to the in-memory test db (proves ALS works through bun hooks)', () => {
    expect(getDb()).toBe(getTestDb());
  });
});

describe('getRecipesFilteredByTag', () => {
  it('returns every recipe when no filter is provided', async () => {
    const rows = await getRecipesFilteredByTag({});
    expect(rows.map((r) => r.title).sort()).toEqual(
      [BISCUITS, CORNBREAD, GREENS].sort()
    );
  });

  it('filters recipes by tag substring (the .as subquery path)', async () => {
    const rows = await getRecipesFilteredByTag({ filter: SOUTHERN });
    expect(rows.map((r) => r.title).sort()).toEqual([CORNBREAD, GREENS].sort());
  });

  it('returns only the matching recipe for a unique tag', async () => {
    const rows = await getRecipesFilteredByTag({ filter: BREAKFAST });
    expect(rows.map((r) => r.title)).toEqual([BISCUITS]);
  });

  it('deduplicates recipes that match multiple tag rows', async () => {
    // CORNBREAD has both SOUTHERN and SIDE; '__TEST_FIXTURE_s' matches both
    const rows = await getRecipesFilteredByTag({
      filter: '__TEST_FIXTURE_s',
    });
    const titles = rows.map((r) => r.title);
    expect(new Set(titles).size).toBe(titles.length);
  });

  it('respects limit and offset', async () => {
    const rows = await getRecipesFilteredByTag({ limit: 1, offset: 1 });
    expect(rows).toHaveLength(1);
  });
});

describe('getRecipeCount', () => {
  it('counts every recipe when no filter is provided', async () => {
    const [{ count }] = await getRecipeCount();
    expect(count).toBe(3);
  });

  it('counts by title with a like filter', async () => {
    const [{ count }] = await getRecipeCount(CORNBREAD, 'title');
    expect(count).toBe(1);
  });

  it('counts distinct recipes by tag', async () => {
    const [{ count }] = await getRecipeCount(SOUTHERN, 'tag');
    expect(count).toBe(2);
  });
});

describe('getRecipes', () => {
  it('returns recipes with their tag names when tags are requested', async () => {
    const rows = await getRecipes({ keys: ['id', 'title', 'tags'] });
    const cornbread = rows.find(
      (r): r is { id: number; title: string; tags: string[] } =>
        'title' in r && r.title === CORNBREAD
    );
    expect(cornbread?.tags.sort()).toEqual([SIDE, SOUTHERN].sort());
  });
});
