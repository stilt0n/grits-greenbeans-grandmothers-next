import type { CoreMessage } from 'ai';
import type { ChatItem } from '@nlux/react';
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

export const convertRecipeToPromptContext = ({
  title,
  description,
  instructions,
  recipeTime,
}: Omit<RecipePageData, 'author' | 'imageUrl' | 'tags'>) => {
  const time = recipeTime ? `<p class='recipe-time'>${recipeTime}</p>\n` : '';
  const indentedInstructions = instructions
    .split('\n')
    .map((line) => (line.length > 0 ? `  ${line}` : ''))
    .join('\n');
  const output = `<h1 class='title'>${title}</h1>
<h2 class='description'>${description}</h2>
${time}
<div class='recipe-instructions'>
${indentedInstructions}
</div>`;
  return output;
};

// The docs for the library I'm using are not clear on this but it seems like chatHistory can contain string arrays
// I'm guessing this is because the message was streamed in chunks and this is how they're represented, but I'm not
// totally sure. We need to converte these chunks into a single string when this happens.
export const convertNluxChatHistory = (
  chatHistory?: ChatItem<string | string[]>[]
): CoreMessage[] => {
  return (
    chatHistory?.map(({ role, message }) => ({
      role,
      content: Array.isArray(message) ? message.join('') : message,
    })) ?? []
  );
};
