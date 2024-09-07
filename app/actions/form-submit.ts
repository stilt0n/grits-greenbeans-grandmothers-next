'use server';

import type { RecipeData } from '@/types/recipeTypes';
import * as db from '@/lib/database';

const mockDb: RecipeData[] = [];

let isSubmitting = false;

export const formSubmitAction = async (data: RecipeData) => {
  if (isSubmitting) {
    // TODO: this is a bad solution and I should probably properly debounce this instead
    console.log('other submission is in process. Cancelling submission');
    return;
  }
  isSubmitting = true;
  // for now I just want to get this data visible on the server
  console.log(`inserting data:\n${data}`);
  await db.createRecipe(data);
  isSubmitting = false;
};
