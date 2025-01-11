import { SQLiteSelect } from 'drizzle-orm/sqlite-core';
import {
  ColumnKey,
  splitRecipeAndTags,
  queryFromKeys,
  createWhereIdClause,
} from './utils';
import { db } from '@/db';
import { recipes } from '@/db/schema';
import { count, eq, ilike } from 'drizzle-orm';
import { getTagsUtilitySchema } from '@/lib/translation/utils';

interface GetRecipeWithTagsArgs {
  keys: ColumnKey[];
  paginateClause?: PaginateClause;
  whereClause?: WhereClause;
  debug?: boolean;
}

interface PaginateClause {
  limit: number;
  offset: number;
}

interface WhereClause {
  where: any;
}

export const getRecipes = async ({
  keys,
  paginateClause,
  whereClause,
  debug,
}: GetRecipeWithTagsArgs) => {
  const { recipeKeys, includeTags } = splitRecipeAndTags(keys);
  if (recipeKeys.length === 0) {
    throw new TypeError(
      'getRecipesWithTags must include at least one valid recipe field. If you want to select all keys pass undefined to `keys` instead of an empty array'
    );
  }

  const columns = queryFromKeys(recipeKeys);

  // get query pagination
  // get where clause
  const results = await db.query.recipes.findMany({
    columns,
    ...whereClause,
    ...paginateClause,
    with: {
      recipesToTags: {
        columns: {},
        with: {
          tag: {
            columns: {
              name: true,
            },
          },
        },
      },
    },
  });

  const mergedResults = results.map((result) => {
    const { recipesToTags, ...recipe } = result;

    if (!includeTags) {
      return recipe;
    }

    const tags = recipesToTags
      .map((item) => {
        return item?.tag?.name;
      })
      .filter((item) => item != null);

    return { ...recipe, tags };
  });

  if (debug) {
    console.log(mergedResults);
  }

  return mergedResults;
};

const withFilter = <T extends SQLiteSelect>(qb: T, filter: string) => {
  return qb.where(ilike(recipes.title, `%${filter}%`));
};

export const getRecipeCount = (searchString?: string) => {
  const qb = db.select({ count: count() }).from(recipes).$dynamic();
  if (searchString) {
    withFilter(qb, searchString);
  }

  return qb;
};

export const getRecipeTags = async (recipeId: number) => {
  const result = await getRecipes({
    keys: ['id', 'tags'],
    whereClause: createWhereIdClause(recipeId),
  });
  const [{ tags }] = getTagsUtilitySchema.parse(result);
  return tags ?? [];
};

export const getRecipeImageUrl = async (recipeId: number) => {
  const result = await db
    .select({ imageUrl: recipes.imageUrl })
    .from(recipes)
    .where(eq(recipes.id, recipeId));

  if (result.length === 1) {
    return result[0].imageUrl;
  }

  return null;
};
