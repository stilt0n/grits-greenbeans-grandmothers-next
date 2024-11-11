'use server';
import sanitizeHtml from 'sanitize-html';
import { currentUser } from '@clerk/nextjs/server';
import type { RecipeActionData, RecipeData } from '@/types/recipeTypes';
import * as db from '@/lib/database';
import { hasElevatedPermissions } from '@/lib/auth';

let isSubmitting = false;

export const recipeCreateAction = async (data: RecipeActionData) => {
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
    // The html from TipTap is already sanitized but it is still
    // possible for a user to submit malicious code directly to
    // the api. So we sanitize it here to be safe.
    data.instructions = sanitizeHtml(data.instructions);
    // for now I just want to get this data visible on the server
    console.log(`inserting data:\n${data}`);
    // return db.createRecipe(data);
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
