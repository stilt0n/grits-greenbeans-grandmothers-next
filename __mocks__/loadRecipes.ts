'use server';

import type { RecipeData } from '@/types/recipeTypes';
import { images } from '@/lib/constants';

const createDummyRecipes = (count: number): RecipeData[] => {
  return [...Array(count)].map((_, i) => ({
    title: `Recipe ${i}`,
    instructions: '<h2>Do it!</h2>',
    author: 'grandmother_bot',
    imageUrl: images.greenbeans,
    recipeTime: '10 minutes',
  }));
};

interface LoadRecipeProps {
  startIndex?: number;
  limit?: number;
  filter?: string;
}

const mockDatabase = createDummyRecipes(200);

export const loadRecipes = ({
  startIndex = 0,
  limit = 10,
  filter,
}: LoadRecipeProps) => {
  const filteredDatabase = filter
    ? mockDatabase.filter(({ title }) => title.includes(filter))
    : mockDatabase;
  return mockDatabase.slice(startIndex, startIndex + limit);
};
