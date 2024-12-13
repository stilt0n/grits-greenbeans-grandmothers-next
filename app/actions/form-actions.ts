'use server';
import sanitizeHtml from 'sanitize-html';
import { currentUser } from '@clerk/nextjs/server';
import {
  cropCoordinateSchema,
  tagsSchema,
  type ParsedRecipeFormData,
  type RecipeData,
} from '@/types/recipeTypes';
import * as db from '@/lib/database';
import { uploadFileToImageStore } from '@/lib/image-store';
import { hasElevatedPermissions } from '@/lib/auth';
import { preprocessImage } from '@/lib/images';
import { formDataToRecipe, formDataToRecipePartial } from '@/lib/formUtils';
import { revalidatePath } from 'next/cache';

let isSubmitting = false;

const parseFormData = ({
  image,
  cropCoordinates: cropCoordinateString,
  tags: tagsString,
  ...baseRecipeData
}: ParsedRecipeFormData) => {
  let cropCoordinates = null;
  if (image !== undefined && cropCoordinateString !== null) {
    cropCoordinates = parseCropCoordinates(cropCoordinateString);
  }
  const tags = parseTags(tagsString);
  return {
    image,
    cropCoordinates,
    baseRecipeData: {
      ...baseRecipeData,
      tags,
    },
  };
};

const parseCropCoordinates = (cropCoordinateString: string) => {
  const cropCoordinates = cropCoordinateSchema.parse(
    JSON.parse(cropCoordinateString)
  );
  return cropCoordinates;
};

const parseTags = (tagsString: string | null) => {
  if (tagsString === null) return null;
  const tags = tagsSchema.parse(JSON.parse(tagsString));
  return tags;
};

export const recipeCreateAction = async (
  formData: FormData,
  dryRun: boolean = false
) => {
  // this route should already be protected by middleware but it seems safest to go ahead and do this check anyway
  const user = await currentUser();
  if (!hasElevatedPermissions(user)) {
    console.error(
      'CRITICAL: an unauthorized user accessed a protected route and attempted an action. User info:'
    );
    console.error(user);
    return;
  }
  // TODO: this is a bad solution and I should probably properly debounce this instead
  if (isSubmitting) {
    console.log('other submission is in process. Cancelling submission');
    return;
  }

  try {
    isSubmitting = true;

    // convert form data back to recipe
    const data = formDataToRecipe(formData);
    // parse the form data
    const { image, cropCoordinates, baseRecipeData } = parseFormData(data);

    let recipeData: RecipeData = { ...baseRecipeData, imageUrl: null };
    // upload image to b2 if relevant
    if (image !== undefined && cropCoordinates !== null) {
      const imageBuffer = await preprocessImage(image, cropCoordinates);
      if (!imageBuffer) {
        console.log('no image buffer!');
        return;
      }
      const { imageUrl } = await uploadFileToImageStore(imageBuffer);
      recipeData.imageUrl = imageUrl;
    }
    // The html from TipTap is already sanitized but it is still
    // possible for a user to submit malicious code directly to
    // the api. So we sanitize it here to be safe.
    recipeData.instructions = sanitizeHtml(recipeData.instructions);
    // for now I just want to get this data visible on the server
    console.log(`inserting data:\n${recipeData}`);
    if (dryRun) {
      console.log('skipping database update because this is a dry run...');
      return;
    }

    return db.createRecipeWithTags(recipeData);
  } finally {
    // want to guarantee that this is reset
    isSubmitting = false;
  }
};

export const recipeUpdateAction = async (
  formData: FormData,
  id: number,
  dryRun: boolean = false
) => {
  const user = await currentUser();
  if (!hasElevatedPermissions(user)) {
    console.error(
      'CRITICAL: an unauthorized user accessed a protected route and attempted an action. User info:'
    );
    console.error(user);
    return;
  }

  if (isSubmitting) {
    console.log('other submission is in process. Cancelling submission');
    return;
  }

  try {
    isSubmitting = true;

    const {
      image,
      cropCoordinates: cropCoordinateString,
      ...data
    } = formDataToRecipePartial(formData);

    let imageUrl = undefined;
    if (image !== undefined && cropCoordinateString != null) {
      const cropCoordinates = parseCropCoordinates(cropCoordinateString);
      const imageBuffer = await preprocessImage(image, cropCoordinates);
      if (!imageBuffer) {
        console.log('no image buffer!');
        return;
      }
      // TODO: delete old image if it exists
      const { imageUrl: uploadedImageUrl } =
        await uploadFileToImageStore(imageBuffer);
      imageUrl = uploadedImageUrl;
    }

    if (data.instructions) {
      data.instructions = sanitizeHtml(data.instructions);
    }
    console.log(`updating recipe ${id} with data: \n`);
    console.log(data);
    if (!dryRun) {
      await db.updateRecipe(id, { ...data, imageUrl });
      revalidatePath(`/recipes/${id}`);
      return;
    }
    console.log('skipping database update because this is a dry run...');
  } finally {
    isSubmitting = false;
  }
};
