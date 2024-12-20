import { IMAGE_BASE_URL } from '../constants';
import {
  intermediateSchema,
  recipeFormSchema,
  type IntermediateRecipe,
  type RecipeFormData,
  type RecipePageData,
} from './schema';

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

// overloads for convertFormDataToRecipe
export function convertFormDataToRecipe(
  formData: FormData,
  options: { optional: true }
): Partial<IntermediateRecipe>;
export function convertFormDataToRecipe(
  formData: FormData,
  options?: { optional?: false }
): IntermediateRecipe;

export function convertFormDataToRecipe(
  formData: FormData,
  { optional = false }: { optional?: boolean } = {}
): RecipePageData | Partial<RecipePageData> {
  const data: Record<string, unknown> = {};
  formData.forEach((value, key) => {
    data[key] = value === 'null' ? null : value;
  });

  if (optional) {
    const validatedData = intermediateSchema.partial().parse(data);
    return validatedData;
  }

  const validatedData = intermediateSchema.parse(data);
  return validatedData;
}

export const recipeToFormData = ({
  imageFileList,
  ...serializableData
}: Partial<RecipeFormData>) => {
  const formData = new FormData();

  if ((imageFileList?.length ?? 1) !== 1) {
    throw new TypeError(
      `Expected imageFileList to be of nullish or have length=1. Received length=${imageFileList?.length}`
    );
  }

  if (imageFileList?.length === 1) {
    formData.append('image', imageFileList[0]);
  }

  Object.entries(serializableData).forEach(([key, value]) => {
    formData.append(key, value === null ? 'null' : value);
  });
  return formData;
};

export const convertImageUrlToImageId = (imageUrl: string) => {
  return imageUrl.replace(`${IMAGE_BASE_URL}/images/`, '');
};
