'use server';
import sanitizeHtml from 'sanitize-html';
import { currentUser } from '@clerk/nextjs/server';
import {
  cropCoordinateSchema,
  type RecipeFormData,
  type RecipeData,
  type CropCoordinates,
} from '@/types/recipeTypes';
import * as db from '@/lib/database';
import { hasElevatedPermissions } from '@/lib/auth';

let isSubmitting = false;

const parseFormData = (data: RecipeFormData) => {
  const {
    imageFileList,
    cropCoordinates: cropCoordinateString,
    ...baseRecipeData
  } = data;

  let cropCoordinates = null,
    imageFile = null;
  if (imageFileList !== null && cropCoordinateString !== null) {
    cropCoordinates = cropCoordinateSchema.parse(
      JSON.parse(cropCoordinateString)
    );
    imageFile = imageFileList[0];
  }

  return { cropCoordinates, imageFile, baseRecipeData };
};

// TODO: implement this and split cropping and uploading into two separate functoin calls
const uploadImageToS3 = async (
  imageFile: File,
  cropCoordinates: CropCoordinates
) => {
  console.log(imageFile.name);
  console.log(cropCoordinates);
  return 'dummyurl';
};

export const recipeCreateAction = async (data: RecipeFormData) => {
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
    // parse the form data
    const { imageFile, cropCoordinates, baseRecipeData } = parseFormData(data);

    let recipeData: RecipeData = { ...baseRecipeData, imageUrl: null };
    // upload image to s3 if relevant
    if (imageFile !== null && cropCoordinates !== null) {
      recipeData.imageUrl = await uploadImageToS3(imageFile, cropCoordinates);
    }
    // The html from TipTap is already sanitized but it is still
    // possible for a user to submit malicious code directly to
    // the api. So we sanitize it here to be safe.
    recipeData.instructions = sanitizeHtml(recipeData.instructions);
    // for now I just want to get this data visible on the server
    console.log(`inserting data:\n${recipeData}`);
    // return db.createRecipe(recipeData);
  } finally {
    // want to guarantee that this is reset
    isSubmitting = false;
  }
};

export const recipeUpdateAction = async (
  data: Partial<RecipeData>,
  id: number
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
    if (data.instructions) {
      data.instructions = sanitizeHtml(data.instructions);
    }
    console.log(`updating recipe ${id} with data:\n${data}`);
    await db.updateRecipe(id, data);
  } finally {
    isSubmitting = false;
  }
};
