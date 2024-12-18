'use server';

import { getRecipeCount } from '@/lib/repository/recipe-store/query';

interface LoadPageCountArgs {
  pageSize: number;
  filter?: string;
  debug?: boolean;
}

export const loadPageCountAction = async ({
  pageSize,
  filter,
  debug,
}: LoadPageCountArgs) => {
  const [{ count }] = await getRecipeCount(filter);
  if (debug) {
    console.log(`Got page count ${count}`);
  }
  return Math.ceil(count / pageSize);
};
