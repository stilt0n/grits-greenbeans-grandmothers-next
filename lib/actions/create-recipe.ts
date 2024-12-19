'use server';

import sanitizeHtml from 'sanitize-html';
import { revalidatePath } from 'next/cache';
import { currentUser } from '@clerk/nextjs/server';
import { hasElevatedPermissions } from '@/lib/auth';
import { convertFormDataToRecipe } from '@/lib/translation/parsers';
import { preprocessImage } from '@/lib/repository/image-store/utils';
import { uploadFileToImageStore } from '@/lib/repository/image-store/upload';
import { RecipePageData } from '@/lib/translation/schema';
import { createRecipe } from '@/lib/repository/recipe-store/create';

const xor = (a: any, b: any) => !!((a || b) && !(a && b));

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

  const { image, cropCoordinates, ...recipe } =
    convertFormDataToRecipe(formData);

  if (xor(image, cropCoordinates)) {
    console.error(
      'Assertion error: unexpectedly recieved only one of image and cropCoordinates'
    );
  }

  const recipeData: RecipePageData = { ...recipe, imageUrl: null };
  if (image && cropCoordinates) {
    // upload image
    const imageBuffer = await preprocessImage(image, cropCoordinates);
    if (!imageBuffer) {
      console.error('Image preprocessing failed to produce an image buffer');
      return;
    }
    const { imageUrl } = await uploadFileToImageStore(imageBuffer);
    recipeData.imageUrl = imageUrl;
  }

  // The html from TipTap is already sanitized but we do it here
  // as well in case someone submits malicious HTML directly to
  // the API endpoint instead of going through the GUI
  recipeData.instructions = sanitizeHtml(recipeData.instructions);

  return createRecipe(recipeData);
};
