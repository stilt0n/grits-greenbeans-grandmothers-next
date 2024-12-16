/**
 * @deprecated
 */
// TODO: determine format of instructions strings before finishing
// import * as db from '@/lib/database';
import type { InsertRecipe } from '@/db/schema';
import { html } from '@/lib/utils';
import { images } from '@/lib/constants';

const seedData: InsertRecipe[] = [
  {
    title: 'Grits',
    description: "grandmother_bot's classic take on a southern classic.",
    author: 'grandmother_bot',
    recipeTime: '20 minutes',
    instructions: html`
      <h2>Ingredients</h2>
      <ul>
        <li>Two cups of grits</li>
        <li>Two tablespoons of butter</li>
      </ul>

      <h2>Instructions</h2>
      <ol>
        <li>What's the first step?</li>
      </ol>
    `,
    imageUrl: images.grits,
  },
  {
    title: 'Green Beans',
    description:
      "These greenbeans are so good you'll wish you weren't a robot. - grandmother_bot",
    author: 'grandmother_bot',
    recipeTime: '15 minutes',
    instructions: html`
      <h2>Ingredients</h2>
      <ul>
        <li>One pound of greenbeans</li>
        <li>One tablespoon chili crisp</li>
        <li>Two tablespoons of canola oil</li>
        <li>Two cloves minced garlic</li>
        <li>Two tablespoons of grated ginger</li>
        <li>Salt to taste</li>
      </ul>
      <h2>Instructions</h2>
      <ol>
        <li>Combine ingredients and stiry fry</li>
      </ol>
    `,
    imageUrl: images.greenbeans,
  },
];

console.log(
  'this function is deprecated and should not longer be used as it could cause issues with the database. The logic is commented out. If you REALLY need to use this you will need to modify the file.'
);
// db.createRecipe(...seedData);
