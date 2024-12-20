import { RecipePageData } from '@/lib/translation/schema';
import { db } from '@/db';
import { recipes, tags, recipesToTags } from '@/db/schema';
import { and, eq, inArray } from 'drizzle-orm';
import { extractColumn } from '@/lib/utils';

export interface UpdateRecipeArgs {
  recipeData: Partial<RecipePageData>;
  recipeId: number;
  tagsToAdd: string[];
  tagsToRemove: string[];
}

export const updateRecipe = ({
  recipeData,
  recipeId,
  tagsToAdd,
  tagsToRemove,
}: UpdateRecipeArgs) => {
  return db.transaction(async (trx) => {
    if (tagsToAdd.length > 0 || tagsToRemove.length > 0) {
      // check for existing tags
      const existingTagRows = await trx
        .select({ id: tags.id, name: tags.name })
        .from(tags)
        .where(inArray(tags.name, [...tagsToAdd, ...tagsToRemove]));

      // for realistic tag array sizes linear includes is probably
      // faster than the inherent overhead of a set
      const removeIds = extractColumn(
        existingTagRows.filter(({ name }) => tagsToRemove.includes(name)),
        'id'
      );

      if (removeIds.length !== tagsToRemove.length) {
        console.error(
          'invariant: attempting to delete tags that do not exist.'
        );
        console.error(`tagsToRemove: [${tagsToRemove.join(', ')}]`);
        console.error(`removeIds: [${removeIds.join(', ')}]`);
        trx.rollback();
        return;
      }

      if (removeIds.length > 0) {
        await trx
          .delete(recipesToTags)
          .where(
            and(
              eq(recipesToTags.recipeId, recipeId),
              inArray(recipesToTags.tagId, removeIds)
            )
          );
      }

      const existingTagNames = extractColumn(existingTagRows, 'name');
      const newTags = tagsToAdd
        .filter((tag) => !existingTagNames.includes(tag))
        .map((name) => ({ name }));

      const tagIdsToAdd = existingTagRows
        .filter(({ name }) => tagsToAdd.includes(name))
        .map(({ id: tagId }) => ({ tagId }));

      if (newTags.length > 0) {
        // note: we don't expect conflicts here since we
        // deliberately filtered them out
        const newTagIds = await trx
          .insert(tags)
          .values(newTags)
          .onConflictDoNothing()
          .returning({ tagId: tags.id });

        tagIdsToAdd.push(...newTagIds);
      }

      if (tagIdsToAdd.length > 0) {
        await trx
          .insert(recipesToTags)
          .values(tagIdsToAdd.map(({ tagId }) => ({ tagId, recipeId })))
          .onConflictDoNothing();
      }
    }

    // update recipe
    await trx.update(recipes).set(recipeData).where(eq(recipes.id, recipeId));

    return recipeId;
  });
};
