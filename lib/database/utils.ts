import type { RecipeFormData } from '@/app/actions/load-recipe';

type RecipeKeys = keyof RecipeFormData;

const keys = (recipe: Partial<RecipeFormData>) =>
  Object.keys(recipe) as RecipeKeys[];

export const getUpdatedRecipeFields = (
  currentRecipe: RecipeFormData,
  newRecipe: Partial<RecipeFormData>
) => {
  return keys(newRecipe).reduce(
    (changed: Partial<RecipeFormData>, key: RecipeKeys) => {
      if (currentRecipe[key] !== newRecipe[key]) {
        changed[key] = newRecipe[key] as any;
      }
      return changed;
    },
    {}
  );
};
