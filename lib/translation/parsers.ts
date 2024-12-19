import {
  recipeFormSchema,
  RecipeFormData,
  RecipePageData,
  IntermediateRecipe,
  intermediateSchema,
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
