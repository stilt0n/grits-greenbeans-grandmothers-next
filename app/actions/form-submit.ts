'use server';

import type { RecipeData } from '@/types/recipeTypes';

const mockDb: RecipeData[] = [];

export const formSubmitAction = (data: RecipeData) => {
  // for now I just want to get this data visible on the server
  console.log('inserting data:');
  console.log(data);
  mockDb.push(data);
  console.log(`recipe count: ${mockDb.length}`);
  console.log(
    `recipe titles:\n${mockDb.map((data) => data.title).join('\n')}\n`
  );
};
