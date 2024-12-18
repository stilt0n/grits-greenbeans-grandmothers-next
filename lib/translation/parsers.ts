import { recipeFormSchema, RecipeFormData, RecipePageData } from './schema';

export const convertPageToForm = ({
  imageUrl: _,
  tags,
  recipeTime = null,
  ...recipe
}: RecipePageData) => {
  const recipeFormData: RecipeFormData = {
    tags: JSON.stringify(tags),
    imageFileList: null,
    cropCoordinates: null,
    recipeTime,
    ...recipe,
  };
  return recipeFormSchema.parse(recipeFormData);
};
