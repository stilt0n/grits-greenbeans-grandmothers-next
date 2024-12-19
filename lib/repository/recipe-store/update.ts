import { RecipePageData } from '@/lib/translation/schema';

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
}: UpdateRecipeArgs) => {};
