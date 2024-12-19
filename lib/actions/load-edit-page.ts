'use server';

import { getRecipes } from '@/lib/repository/recipe-store/read';
import { createWhereIdClause } from '@/lib/repository/recipe-store/utils';
import { recipePageSchema } from '@/lib/translation/schema';
import { convertPageToForm } from '@/lib/translation/parsers';

export const loadRecipeFormAction = async (recipeId: number) => {
  const recipes = await getRecipes({
    keys: [
      'title',
      'description',
      'author',
      'recipeTime',
      'instructions',
      'imageUrl',
      'tags',
    ],
    whereClause: createWhereIdClause(recipeId),
  });

  if (recipes.length !== 1) {
    return undefined;
  }

  const { success, data } = recipePageSchema.safeParse(recipes[0]);
  if (!success) {
    return undefined;
  }

  const recipeFormData = convertPageToForm(data);
  return {
    recipe: recipeFormData,
    initialTags: data.tags,
  };
};
