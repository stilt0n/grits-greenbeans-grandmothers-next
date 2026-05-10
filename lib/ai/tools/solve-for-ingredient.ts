import { tool } from 'ai';
import { z } from 'zod';
import {
  ingredientSchema,
  parseAmount,
  scaleIngredient,
  simplifyIngredient,
} from './scale-utils';

const inputSchema = z.object({
  ingredients: z
    .array(ingredientSchema)
    .describe(
      'Every ingredient from the recipe the user is viewing, with the *original* (unscaled) amounts.'
    ),
  ingredientName: z
    .string()
    .describe(
      'The name of the ingredient the user wants to anchor the scaling on. Match it to one of the ingredient names in the list — small variations are fine ("peas" matches "shelled peas").'
    ),
  targetAmount: z
    .string()
    .describe(
      'The desired amount of that ingredient, as a string (e.g. "2", "1/2", "1.5").'
    ),
  targetUnit: z
    .string()
    .optional()
    .describe(
      'The unit of the desired amount. Should match the unit of the matched ingredient — if the user gives a different unit, ask them to rephrase rather than guessing a conversion.'
    ),
});

export const solveForIngredientTool = tool({
  description:
    'Scale a recipe so that one specific ingredient ends up at a target amount. Use this when the user asks something like "make this with only 2 cups of peas" or "I only have 200g of butter — how much of everything else?". Returns the full ingredient list scaled accordingly. Do not do the math yourself.',
  inputSchema,
  execute: async ({
    ingredients,
    ingredientName,
    targetAmount,
    targetUnit,
  }) => {
    const target = parseAmount(targetAmount);
    if (target === null || target <= 0) {
      return {
        error:
          'Could not interpret the target amount. Ask the user to clarify.',
      };
    }

    const needle = ingredientName.trim().toLowerCase();
    const match = ingredients.find((ing) => {
      const name = ing.name.toLowerCase();
      return name === needle || name.includes(needle) || needle.includes(name);
    });

    if (!match || !match.amount) {
      return {
        error: `Could not find an ingredient matching "${ingredientName}" with a numeric amount. Ask the user to clarify.`,
      };
    }

    if (
      targetUnit &&
      match.unit &&
      targetUnit.trim().toLowerCase() !== match.unit.trim().toLowerCase()
    ) {
      return {
        error: `The recipe lists "${match.name}" in ${match.unit}, not ${targetUnit}. Ask the user to give the target in ${match.unit}.`,
      };
    }

    const original = parseAmount(match.amount);
    if (original === null || original === 0) {
      return {
        error: `The recipe's amount for "${match.name}" could not be parsed.`,
      };
    }

    const scaleValue = target / original;

    const scaled = ingredients
      .map((ingredient) => scaleIngredient(scaleValue, ingredient))
      .map(simplifyIngredient);

    return {
      scale: String(scaleValue),
      anchorIngredient: match.name,
      ingredients: scaled,
    };
  },
});
