import { tool } from 'ai';
import { z } from 'zod';
import { ingredientSchema, simplifyIngredient } from './scale-utils';

const inputSchema = z.object({
  ingredients: z
    .array(ingredientSchema)
    .describe(
      'Ingredients to rewrite using more convenient kitchen measures. Awkward amounts will be promoted (e.g. 4 tbsp → 1/4 cup, 3 tsp → 1 tbsp) only when the result lines up with a common measuring tool.'
    ),
});

export const simplifyUnitsTool = tool({
  description:
    'Rewrite ingredient amounts using more convenient kitchen measures where possible. Use this when a user asks to convert units, simplify, or "clean up" a recipe — e.g. "what is 6 tbsp in cups?" or "can you simplify the units?". Conversions only happen when the result lands on a common measuring-cup or measuring-spoon amount; otherwise the ingredient is returned unchanged.',
  inputSchema,
  execute: async ({ ingredients }) => {
    return {
      ingredients: ingredients.map(simplifyIngredient),
    };
  },
});
