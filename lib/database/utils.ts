import type { RecipeFormData } from '@/types/recipeTypes';

type FormDiffData = Omit<
  RecipeFormData,
  'imageFileList' | 'cropCoordinates' | 'tags'
>;

type RecipeKeys = keyof FormDiffData;

const keys = (recipe: Partial<RecipeFormData>) =>
  Object.keys(recipe) as RecipeKeys[];

export const getUpdatedRecipeFields = (
  currentRecipe: FormDiffData,
  newRecipe: Partial<FormDiffData>
) => {
  return keys(newRecipe).reduce(
    (changed: Partial<RecipeFormData>, key: RecipeKeys) => {
      // we want to consider null and undefined equal here
      if (currentRecipe[key] != newRecipe[key]) {
        changed[key] = newRecipe[key] as any;
      }
      return changed;
    },
    {}
  );
};

export const shouldUpdateRecipe = (
  currentRecipe: FormDiffData,
  {
    imageFileList,
    cropCoordinates,
    ...newRecipe
  }: Partial<Omit<RecipeFormData, 'tags'>>
) => {
  if (imageFileList != null && cropCoordinates != null) {
    return true;
  }
  return (
    Object.keys(getUpdatedRecipeFields(currentRecipe, newRecipe)).length > 0
  );
};

export const getUpdatedTags = (
  currentTags: string[] | null | undefined,
  newTags: string[] | null | undefined
) => {
  const addTags = newTags?.filter((tag) => {
    !currentTags?.includes(tag);
  });

  const removeTags = currentTags?.filter((tag) => {
    !newTags?.includes(tag);
  });

  return { addTags, removeTags };
};
