'use server';

import type { RecipeData } from '@/types/recipeTypes';

export const formSubmitAction = (data: RecipeData) => {
  // for now I just want to get this data visible on the server
  console.log(data);
};
