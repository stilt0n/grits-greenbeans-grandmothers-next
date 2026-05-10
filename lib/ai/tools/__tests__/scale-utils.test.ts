import { describe, it, expect } from 'bun:test';
import {
  parseAmount,
  formatAmount,
  simplifyAmount,
  scaleIngredient,
  simplifyIngredient,
} from '../scale-utils';

describe('parseAmount', () => {
  it('parses whole numbers', () => {
    expect(parseAmount('2')).toBe(2);
  });

  it('parses simple fractions', () => {
    expect(parseAmount('1/2')).toBe(0.5);
    expect(parseAmount('3/4')).toBe(0.75);
  });

  it('parses mixed numbers', () => {
    expect(parseAmount('1 1/2')).toBe(1.5);
    expect(parseAmount('2 3/4')).toBe(2.75);
  });

  it('averages ranges', () => {
    expect(parseAmount('2-3')).toBe(2.5);
  });

  it('parses percents as decimals', () => {
    expect(parseAmount('50%')).toBe(0.5);
  });

  it('returns null for nonsense input', () => {
    expect(parseAmount('a pinch')).toBeNull();
    expect(parseAmount('')).toBeNull();
    expect(parseAmount('1/0')).toBeNull();
  });
});

describe('formatAmount', () => {
  it('returns whole numbers without decimals', () => {
    expect(formatAmount(2)).toBe('2');
  });

  it('snaps near-whole values to integers', () => {
    expect(formatAmount(1.99)).toBe('2');
    expect(formatAmount(2.01)).toBe('2');
  });

  it('formats common kitchen fractions', () => {
    expect(formatAmount(0.5)).toBe('1/2');
    expect(formatAmount(0.25)).toBe('1/4');
    expect(formatAmount(1 / 3)).toBe('1/3');
    expect(formatAmount(2 / 3)).toBe('2/3');
    expect(formatAmount(0.75)).toBe('3/4');
  });

  it('formats mixed numbers', () => {
    expect(formatAmount(1.5)).toBe('1 1/2');
    expect(formatAmount(2.25)).toBe('2 1/4');
  });

  it('falls back to a short decimal for awkward values', () => {
    expect(formatAmount(0.42)).toBe('0.42');
  });
});

describe('simplifyAmount', () => {
  it('upgrades tbsp to a quarter cup', () => {
    expect(simplifyAmount('4', 'tbsp')).toEqual({ amount: '1/4', unit: 'cup' });
  });

  it('upgrades tbsp to half a cup', () => {
    expect(simplifyAmount('8', 'tbsp')).toEqual({ amount: '1/2', unit: 'cup' });
  });

  it('upgrades tbsp to a third of a cup', () => {
    expect(simplifyAmount(formatAmount(16 / 3), 'tbsp')).toEqual({
      amount: '1/3',
      unit: 'cup',
    });
  });

  it('upgrades tbsp to whole cups', () => {
    expect(simplifyAmount('16', 'tbsp')).toEqual({ amount: '1', unit: 'cup' });
    expect(simplifyAmount('32', 'tbsp')).toEqual({ amount: '2', unit: 'cup' });
  });

  it('does NOT upgrade tbsp when result lands on an awkward cup amount', () => {
    // 6 tbsp = 3/8 cup — no 3/8 cup measure, so leave it.
    expect(simplifyAmount('6', 'tbsp')).toEqual({ amount: '6', unit: 'tbsp' });
    // 2 tbsp = 1/8 cup — no 1/8 cup measure.
    expect(simplifyAmount('2', 'tbsp')).toEqual({ amount: '2', unit: 'tbsp' });
  });

  it('upgrades whole-tablespoon counts of tsp', () => {
    expect(simplifyAmount('3', 'tsp')).toEqual({ amount: '1', unit: 'tbsp' });
    expect(simplifyAmount('6', 'tsp')).toEqual({ amount: '2', unit: 'tbsp' });
  });

  it('does NOT upgrade tsp when result is fractional tbsp', () => {
    // 4 tsp = 1 1/3 tbsp — no clean spoon-set measurement, leave as 4 tsp.
    expect(simplifyAmount('4', 'tsp')).toEqual({ amount: '4', unit: 'tsp' });
  });

  it('chains tsp → tbsp → cup when result lands cleanly', () => {
    // 48 tsp = 16 tbsp = 1 cup
    expect(simplifyAmount('48', 'tsp')).toEqual({ amount: '1', unit: 'cup' });
  });

  it('leaves cups alone (no pint/quart conversions)', () => {
    expect(simplifyAmount('2', 'cup')).toEqual({ amount: '2', unit: 'cup' });
    expect(simplifyAmount('4', 'cup')).toEqual({ amount: '4', unit: 'cup' });
  });

  it('leaves unknown units alone', () => {
    expect(simplifyAmount('100', 'g')).toEqual({ amount: '100', unit: 'g' });
    expect(simplifyAmount('1', 'lb')).toEqual({ amount: '1', unit: 'lb' });
  });

  it('returns input unchanged when there is no unit', () => {
    expect(simplifyAmount('2', undefined)).toEqual({
      amount: '2',
      unit: undefined,
    });
  });

  it('handles unit aliases', () => {
    expect(simplifyAmount('4', 'tablespoons')).toEqual({
      amount: '1/4',
      unit: 'cup',
    });
    expect(simplifyAmount('3', 'tsp.')).toEqual({ amount: '1', unit: 'tbsp' });
  });
});

describe('scaleIngredient', () => {
  it('multiplies the amount and records the original', () => {
    expect(
      scaleIngredient(2, { name: 'flour', amount: '1', unit: 'cup' })
    ).toEqual({
      name: 'flour',
      amount: '2',
      unit: 'cup',
      originalAmount: '1',
      originalUnit: 'cup',
    });
  });

  it('handles fractional scales', () => {
    expect(
      scaleIngredient(0.5, { name: 'sugar', amount: '1', unit: 'cup' })
    ).toMatchObject({ amount: '1/2' });
  });

  it('halves a fraction', () => {
    expect(
      scaleIngredient(0.5, { name: 'salt', amount: '1/2', unit: 'tsp' })
    ).toMatchObject({ amount: '1/4' });
  });

  it('passes ingredients with no amount through unchanged', () => {
    expect(scaleIngredient(2, { name: 'salt to taste' })).toEqual({
      name: 'salt to taste',
    });
  });

  it('passes unparseable amounts through unchanged', () => {
    expect(scaleIngredient(2, { name: 'butter', amount: 'a pinch' })).toEqual({
      name: 'butter',
      amount: 'a pinch',
    });
  });
});

describe('simplifyIngredient', () => {
  it('runs simplifyAmount on a scaled ingredient', () => {
    const scaled = scaleIngredient(2, {
      name: 'oil',
      amount: '2',
      unit: 'tbsp',
    });
    expect(simplifyIngredient(scaled)).toMatchObject({
      amount: '1/4',
      unit: 'cup',
    });
  });

  it('preserves originalAmount/originalUnit', () => {
    const scaled = scaleIngredient(2, {
      name: 'oil',
      amount: '2',
      unit: 'tbsp',
    });
    expect(simplifyIngredient(scaled)).toMatchObject({
      originalAmount: '2',
      originalUnit: 'tbsp',
    });
  });
});
