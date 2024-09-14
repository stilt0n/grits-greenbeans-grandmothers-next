import * as db from '@/lib/database';
import { GalleryPagination } from './gallery-pagination.client';
import { RecipeCard } from './recipe-card';
import { z } from 'zod';
import { NextSearchParams } from '@/types/nextTypes';
import { cn } from '@/lib/utils';

export interface LoadRecipeArgs {
  page: number;
  pageSize: number;
  filter?: string;
}

export type LoadRecipeAction = (
  args: LoadRecipeArgs
) => Promise<ReturnedRecipeInfo>;

export type LoadPageCountAction = (
  args: Omit<LoadRecipeArgs, 'page'>
) => Promise<number>;

export interface RecipeGalleryProps {
  loadRecipeAction: LoadRecipeAction;
  loadPageCountAction: LoadPageCountAction;
  page: number;
  pageSize?: number;
  className?: string;
}

const defaultPageSize = 10;

/**
 * The reason recipe loaders are not hardcoded is for dependency injection purposes.
 * `createRecipeProps` takes the work out of creating recipe loaders for recipe gallery
 * it operates similarly to setup hooks, but is not a hook.
 */
export const createRecipeProps = (
  searchParams: NextSearchParams,
  options: { pageSize: number } = { pageSize: defaultPageSize }
) => {
  // we don't want to crash when there are unexpected search params
  // or when the params are undefined. We can instead default to page 1
  const { success, data } = searchParamsSchema.safeParse(searchParams);
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
  const loadPageCountAction: LoadPageCountAction = async ({
    pageSize,
    filter,
  }) => {
    'use server';
    console.log(`using filter ${filter ?? 'none'}`);
    const [{ count }] = await db.getRecipeCount();
    return Math.ceil(count / pageSize);
  };
  return {
    loadRecipeAction,
    loadPageCountAction,
    page: success ? data.page : 1,
    pageSize: options.pageSize,
  };
};

const RecipeGallery = async ({
  page,
  pageSize = defaultPageSize,
  ...props
}: RecipeGalleryProps) => {
  const pageCount = await props.loadPageCountAction({ pageSize });
  const recipes = await props.loadRecipeAction({ page, pageSize });
  return (
    <>
      <ul className={cn('w-full grid grid-cols-9 gap-4', props.className)}>
        {recipes.map((recipe) => (
          <li key={recipe.title} className='col-span-7 col-start-2 h-96'>
            <RecipeCard {...recipe} href='#' />
          </li>
        ))}
      </ul>
      <GalleryPagination pageCount={pageCount} />
    </>
  );
};

const returnedRecipesSchema = z.array(
  z.object({
    title: z.string(),
    description: z.string(),
    imageUrl: z.string().optional().nullable(),
  })
);

const searchParamsSchema = z.object({
  page: z.coerce.number(),
});

type ReturnedRecipeInfo = z.infer<typeof returnedRecipesSchema>;

export default RecipeGallery;
