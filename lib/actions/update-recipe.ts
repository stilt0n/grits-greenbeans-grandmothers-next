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

  let recipeData: Partial<RecipePageData>;
  let tagsToAdd: string[];
  let tagsToRemove: string[];
  try {
    const { image, tags, ...recipe } = convertFormDataToRecipe(formData, {
      optional: true,
    });

    const previousTags = await getRecipeTags(id);
    ({ tagsToAdd, tagsToRemove } = getTagOperations(previousTags, tags ?? []));

    recipeData = { ...recipe };
    if (image) {
      const processed = await fileToImageBuffer(image);
      if (!processed) {
        return;
      }
      const { imageUrl } = await uploadFileToImageStore(processed);
      recipeData.imageUrl = imageUrl;
    }
  } catch (error) {
    console.error('Failed to update recipe from form data', error);
    return;
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
