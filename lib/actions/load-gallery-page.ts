'use server';

import { galleryItemSchema, SearchCategory } from '@/lib/translation/schema';
import {
  createPaginateClause,
  createWhereSearchClause,
} from '@/lib/repository/recipe-store/utils';
import {
  getRecipes,
  getRecipesFilteredByTag,
} from '@/lib/repository/recipe-store/read';
import { z } from 'zod';

export interface LoadGalleryArgs {
  page: number;
  pageSize: number;
  filter?: string;
  category?: SearchCategory;
  debug?: boolean;
}

export const loadGalleryPageAction = async ({
  page,
  pageSize,
  filter,
  category = 'title',
  debug,
}: LoadGalleryArgs) => {
  let result;

  if (category !== 'tag') {
    result = await getRecipes({
      keys: ['id', 'title', 'description', 'imageUrl', 'author'],
      paginateClause: createPaginateClause(page, pageSize),
      whereClause: filter
        ? createWhereSearchClause(filter, category)
        : undefined,
    });
  } else {
    result = await getRecipesFilteredByTag({
      filter,
      offset: (page - 1) * pageSize,
      limit: pageSize,
    });
  }

  if (debug) {
    console.log(result);
  }

  const recipes = z.array(galleryItemSchema).parse(result);
  return recipes;
};
