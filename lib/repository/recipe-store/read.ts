import { SQLiteSelect } from 'drizzle-orm/sqlite-core';
import {
  ColumnKey,
  splitRecipeAndTags,
  queryFromKeys,
  createWhereIdClause,
} from './utils';
import { db } from '@/db';
import { recipes, recipesToTags, tags } from '@/db/schema';
import { count, countDistinct, eq, like } from 'drizzle-orm';
import { getTagsUtilitySchema } from '@/lib/translation/utils';
import { SearchCategory } from '@/lib/translation/schema';

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

interface GetRecipesFilteredByTagArgs {
  filter?: string;
  offset?: number;
  limit?: number;
}

const withPagination = <T extends SQLiteSelect>(
  qb: T,
  limit: number,
  offset?: number
) => {
  return qb.limit(limit).offset(offset ?? 0);
};
// I'm being lazy and not making this generic for now
// since it's only used for recipe gallery filtering
// if I ever need to use something similar I should
// refactor this to be more generic.
export const getRecipesFilteredByTag = async ({
  filter,
  offset,
  limit,
}: GetRecipesFilteredByTagArgs) => {
  let qb;

  // do not use join if there is no filter
  if (filter) {
    const sq = db
      .select({
        id: recipes.id,
        title: recipes.title,
        description: recipes.description,
        imageUrl: recipes.imageUrl,
        author: recipes.author,
      })
      .from(recipesToTags)
      .leftJoin(recipes, eq(recipes.id, recipesToTags.recipeId))
      .leftJoin(tags, eq(tags.id, recipesToTags.tagId))
      .where(like(tags.name, `%${filter}%`))
      .as('sq');

    qb = db
      .selectDistinct({
        id: sq.id,
        title: sq.title,
        description: sq.description,
        imageUrl: sq.imageUrl,
        author: sq.author,
      })
      .from(sq)
      .$dynamic();
  } else {
    qb = db
      .select({
        id: recipes.id,
        title: recipes.title,
        description: recipes.description,
        imageUrl: recipes.imageUrl,
        author: recipes.author,
      })
      .from(recipes)
      .$dynamic();
  }

  if (limit) {
    qb = withPagination(qb, limit, offset);
  }

  return qb;
};

const getRecipeCountFilteredByTags = (searchString?: string) => {
  if (!searchString) {
    return db.select({ count: count() }).from(recipes);
  }

  return db
    .select({ count: countDistinct(recipes.id) })
    .from(recipesToTags)
    .leftJoin(recipes, eq(recipes.id, recipesToTags.recipeId))
    .leftJoin(tags, eq(tags.id, recipesToTags.tagId))
    .where(like(tags.name, `%${searchString}%`));
};

const withFilter = <T extends SQLiteSelect>(
  qb: T,
  filter: string,
  filterColumn: 'title' | 'author' = 'title'
) => {
  return qb.where(like(recipes[filterColumn], `%${filter}%`));
};

export const getRecipeCount = (
  searchString?: string,
  category?: SearchCategory
) => {
  if (category === 'tag') {
    return getRecipeCountFilteredByTags(searchString);
  }
  const qb = db.select({ count: count() }).from(recipes).$dynamic();
  if (searchString) {
    withFilter(qb, searchString, category);
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
