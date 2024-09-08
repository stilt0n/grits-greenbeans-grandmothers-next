'use server';
import { currentUser } from '@clerk/nextjs/server';
import type { RecipeData } from '@/types/recipeTypes';
import * as db from '@/lib/database';
import { hasElevatedPermissions } from '@/lib/auth';

let isSubmitting = false;

export const formSubmitAction = async (data: RecipeData) => {
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
  isSubmitting = true;
  // for now I just want to get this data visible on the server
  console.log(`inserting data:\n${data}`);
  await db.createRecipe(data);
  isSubmitting = false;
};
