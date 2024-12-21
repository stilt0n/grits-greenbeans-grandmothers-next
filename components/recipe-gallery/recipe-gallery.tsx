import { GalleryPagination } from './gallery-pagination.client';
import { RecipeCard } from './recipe-card.client';
import { z } from 'zod';
import { NextSearchParams } from '@/types/nextTypes';
import { cn } from '@/lib/utils';
import { Suspense } from 'react';
import { unstable_noStore as noStore } from 'next/cache';
import { loadGalleryPageAction } from '@/lib/actions/load-gallery-page';
import { loadPageCountAction as defaultLoadPageCountAction } from '@/lib/actions/load-page-count';

export type LoadRecipeAction = typeof loadGalleryPageAction;

export type LoadPageCountAction = typeof defaultLoadPageCountAction;

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

const RecipeGallery = async ({
  page,
  pageSize = defaultPageSize,
  filter,
  loadPageCountAction = defaultLoadPageCountAction,
  loadRecipeAction = loadGalleryPageAction,
  ...props
}: RecipeGalleryProps) => {
  // TODO: improve on this by being more granular with caching strategy
  noStore();
  const pageCount = await loadPageCountAction({ pageSize, filter });
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

const searchParamsSchema = z.object({
  page: z.coerce.number().optional(),
  query: z.string().optional(),
});

export default RecipeGallery;
