// TODO: determine format of instructions strings before finishing
import * as db from '@/lib/api';

/**
 * Multiline string function
 * Quick and dirty tag function to fix indentation on multiline strings.
 * This is not a reliable dedent function and does not preserve indentation.
 */
const mls = (strings: TemplateStringsArray) => {
  return strings
    .join('')
    .split('\n')
    .map((s) => s.trim())
    .join('\n');
};

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
