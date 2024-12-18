'use server';
import { getRecipes } from '@/lib/repository/recipe-store/query';
import { createWhereIdClause } from '@/lib/repository/recipe-store/utils';
import { recipePageSchema } from '@/lib/translation/schema';

export const loadRecipePageAction = async (recipeId: number) => {
  const recipes = await getRecipes({
    keys: [
      'title',
      'description',
      'instructions',
      'author',
      'recipeTime',
      'imageUrl',
      'tags',
    ],
    whereClause: createWhereIdClause(recipeId),
  });

  if (recipes.length !== 1) {
    return undefined;
  }

  const { success, data } = recipePageSchema.safeParse(recipes[0]);
  console.log(success, data);
  return success ? data : undefined;
};
