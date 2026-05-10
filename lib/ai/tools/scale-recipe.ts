import { tool } from 'ai';
import { z } from 'zod';
import {
  ingredientSchema,
  parseAmount,
  scaleIngredient,
  simplifyIngredient,
} from './scale-utils';

const inputSchema = z.object({
  scale: z
    .string()
    .describe(
      'The factor to multiply ingredient amounts by, as a string. Examples: "2" to double, "1/2" to halve, "1.5" for 50% more. Fractions are preferred over decimals when natural.'
    ),
  ingredients: z
    .array(ingredientSchema)
    .describe(
      'Every ingredient from the recipe the user is viewing, with the *original* (unscaled) amounts. Include items with no amount ("a pinch") so the response is complete.'
    ),
});

export const scaleRecipeTool = tool({
  description:
    'Scale a recipe by a multiplier (e.g. double, halve, 1.5x). Returns each ingredient with its scaled amount, with units simplified to common kitchen measures (e.g. 4 tbsp → 1/4 cup) where possible. Ingredient amounts are computed deterministically by code — do not do the multiplication yourself.',
  inputSchema,
  execute: async ({ scale, ingredients }) => {
    const scaleValue = parseAmount(scale);
    if (scaleValue === null || scaleValue <= 0) {
      return {
        error:
          'Could not interpret the scale value. Ask the user to clarify how much to scale the recipe by.',
      };
    }

    const scaled = ingredients
      .map((ingredient) => scaleIngredient(scaleValue, ingredient))
      .map(simplifyIngredient);

    return {
      scale,
      ingredients: scaled,
    };
  },
});
