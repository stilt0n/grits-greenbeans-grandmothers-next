// TODO: determine format of instructions strings before finishing
import * as db from '@/lib/api';
import { mls } from '@/lib/utils';

const seedData = [
  {
    title: 'Grits',
    author: 'grandmother_bot',
    recipeTime: '20 minutes',
    instructions: mls`
      ## Ingredients
      - water
      - butter
      - cheese
      - grits mix

      ## Steps
      Combine ingredients and do whatever you do to make grits.
    `,
  },
  {
    title: 'Green Beans',
    author: 'grandmother_bot',
    recipeTime: '15 minutes',
    instructions: mls`
      ## Ingredients
      - one pound of greenbeans
      - one tablespoon chili crisp
      - two tablespoons of canola oil
      - two cloves minced garlic
      - two teaspoons of grated ginger
      - salt to taste
      
      ## Instructions
      Combine ingredients and stir fry
    `,
  },
];
