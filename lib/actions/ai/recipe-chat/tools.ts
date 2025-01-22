import { z } from 'zod';

export const convertStringNumberToNumber = (stringNum: string): number => {
  if (stringNum.includes(' ')) {
    const numStrings = stringNum.split(' ');
    return numStrings.reduce(
      (sum, numStr) => sum + convertStringNumberToNumber(numStr),
      0
    );
  }

  if (stringNum.includes('/')) {
    const [numerator, denominator] = stringNum.split('/').map(Number);
    return numerator / denominator;
  }

  if (stringNum.includes('%')) {
    const number = Number(stringNum.replace('%', ''));
    return number / 100;
  }

  // there's no single right way to handle ranges but we'll just average them
  if (/\d-\d/.test(stringNum)) {
    const [start, end] = stringNum.split('-').map(Number);
    return (start + end) / 2;
  }

  return Number(stringNum);
};

export const scaleIngredients = (scale: string) => {
  const scalar = convertStringNumberToNumber(scale);
  return (ingredient: { name: string; amount?: string; unit?: string }) => {
    if (ingredient.amount) {
      ingredient.amount = (
        convertStringNumberToNumber(ingredient.amount) * scalar
      ).toString();
    }
    return ingredient;
  };
};

export const recipeMathSchema = z.object({
  scale: z
    .string()
    .describe(
      'This is the amount to multiply the recipe by. For example, if the user says to halve a recipe the scale should be "1/2"'
    ),
  ingredients: z.array(
    z.object({
      name: z.string().describe('the name of the ingredient'),
      amount: z
        .string()
        .optional()
        .describe(
          'the amount of the ingredient. omit when it does not make sense to use an amount. For example "a pinch" could stay the same. Or "salt to taste" does not have a numerical amount. Fractions can be returned as a string like "1/2" but english numbers should be converted to numbers (e.g. one should be "1"). Mixed fractions should be returned as space separated numbers like "1 1/2"'
        ),
      unit: z
        .string()
        .optional()
        .describe(
          'the unit of the ingredient. Omit when using a unit does not make sense. For example "1 apple" should be `{name: "apple", amount: 1 }`'
        ),
    })
  ),
});
