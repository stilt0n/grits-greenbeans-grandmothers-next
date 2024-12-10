import * as db from '@/lib/database';
import { GalleryPagination } from './gallery-pagination.client';
import { RecipeCard } from './recipe-card.client';
import { z } from 'zod';
import { NextSearchParams } from '@/types/nextTypes';
import { cn } from '@/lib/utils';
import { Suspense } from 'react';
import { unstable_noStore as noStore } from 'next/cache';

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
  page: number;
  loadRecipeAction?: LoadRecipeAction;
  loadPageCountAction?: LoadPageCountAction;
  pageSize?: number;
  className?: string;
  filter?: string;
}

const defaultPageSize = 10;

export const createSearchParamProps = (searchParams: NextSearchParams) => {
  // Zod will return undefined if there are extra search params values and we parse them directly
  // I'd rather just ignore these params and handle valid params correctly whenever present
  const { page, query } = searchParams;
  const { data } = searchParamsSchema.safeParse({ page, query });
  return {
    page: data?.page ?? 1,
    filter: data?.query,
  };
};

const defaultLoadRecipeAction: LoadRecipeAction = async ({
  page,
  pageSize,
  filter,
}) => {
  'use server';
  console.log(`using filter ${filter}`);
  const result = await db.getRecipes({
    fields: ['id', 'title', 'description', 'imageUrl', 'author'],
    paginate: { page, pageSize },
    filter,
  });
  const recipes = returnedRecipesSchema.parse(result);
  return recipes;
};

const defaultLoadPageCountAction: LoadPageCountAction = async ({
  pageSize,
  filter,
}) => {
  'use server';
  console.log(`using filter ${filter ?? 'none'}`);
  const [{ count }] = await db.getRecipeCount();
  return Math.ceil(count / pageSize);
};

const RecipeGallery = async ({
  page,
  pageSize = defaultPageSize,
  filter,
  loadPageCountAction = defaultLoadPageCountAction,
  loadRecipeAction = defaultLoadRecipeAction,
  ...props
}: RecipeGalleryProps) => {
  // TODO: improve on this by being more granular with caching strategy
  noStore();
  const pageCount = await loadPageCountAction({ pageSize });
  const recipes = await loadRecipeAction({ page, pageSize, filter });
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ul className={cn('w-full grid grid-cols-9 gap-4', props.className)}>
        {recipes.map((recipe) => {
          const { id, ...recipeProps } = recipe;
          return (
            <li key={recipeProps.title} className='col-span-7 col-start-2 h-96'>
              <RecipeCard {...recipeProps} href={`/recipes/${id}`} />
            </li>
          );
        })}
      </ul>
      <GalleryPagination pageCount={pageCount} />
    </Suspense>
  );
};

const returnedRecipesSchema = z.array(
  z.object({
    id: z.number(),
    title: z.string(),
    description: z.string(),
    imageUrl: z.string().optional().nullable(),
    author: z.string().optional().nullable(),
  })
);

const searchParamsSchema = z.object({
  page: z.coerce.number().optional(),
  query: z.string().optional(),
});

type ReturnedRecipeInfo = z.infer<typeof returnedRecipesSchema>;

export default RecipeGallery;
