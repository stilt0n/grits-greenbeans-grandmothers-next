'use server';
import { getRecipesWithTags } from '@/lib/database';
import { z } from 'zod';

export const loadRecipe = async (recipeId: number) => {
  const recipes = await getRecipesWithTags({
    id: recipeId,
    fields: [
      'title',
      'description',
      'author',
      'recipeTime',
      'instructions',
      'imageUrl',
      'tags',
    ],
  });

  if (recipes.length !== 1) {
    return null;
  }

  const { success, data } = returnedRecipeSchema.safeParse(recipes[0]);
  console.log(data);
  return success ? data : null;
};

const returnedRecipeSchema = z.object({
  title: z.string(),
  description: z.string(),
  author: z.string().nullable(),
  recipeTime: z.string().nullable(),
  instructions: z.string(),
  imageUrl: z.string().nullable(),
  tags: z.array(z.string()).optional().nullable(),
});

export type RecipeFormData = z.infer<typeof returnedRecipeSchema>;
export interface RecipeFormDataWithId extends RecipeFormData {
  id: number;
}
