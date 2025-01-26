import { SearchCategory } from '@/lib/translation/schema';
import { getRecipeCount } from '@/lib/repository/recipe-store/read';

export interface LoadPageCountArgs {
  pageSize: number;
  filter?: string;
  category?: SearchCategory;
  debug?: boolean;
}

export const loadPageCount = async ({
  pageSize,
  filter,
  category,
  debug,
}: LoadPageCountArgs) => {
  const [{ count }] = await getRecipeCount(filter, category);
  if (debug) {
    console.log(
      `Got item count ${count} and page count ${Math.ceil(count / pageSize)}`
    );
  }
  return Math.ceil(count / pageSize);
};
