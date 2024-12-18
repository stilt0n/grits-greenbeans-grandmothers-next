import { ColumnKey, splitRecipeAndTags, queryFromKeys } from './utils';
import { db } from '@/db';

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
  // const recipeKeys = keys?.filter((key) => key !== 'tags');
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
