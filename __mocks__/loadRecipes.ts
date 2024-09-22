'use server';

import { images } from '@/lib/constants';
import type {
  LoadRecipeAction,
  LoadPageCountAction,
} from '@/components/recipe-gallery';

const createDummyRecipes = (count: number) => {
  return [...Array(count)].map((_, i) => ({
    id: i,
    title: `Recipe ${i}`,
    instructions: '<h2>Do it!</h2>',
    author: 'grandmother_bot',
    description: `This is grandmother_bot's favorite way to make the world famous Recipe ${i} dish!`,
    imageUrl: images.greenbeans,
    recipeTime: '10 minutes',
  }));
};

type DatabaseEntry = ReturnType<typeof createDummyRecipes>[0];

const mockDatabase = createDummyRecipes(200);

const makeFilter =
  (filterValue: string, func: 'startsWith' | 'includes' = 'includes') =>
  ({ title }: DatabaseEntry) =>
    title[func](filterValue);

export const mockLoadRecipeAction: LoadRecipeAction = async ({
  page = 0,
  pageSize = 10,
  filter,
}) => {
  const filteredDatabase = filter
    ? mockDatabase.filter(makeFilter(filter))
    : mockDatabase;
  return filteredDatabase
    .map(({ id, title, description, imageUrl }) => ({
      id,
      title,
      description,
      imageUrl,
    }))
    .slice(page * pageSize, (page + 1) * pageSize);
};

export const mockLoadPageCountAction: LoadPageCountAction = async ({
  filter,
  pageSize,
}) =>
  Math.ceil(mockDatabase.filter(makeFilter(filter ?? '')).length / pageSize);
