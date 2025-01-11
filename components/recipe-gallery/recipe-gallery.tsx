import { GalleryPagination } from './gallery-pagination.client';
import { RecipeCard } from './recipe-card.client';
import type { NextSearchParams } from '@/types/nextTypes';
import {
  searchParamsSchema,
  type SearchCategory,
} from '@/lib/translation/schema';
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
  category?: SearchCategory;
}

const defaultPageSize = 10;

export const createSearchParamProps = (searchParams: NextSearchParams) => {
  // Zod will return undefined if there are extra search params values and we parse them directly
  // I'd rather just ignore these params and handle valid params correctly whenever present
  const { page, query, category } = searchParams;
  const { data } = searchParamsSchema.safeParse({ page, query });
  return {
    page: data?.page ?? 1,
    filter: data?.query,
    category,
  };
};

const RecipeGallery = async ({
  page,
  pageSize = defaultPageSize,
  filter,
  category,
  loadPageCountAction = defaultLoadPageCountAction,
  loadRecipeAction = loadGalleryPageAction,
  ...props
}: RecipeGalleryProps) => {
  // TODO: improve on this by being more granular with caching strategy
  noStore();
  const pageCount = await loadPageCountAction({ pageSize, filter, category });
  const recipes = await loadRecipeAction({ page, pageSize, filter, category });
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ul className={cn('w-full grid grid-cols-9 gap-4', props.className)}>
        {recipes.map((recipe) => {
          const { id, ...recipeProps } = recipe;
          return (
            <li
              key={recipeProps.title}
              className='col-span-7 col-start-2 h-[28rem]'
            >
              <RecipeCard {...recipeProps} href={`/recipes/${id}`} />
            </li>
          );
        })}
      </ul>
      <GalleryPagination pageCount={pageCount} />
    </Suspense>
  );
};

export default RecipeGallery;
