'use server';

import sanitizeHtml from 'sanitize-html';
import { currentUser } from '@clerk/nextjs/server';
import { hasElevatedPermissions } from '@/lib/auth';
import { convertFormDataToRecipe } from '@/lib/translation/parsers';
import { fileToImageBuffer } from '@/lib/repository/image-store/utils';
import { uploadFileToImageStore } from '@/lib/repository/image-store/upload';
import { RecipePageData } from '@/lib/translation/schema';
import { createRecipe } from '@/lib/repository/recipe-store/create';

export const createRecipeAction = async (formData: FormData) => {
  // middleware should already be protecting this route, but this serves
  // as a fallback if that ever becomes untrue.
  const user = await currentUser();
  if (!hasElevatedPermissions(user)) {
    console.error(
      'SECURITY: an unauthorized user accessed a protected route and attempted an action. User info:'
    );
    console.error(user);
    return;
  }

  let recipeData: RecipePageData;
  try {
    const { image, ...recipe } = convertFormDataToRecipe(formData);
    recipeData = { ...recipe, imageUrl: null };
    if (image) {
      const processed = await fileToImageBuffer(image);
      if (!processed) {
        return;
      }
      const { imageUrl } = await uploadFileToImageStore(processed);
      recipeData.imageUrl = imageUrl;
    }
  } catch (error) {
    console.error('Failed to create recipe from form data', error);
    return;
  }

  // The html from TipTap is already sanitized but we do it here
  // as well in case someone submits malicious HTML directly to
  // the API endpoint instead of going through the GUI
  recipeData.instructions = sanitizeHtml(recipeData.instructions);

  return createRecipe(recipeData);
};
