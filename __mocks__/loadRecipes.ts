'use server';

import type { RecipeData } from '@/types/recipeTypes';
import { images } from '@/lib/constants';
import type {
  LoadRecipeAction,
  LoadPageCountAction,
} from '@/components/recipe-gallery';

const createDummyRecipes = (count: number): RecipeData[] => {
  return [...Array(count)].map((_, i) => ({
    title: `Recipe ${i}`,
    instructions: '<h2>Do it!</h2>',
    author: 'grandmother_bot',
    description: `This is grandmother_bot's favorite way to make the world famous Recipe ${i} dish!`,
    imageUrl: images.greenbeans,
    recipeTime: '10 minutes',
  }));
};

const mockDatabase = createDummyRecipes(200);

const makeFilter =
  (filterValue: string, func: 'startsWith' | 'includes' = 'includes') =>
  ({ title }: RecipeData) =>
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
    .map(({ title, description, imageUrl }) => ({
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
