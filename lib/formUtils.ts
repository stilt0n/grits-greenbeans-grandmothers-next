import {
  recipeFormServerSchema,
  type RecipeFormData,
} from '@/types/recipeTypes';

export const recipeToFormData = ({
  imageFileList,
  ...serializableData
}: Partial<RecipeFormData>) => {
  const formData = new FormData();
  if (imageFileList?.length === 1) {
    formData.append('image', imageFileList[0]);
  }
  Object.entries(serializableData).forEach(([key, value]) => {
    formData.append(key, value === null ? 'null' : value);
  });
  return formData;
};

export const formDataToRecipe = (formData: FormData) => {
  const data: Record<string, unknown> = {};
  formData.forEach((value, key) => {
    data[key] = value === 'null' ? null : value;
  });

  const validatedData = recipeFormServerSchema.parse(data);

  return validatedData;
};

export const formDataToRecipePartial = (formData: FormData) => {
  const data: Record<string, unknown> = {};
  formData.forEach((value, key) => {
    data[key] = value === 'null' ? null : value;
  });

  const validatedData = recipeFormServerSchema.partial().parse(data);

  return validatedData;
};
