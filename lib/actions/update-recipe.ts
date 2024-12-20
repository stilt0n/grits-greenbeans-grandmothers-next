'use server';

import sanitizeHtml from 'sanitize-html';
import { currentUser } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { hasElevatedPermissions } from '@/lib/auth';
import { getRecipeTags } from '@/lib/repository/recipe-store/read';
import { convertFormDataToRecipe } from '@/lib/translation/parsers';
import { preprocessImage } from '@/lib/repository/image-store/utils';
import { uploadFileToImageStore } from '@/lib/repository/image-store/upload';
import { RecipePageData } from '@/lib/translation/schema';
import { updateRecipe } from '@/lib/repository/recipe-store/update';

export interface UpdateRecipeActionArgs {
  formData: FormData;
  id: number;
}

const xor = (a: any, b: any) => !!((a || b) && !(a && b));

const getTagOperations = (previousTags: string[], currentTags: string[]) => {
  const tagsToRemove = previousTags.filter((tag) => !currentTags.includes(tag));
  const tagsToAdd = currentTags.filter((tag) => !previousTags.includes(tag));
  return { tagsToAdd, tagsToRemove };
};

export const updateRecipeAction = async ({
  formData,
  id,
}: UpdateRecipeActionArgs) => {
  const user = await currentUser();
  if (!hasElevatedPermissions(user)) {
    console.error(
      'SECURITY: an unauthorized user accessed a protected route and attempted an action. User info:'
    );
    console.error(user);
    return;
  }

  const { image, cropCoordinates, tags, ...recipe } = convertFormDataToRecipe(
    formData,
    { optional: true }
  );

  if (xor(image, cropCoordinates)) {
    console.error(
      'Assertion error: unexpectedly recieved only one of image and cropCoordinates'
    );
    return;
  }

  const previousTags = await getRecipeTags(id);
  const { tagsToAdd, tagsToRemove } = getTagOperations(
    previousTags,
    tags ?? []
  );

  const recipeData: Partial<RecipePageData> = { ...recipe };
  if (image && cropCoordinates) {
    const imageBuffer = await preprocessImage(image, cropCoordinates);
    if (!imageBuffer) {
      console.error('Image preprocessing failed to produce an image buffer');
      return;
    }
    const { imageUrl } = await uploadFileToImageStore(imageBuffer);
    recipeData.imageUrl = imageUrl;
  }

  if (recipeData.instructions) {
    recipeData.instructions = sanitizeHtml(recipeData.instructions);
  }

  const result = await updateRecipe({
    recipeData,
    recipeId: id,
    tagsToAdd,
    tagsToRemove,
  });

  revalidatePath(`/recipes/${id}`);
  return result;
};
