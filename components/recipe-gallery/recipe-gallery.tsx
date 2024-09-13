import * as db from '@/lib/database';
import { GalleryPagination } from './gallery-pagination.client';
import { RecipeCard, type RecipeCardProps } from './recipe-card';
import { z } from 'zod';

export interface LoadRecipeArgs {
  page: number;
  pageSize: number;
  filter?: string;
}

export type LoadRecipeAction = (
  args: LoadRecipeArgs
) => Promise<ReturnedRecipeInfo>;

export type LoadPageCountAction = (
  args?: Pick<LoadRecipeArgs, 'filter'>
) => Promise<number>;

export interface RecipeGalleryProps {
  loadRecipeAction: LoadRecipeAction;
  loadPageCountAction: LoadPageCountAction;
  page: number;
  pageSize?: number;
}

/**
 * The reason recipe loaders are not hardcoded is for dependency injection purposes.
 * `createRecipeLoaders` takes the work out of creating recipe loaders for recipe gallery
 * it operates similarly to setup hooks, but is not a hook.
 */
export const createRecipeLoaders = () => {
  const loadRecipeAction: LoadRecipeAction = async ({
    page,
    pageSize,
    filter,
  }) => {
    'use server';
    console.log(`using filter ${filter}`);
    const result = await db.getRecipes({
      fields: ['title', 'description', 'imageUrl'],
      paginate: { page, pageSize },
    });
    const recipes = returnedRecipesSchema.parse(result);
    return recipes;
  };
  // TODO: this can probably be cached
  const loadPageCountAction: LoadPageCountAction = async (args) => {
    'use server';
    console.log(`using filter ${args?.filter ?? 'none'}`);
    const [{ count }] = await db.getRecipeCount();
    return count;
  };
  return { loadRecipeAction, loadPageCountAction };
};

const RecipeGallery = async ({
  page,
  pageSize = 10,
  ...props
}: RecipeGalleryProps) => {
  const pageCount = await props.loadPageCountAction();
  const recipes = await props.loadRecipeAction({ page, pageSize });
  return (
    <div>
      <div className='gallery'>
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.title} {...recipe} href='#' />
        ))}
      </div>
      <GalleryPagination pageCount={pageCount} />
    </div>
  );
};

const returnedRecipesSchema = z.array(
  z.object({
    title: z.string(),
    description: z.string(),
    imageUrl: z.string().optional().nullable(),
  })
);

type ReturnedRecipeInfo = z.infer<typeof returnedRecipesSchema>;

export default RecipeGallery;
