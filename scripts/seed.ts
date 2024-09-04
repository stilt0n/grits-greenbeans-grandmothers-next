// TODO: determine format of instructions strings before finishing
import * as db from '@/lib/api';
import type { InsertRecipe } from '@/db/schema';
import { html } from '@/lib/utils';

const images = {
  grits:
    'https://images.unsplash.com/photo-1559852925-6a5a7125525b?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  greenbeans:
    'https://images.unsplash.com/photo-1448293065296-c7e2e5b76ae9?q=80&w=2014&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
};

const seedData: InsertRecipe[] = [
  {
    title: 'Grits',
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

db.createRecipe(...seedData);
