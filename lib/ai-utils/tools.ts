import { z } from 'zod';
import { tool } from 'ai';

const performRecipeCalculation = (
  scale: number,
  ingredients: { name: string; amount?: number; unit?: string }[]
) =>
  ingredients.map(({ name, amount, unit }) => ({
    name,
    amount: amount ? amount * scale : undefined,
    unit,
  }));

export const recipeMathTool = tool({
  description: 'Use this tool to scale a recipe up or down',
  parameters: z.object({
    scale: z
      .number()
      .describe(
        'This is the amount to multiply the recipe by. For example, if the user says to halve a recipe the scale should be 0.5'
      ),
    ingredients: z.array(
      z.object({
        name: z.string().describe('the name of the ingredient'),
        amount: z
          .number()
          .optional()
          .describe(
            'the amount of the ingredient. omit when it does not make sense to use an amount. For example "a pinch" could stay the same. Or "salt to taste" does not have a numerical amount'
          ),
        unit: z
          .string()
          .optional()
          .describe(
            'the unit of the ingredient. Omit when using a unit does not make sense. For example "1 apple" should be `{name: "apple", amount: 1 }`'
          ),
      })
    ),
  }),
  execute: async ({ scale, ingredients }) =>
    performRecipeCalculation(scale, ingredients),
});
