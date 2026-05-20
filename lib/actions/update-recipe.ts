'use server';

import sanitizeHtml from 'sanitize-html';
import { currentUser } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { hasElevatedPermissions } from '@/lib/auth';
import { getRecipeTags } from '@/lib/repository/recipe-store/read';
import { convertFormDataToRecipe } from '@/lib/translation/parsers';
import { fileToImageBuffer } from '@/lib/repository/image-store/utils';
import { uploadFileToImageStore } from '@/lib/repository/image-store/upload';
import { RecipePageData } from '@/lib/translation/schema';
import { updateRecipe } from '@/lib/repository/recipe-store/update';
import { getTagOperations } from './action-utils';

export interface UpdateRecipeActionArgs {
  formData: FormData;
  id: number;
}

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

  const { image, tags, ...recipe } = convertFormDataToRecipe(formData, {
    optional: true,
  });

  const previousTags = await getRecipeTags(id);
  const { tagsToAdd, tagsToRemove } = getTagOperations(
    previousTags,
    tags ?? []
  );

  const recipeData: Partial<RecipePageData> = { ...recipe };
  if (image) {
    const imageBuffer = await fileToImageBuffer(image);
    if (!imageBuffer) {
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

  revalidatePath('/recipes/[slug]', 'page');
  return result;
};
