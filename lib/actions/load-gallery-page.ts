'use server';

import { galleryItemSchema } from '@/lib/translation/schema';
import {
  createPaginateClause,
  createWhereSearchClause,
} from '@/lib/repository/recipe-store/utils';
import { getRecipes } from '@/lib/repository/recipe-store/query';
import { z } from 'zod';

export interface LoadGalleryArgs {
  page: number;
  pageSize: number;
  filter?: string;
  debug?: boolean;
}

export const loadGalleryPageAction = async ({
  page,
  pageSize,
  filter,
  debug,
}: LoadGalleryArgs) => {
  const result = await getRecipes({
    keys: ['id', 'title', 'description', 'imageUrl', 'author'],
    paginateClause: createPaginateClause(page, pageSize),
    whereClause: filter ? createWhereSearchClause(filter) : undefined,
  });

  if (debug) {
    console.log(result);
  }

  const recipes = z.array(galleryItemSchema).parse(result);
  return recipes;
};
