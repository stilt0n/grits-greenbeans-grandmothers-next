import { describe, it, expect } from 'bun:test';
import { eq } from 'drizzle-orm';
import { setupTestDb } from '@/lib/__tests__/helpers/test-db';
import * as schema from '@/db/schema';
import { createRecipe } from '../create';

const getTestDb = setupTestDb();

describe('createRecipe', () => {
  it('inserts a recipe and returns its id', async () => {
    const id = await createRecipe({
      title: '__TEST_FIXTURE_create_basic__',
      description: 'd',
      instructions: 'i',
      author: null,
      recipeTime: null,
      imageUrl: null,
      tags: null,
    });

    expect(typeof id).toBe('number');

    const db = getTestDb();
    const rows = await db
      .select()
      .from(schema.recipes)
      .where(eq(schema.recipes.id, id));
    expect(rows).toHaveLength(1);
    expect(rows[0].title).toBe('__TEST_FIXTURE_create_basic__');
  });

  it('inserts new tags and links them to the recipe', async () => {
    const id = await createRecipe({
      title: '__TEST_FIXTURE_create_with_tags__',
      description: 'd',
      instructions: 'i',
      author: null,
      recipeTime: null,
      imageUrl: null,
      tags: ['__TEST_FIXTURE_tag_a__', '__TEST_FIXTURE_tag_b__'],
    });

    const db = getTestDb();
    const links = await db
      .select({ name: schema.tags.name })
      .from(schema.recipesToTags)
      .innerJoin(schema.tags, eq(schema.tags.id, schema.recipesToTags.tagId))
      .where(eq(schema.recipesToTags.recipeId, id));

    expect(links.map((l) => l.name).sort()).toEqual([
      '__TEST_FIXTURE_tag_a__',
      '__TEST_FIXTURE_tag_b__',
    ]);
  });

  it('reuses existing tag rows on conflict (onConflictDoNothing)', async () => {
    // create first recipe with a tag
    await createRecipe({
      title: '__TEST_FIXTURE_create_dedup_one__',
      description: 'd',
      instructions: 'i',
      author: null,
      recipeTime: null,
      imageUrl: null,
      tags: ['__TEST_FIXTURE_shared_tag__'],
    });

    // create a second recipe with the same tag — should not create a duplicate tag row
    const id2 = await createRecipe({
      title: '__TEST_FIXTURE_create_dedup_two__',
      description: 'd',
      instructions: 'i',
      author: null,
      recipeTime: null,
      imageUrl: null,
      tags: ['__TEST_FIXTURE_shared_tag__'],
    });

    const db = getTestDb();
    const tagRows = await db
      .select()
      .from(schema.tags)
      .where(eq(schema.tags.name, '__TEST_FIXTURE_shared_tag__'));
    expect(tagRows).toHaveLength(1);

    // and the second recipe is properly linked
    const links = await db
      .select({ recipeId: schema.recipesToTags.recipeId })
      .from(schema.recipesToTags)
      .where(eq(schema.recipesToTags.tagId, tagRows[0].id));
    const linkedRecipeIds = links.map((l) => l.recipeId);
    expect(linkedRecipeIds).toContain(id2);
  });
});
