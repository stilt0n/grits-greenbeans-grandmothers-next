import type { SQLiteSelect, SelectedFields } from 'drizzle-orm/sqlite-core';
import { count, like, eq } from 'drizzle-orm';
import { db } from '@/db';
import { recipes, InsertRecipe } from '@/db/schema';

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

export const createRecipe = async (...recipe: InsertRecipe[]) => {
  return db.insert(recipes).values(recipe);
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
  return db.delete(recipes);
};
