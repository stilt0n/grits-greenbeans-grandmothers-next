import type { SQLiteSelect, SelectedFields } from 'drizzle-orm/sqlite-core';
import { count, like, eq, inArray } from 'drizzle-orm';
import { db } from '@/db';
import { recipes, tags, recipesToTags, type InsertRecipe } from '@/db/schema';
import { RecipeData } from '@/types/recipeTypes';

type FieldKeys = keyof InsertRecipe;

export interface GetRecipeArgs {
  fields?: FieldKeys[];
  paginate?: {
    page: number;
    pageSize: number;
  };
  filter?: string;
  id?: number;
}

const queryFromKeys = (
  keys: FieldKeys[] | undefined
): SelectedFields | undefined => {
  if (!keys?.length) {
    return undefined;
  }

  return Object.fromEntries(
    keys.map((key) => [key, recipes[key]])
  ) as SelectedFields;
};

const withPagination = <T extends SQLiteSelect>(
  qb: T,
  page: number,
  pageSize: number
) => {
  return qb.limit(pageSize).offset((page - 1) * pageSize);
};

const withId = <T extends SQLiteSelect>(qb: T, id: number) => {
  return qb.where(eq(recipes.id, id));
};

const withFilter = <T extends SQLiteSelect>(qb: T, filter: string) => {
  return qb.where(like(recipes.title, `%${filter}%`));
};

export const getRecipes = async ({
  fields,
  paginate,
  filter,
  id,
}: GetRecipeArgs) => {
  const selectedFields = queryFromKeys(fields);
  const qb = selectedFields
    ? db.select(selectedFields).from(recipes).$dynamic()
    : db.select().from(recipes).$dynamic();

  if (filter) {
    withFilter(qb, filter);
  }

  if (id) {
    withId(qb, id);
  }

  if (paginate) {
    withPagination(qb, paginate.page, paginate.pageSize);
  }

  return qb;
};

export const getRecipeCount = async () => {
  return db.select({ count: count() }).from(recipes);
};

export const createRecipeWithTags = async (recipeWithTags: RecipeData) => {
  const { tags: tagArray, ...recipe } = recipeWithTags;
  return db.transaction(async (tx) => {
    const tagValues = tagArray?.map((name) => ({ name }));
    const [{ recipeId }] = await tx
      .insert(recipes)
      .values(recipe)
      .returning({ recipeId: recipes.id });
    if (tagArray && tagValues && tagValues.length > 0) {
      await tx.insert(tags).values(tagValues).onConflictDoNothing();

      // we use select instead of `returning` here because when
      // there is a confilict returning will return nothing.
      // we still need all tagIds for the next step so we have
      // to ensure we get them by selecting them manually
      const tagIds = await tx
        .select({ tagId: tags.id })
        .from(tags)
        .where(inArray(tags.name, tagArray));

      // TODO: if a tag already exists it will not be returned by
      // the returning clause so we will need to fetch it from the
      // database before inserting creating the recipeTagValues
      const recipeTagValues = tagIds.map(({ tagId }) => ({
        recipeId,
        tagId,
      }));

      // TODO: I've updated the schema to require that recipeId + tagId
      // is unique so that we don't insert multiple copies of the same
      // relationship. I need to run a new database migration before
      // this will work.
      return tx
        .insert(recipesToTags)
        .values(recipeTagValues)
        .onConflictDoNothing()
        .returning({ recipeToTagId: recipesToTags.id });
    }
  });
};

/**
 * @deprecated - I use this in the seed script but that script should not be run anymore
 */
export const createRecipe = async (...recipe: InsertRecipe[]) => {
  return db.insert(recipes).values(recipe).returning({ recipeId: recipes.id });
};

export const updateRecipe = async (
  id: number,
  recipe: Partial<InsertRecipe>
) => {
  return db.update(recipes).set(recipe).where(eq(recipes.id, id));
};
/**
 * @internal
 */
export const resetRecipes = async () => {
  console.warn(
    'this function has been disabled because it is dangerous. You can uncomment its contents if you REALLY need it.'
  );
  // return db.delete(recipes);
};
