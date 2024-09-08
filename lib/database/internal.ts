import { db } from '@/db';
import { recipes, InsertRecipe } from '@/db/schema';

// It will probably make sense to give all get methods arguments to support
// lazy loading if there could plausibly be a large number of values returned
export const getRecipes = async () => {
  return db.select().from(recipes);
};

export const createRecipe = async (...recipe: InsertRecipe[]) => {
  return db.insert(recipes).values(recipe);
};

/**
 * @internal
 */
export const resetRecipes = async () => {
  return db.delete(recipes);
};
