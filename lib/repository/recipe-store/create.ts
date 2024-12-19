import { db } from '@/db';
import { recipes, recipesToTags, tags } from '@/db/schema';
import { RecipePageData } from '@/lib/translation/schema';
import { inArray } from 'drizzle-orm';

export const createRecipe = async (recipePageData: RecipePageData) => {
  const { tags: tagArray, ...recipe } = recipePageData;
  return db.transaction(async (trx) => {
    const [{ recipeId }] = await trx
      .insert(recipes)
      .values(recipe)
      .returning({ recipeId: recipes.id });

    if (tagArray && tagArray.length > 0) {
      const tagValues = tagArray?.map((name) => ({ name }));
      await trx.insert(tags).values(tagValues).onConflictDoNothing();

      // we use select instead of `returning` here because when
      // there is a conflict `returning` will return nothing.
      // we still need all tagsIds for the next step so we have
      // to ensure we get them by selecting them manually.
      const tagIds = await trx
        .select({ tagId: tags.id })
        .from(tags)
        .where(inArray(tags.name, tagArray));

      const recipeTagValues = tagIds.map(({ tagId }) => ({
        recipeId,
        tagId,
      }));

      await trx
        .insert(recipesToTags)
        .values(recipeTagValues)
        .onConflictDoNothing();
    }

    return recipeId;
  });
};
