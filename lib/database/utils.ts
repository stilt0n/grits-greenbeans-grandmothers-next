import type { RecipeFormData } from '@/types/recipeTypes';

type FormDiffData = Omit<RecipeFormData, 'imageFileList' | 'cropCoordinates'>;

type RecipeKeys = keyof FormDiffData;

const keys = (recipe: Partial<RecipeFormData>) =>
  Object.keys(recipe) as RecipeKeys[];

export const getUpdatedRecipeFields = (
  currentRecipe: FormDiffData,
  newRecipe: Partial<FormDiffData>
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

export const shouldUpdateRecipe = (
  currentRecipe: FormDiffData,
  { imageFileList, cropCoordinates, ...newRecipe }: Partial<RecipeFormData>
) => {
  if (imageFileList != null && cropCoordinates != null) {
    return true;
  }
  return (
    Object.keys(getUpdatedRecipeFields(currentRecipe, newRecipe)).length > 0
  );
};
