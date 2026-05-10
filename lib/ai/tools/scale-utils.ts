import { z } from 'zod';

export const ingredientSchema = z.object({
  name: z.string().describe('the name of the ingredient'),
  amount: z
    .string()
    .optional()
    .describe(
      'the numeric amount as it appears in the recipe. Fractions stay as strings ("1/2"), ranges as "2-3", english words like "one" become "1". Omit for ingredients with no numeric amount ("a pinch", "salt to taste").'
    ),
  unit: z
    .string()
    .optional()
    .describe(
      'the unit of measure (tsp, tbsp, cup, oz, g, etc). Omit when none applies, e.g. "1 apple" → { name: "apple", amount: "1" }.'
    ),
});

export type Ingredient = z.infer<typeof ingredientSchema>;

export interface ScaledIngredient extends Ingredient {
  originalAmount?: string;
  originalUnit?: string;
}

export const parseAmount = (raw: string): number | null => {
  const s = raw.trim();
  if (s.length === 0) return null;

  if (s.endsWith('%')) {
    const n = Number(s.slice(0, -1));
    return Number.isFinite(n) ? n / 100 : null;
  }

  const mixed = s.match(/^(\d+)\s+(\d+)\s*\/\s*(\d+)$/);
  if (mixed) {
    const [, whole, num, den] = mixed;
    const d = Number(den);
    if (d === 0) return null;
    return Number(whole) + Number(num) / d;
  }

  const frac = s.match(/^(\d+)\s*\/\s*(\d+)$/);
  if (frac) {
    const [, num, den] = frac;
    const d = Number(den);
    if (d === 0) return null;
    return Number(num) / d;
  }

  const range = s.match(/^(\d*\.?\d+)\s*-\s*(\d*\.?\d+)$/);
  if (range) {
    const a = Number(range[1]);
    const b = Number(range[2]);
    return (a + b) / 2;
  }

  const n = Number(s);
  return Number.isFinite(n) ? n : null;
};

const FRACTION_TOLERANCE = 0.02;

// Fractions you can write in a recipe and people can read at a glance.
// Used by formatAmount; broader than what a kitchen tool can directly measure.
const READABLE_FRACTIONS: Array<[number, string]> = [
  [1 / 8, '1/8'],
  [1 / 6, '1/6'],
  [1 / 4, '1/4'],
  [1 / 3, '1/3'],
  [3 / 8, '3/8'],
  [1 / 2, '1/2'],
  [5 / 8, '5/8'],
  [2 / 3, '2/3'],
  [3 / 4, '3/4'],
  [7 / 8, '7/8'],
];

export const formatAmount = (n: number): string => {
  if (!Number.isFinite(n)) return String(n);
  if (n < 0) return '-' + formatAmount(-n);

  const whole = Math.floor(n);
  const remainder = n - whole;

  if (remainder < FRACTION_TOLERANCE) {
    return String(whole);
  }
  if (remainder > 1 - FRACTION_TOLERANCE) {
    return String(whole + 1);
  }

  const match = READABLE_FRACTIONS.find(
    ([value]) => Math.abs(remainder - value) < FRACTION_TOLERANCE
  );

  if (match) {
    return whole === 0 ? match[1] : `${whole} ${match[1]}`;
  }

  const rounded = Math.round(n * 100) / 100;
  return String(rounded);
};

const UNIT_ALIASES: Record<string, string> = {
  teaspoon: 'tsp',
  teaspoons: 'tsp',
  tsp: 'tsp',
  tablespoon: 'tbsp',
  tablespoons: 'tbsp',
  tbsp: 'tbsp',
  tbs: 'tbsp',
  cup: 'cup',
  cups: 'cup',
};

const normalizeUnit = (unit: string): string => {
  const lower = unit.trim().toLowerCase().replace(/\.$/, '');
  return UNIT_ALIASES[lower] ?? lower;
};

// Fractions that appear on a standard US dry-cup measuring set.
// 1/8 cup is intentionally absent — people don't have one.
const CUP_FRACTIONS = [0, 1 / 4, 1 / 3, 1 / 2, 2 / 3, 3 / 4];

const matchesCupFraction = (value: number): boolean => {
  const whole = Math.floor(value);
  const remainder = value - whole;
  if (remainder < FRACTION_TOLERANCE) return true;
  if (remainder > 1 - FRACTION_TOLERANCE) return true;
  return CUP_FRACTIONS.some(
    (f) => Math.abs(remainder - f) < FRACTION_TOLERANCE
  );
};

// Conversions are only applied when the *result* lands on a unit a typical
// home cook can actually measure with a single tool from their drawer.
// We never go above cups (no pints/quarts/gallons — recipes don't talk that
// way and most kitchens don't have those measures).
export const simplifyAmount = (
  amountStr: string,
  unit: string | undefined
): { amount: string; unit: string | undefined } => {
  if (!unit) return { amount: amountStr, unit };
  const value = parseAmount(amountStr);
  if (value === null) return { amount: amountStr, unit };

  const normalized = normalizeUnit(unit);

  // tsp → tbsp: only when the result is a whole number of tablespoons.
  // 3 tsp → 1 tbsp ✓, 6 tsp → 2 tbsp ✓, 4 tsp stays as 4 tsp (a real
  // measurement: 1 tbsp + 1 tsp, but no clean single-tool way to write it).
  if (normalized === 'tsp') {
    const inTbsp = value / 3;
    if (
      inTbsp >= 1 &&
      Math.abs(inTbsp - Math.round(inTbsp)) < FRACTION_TOLERANCE
    ) {
      const tbspValue = Math.round(inTbsp);
      // Try to upgrade further to cups.
      const cupCandidate = simplifyTbspToCup(tbspValue);
      if (cupCandidate) return cupCandidate;
      return { amount: formatAmount(tbspValue), unit: 'tbsp' };
    }
    return { amount: amountStr, unit };
  }

  if (normalized === 'tbsp') {
    const cupCandidate = simplifyTbspToCup(value);
    if (cupCandidate) return cupCandidate;
    return { amount: amountStr, unit };
  }

  return { amount: amountStr, unit };
};

const simplifyTbspToCup = (
  tbsp: number
): { amount: string; unit: string } | null => {
  const cups = tbsp / 16;
  // Need to be at least 1/4 cup before it's worth converting; below that
  // people measure with tablespoons.
  if (cups < 0.25 - FRACTION_TOLERANCE) return null;
  if (!matchesCupFraction(cups)) return null;
  return { amount: formatAmount(cups), unit: 'cup' };
};

export const scaleIngredient = (
  scale: number,
  ingredient: Ingredient
): ScaledIngredient => {
  if (!ingredient.amount) {
    return { ...ingredient };
  }
  const value = parseAmount(ingredient.amount);
  if (value === null) {
    return { ...ingredient };
  }
  return {
    ...ingredient,
    amount: formatAmount(value * scale),
    originalAmount: ingredient.amount,
    originalUnit: ingredient.unit,
  };
};

export const simplifyIngredient = (
  ingredient: ScaledIngredient
): ScaledIngredient => {
  if (!ingredient.amount || !ingredient.unit) return ingredient;
  const { amount, unit } = simplifyAmount(ingredient.amount, ingredient.unit);
  return { ...ingredient, amount, unit };
};
