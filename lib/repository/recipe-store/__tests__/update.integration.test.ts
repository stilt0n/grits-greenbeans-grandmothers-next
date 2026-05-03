import { describe, it, expect } from 'bun:test';
import { and, eq } from 'drizzle-orm';
import { setupTestDb } from '@/lib/__tests__/helpers/test-db';
import * as schema from '@/db/schema';
import { createRecipe } from '../create';
import { updateRecipe } from '../update';

const getTestDb = setupTestDb();

const tagsForRecipe = async (recipeId: number) => {
  const db = getTestDb();
  const rows = await db
    .select({ name: schema.tags.name })
    .from(schema.recipesToTags)
    .innerJoin(schema.tags, eq(schema.tags.id, schema.recipesToTags.tagId))
    .where(eq(schema.recipesToTags.recipeId, recipeId));
  return rows.map((r) => r.name).sort();
};

describe('updateRecipe', () => {
  it('updates the recipe row fields without touching tags when no tag ops', async () => {
    const id = await createRecipe({
      title: '__TEST_FIXTURE_update_fields_initial__',
      description: 'old',
      instructions: 'i',
      author: null,
      recipeTime: null,
      imageUrl: null,
      tags: ['__TEST_FIXTURE_keep_tag__'],
    });

    await updateRecipe({
      recipeId: id,
      recipeData: { description: 'new' },
      tagsToAdd: [],
      tagsToRemove: [],
    });

    const db = getTestDb();
    const [row] = await db
      .select()
      .from(schema.recipes)
      .where(eq(schema.recipes.id, id));
    expect(row.description).toBe('new');
    expect(await tagsForRecipe(id)).toEqual(['__TEST_FIXTURE_keep_tag__']);
  });

  it('adds new tags and removes specified tags', async () => {
    const id = await createRecipe({
      title: '__TEST_FIXTURE_update_addremove__',
      description: 'd',
      instructions: 'i',
      author: null,
      recipeTime: null,
      imageUrl: null,
      tags: ['__TEST_FIXTURE_addremove_a__', '__TEST_FIXTURE_addremove_b__'],
    });

    await updateRecipe({
      recipeId: id,
      recipeData: { description: 'updated' },
      tagsToAdd: ['__TEST_FIXTURE_addremove_c__'],
      tagsToRemove: ['__TEST_FIXTURE_addremove_a__'],
    });

    expect(await tagsForRecipe(id)).toEqual([
      '__TEST_FIXTURE_addremove_b__',
      '__TEST_FIXTURE_addremove_c__',
    ]);
  });

  it('rolls back when tagsToRemove references a non-existent tag', async () => {
    const id = await createRecipe({
      title: '__TEST_FIXTURE_update_rollback__',
      description: 'before',
      instructions: 'i',
      author: null,
      recipeTime: null,
      imageUrl: null,
      tags: ['__TEST_FIXTURE_rollback_existing__'],
    });

    let threw = false;
    try {
      await updateRecipe({
        recipeId: id,
        recipeData: { description: 'after' },
        tagsToAdd: [],
        tagsToRemove: ['__TEST_FIXTURE_does_not_exist__'],
      });
    } catch {
      threw = true;
    }

    // updateRecipe calls trx.rollback(), which throws inside the transaction;
    // the recipe row's description should remain at its pre-update value.
    expect(threw).toBe(true);

    const db = getTestDb();
    const [row] = await db
      .select()
      .from(schema.recipes)
      .where(eq(schema.recipes.id, id));
    expect(row.description).toBe('before');
    expect(await tagsForRecipe(id)).toEqual([
      '__TEST_FIXTURE_rollback_existing__',
    ]);
  });

  it('reuses existing tag rows when adding (onConflictDoNothing)', async () => {
    // pre-create the tag globally
    const db = getTestDb();
    await db
      .insert(schema.tags)
      .values({ name: '__TEST_FIXTURE_preexisting__' })
      .onConflictDoNothing();

    const id = await createRecipe({
      title: '__TEST_FIXTURE_update_reuse_tag__',
      description: 'd',
      instructions: 'i',
      author: null,
      recipeTime: null,
      imageUrl: null,
      tags: null,
    });

    await updateRecipe({
      recipeId: id,
      recipeData: { description: 'd2' },
      tagsToAdd: ['__TEST_FIXTURE_preexisting__'],
      tagsToRemove: [],
    });

    const tagRows = await db
      .select()
      .from(schema.tags)
      .where(eq(schema.tags.name, '__TEST_FIXTURE_preexisting__'));
    expect(tagRows).toHaveLength(1);

    const link = await db
      .select()
      .from(schema.recipesToTags)
      .where(
        and(
          eq(schema.recipesToTags.recipeId, id),
          eq(schema.recipesToTags.tagId, tagRows[0].id)
        )
      );
    expect(link).toHaveLength(1);
  });
});
