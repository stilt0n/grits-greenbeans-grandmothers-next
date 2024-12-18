import { recipes } from '@/db/schema';
import { RecipePageData } from '@/lib/translation/schema';
import { like, eq } from 'drizzle-orm';

export type ColumnKey = keyof RecipePageData;
export type QueryColumnKey = Exclude<ColumnKey, 'tags'>;

export const queryFromKeys = (keys: QueryColumnKey[]) => {
  if (keys.length === 0) {
    throw new TypeError('query from keys expects a non-empty array.');
  }
  return Object.fromEntries(keys.map((key) => [key, true]));
};

export const splitRecipeAndTags = (keys: (keyof RecipePageData)[]) => ({
  recipeKeys: keys.filter((key) => key !== 'tags'),
  includeTags: keys.includes('tags'),
});

export const createPaginateClause = (page: number, pageSize: number) => ({
  limit: pageSize,
  offset: (page - 1) * pageSize,
});

export const createWhereIdClause = (id: number) => ({
  where: eq(recipes.id, id),
});

export const createWhereSearchClause = (searchString: string) => ({
  where: like(recipes.title, `%${searchString}%`),
});
