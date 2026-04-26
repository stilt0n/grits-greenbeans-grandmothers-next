import { describe, it, expect } from 'bun:test';
import {
  slugify,
  recipePath,
  editRecipePath,
  parseRecipeSlug,
} from '../recipe-slug';

describe('slugify', () => {
  it('lowercases and joins words with dashes', () => {
    expect(slugify('Chicken Soup')).toBe('chicken-soup');
  });

  it('strips diacritics', () => {
    expect(slugify('Crème Brûlée')).toBe('creme-brulee');
  });

  it('collapses punctuation and runs of non-alphanumerics', () => {
    expect(slugify('Mom’s Apple Pie!! & Friends')).toBe(
      'mom-s-apple-pie-friends'
    );
  });

  it('trims leading and trailing dashes', () => {
    expect(slugify('  hello world  ')).toBe('hello-world');
  });

  it('returns an empty string when there are no alphanumeric characters', () => {
    expect(slugify('   ')).toBe('');
    expect(slugify('!!!')).toBe('');
  });

  it('caps slug length and trims any trailing dash from the cap', () => {
    const long = 'a'.repeat(40) + ' ' + 'b'.repeat(60);
    const result = slugify(long);
    expect(result.length).toBeLessThanOrEqual(80);
    expect(result.endsWith('-')).toBe(false);
  });
});

describe('recipePath', () => {
  it('builds a slug-id url', () => {
    expect(recipePath(42, 'Chicken Soup')).toBe('/recipes/chicken-soup-42');
  });

  it('falls back to id-only when title produces an empty slug', () => {
    expect(recipePath(7, '!!!')).toBe('/recipes/7');
  });
});

describe('editRecipePath', () => {
  it('builds the edit url with slug', () => {
    expect(editRecipePath(42, 'Chicken Soup')).toBe(
      '/edit-recipe/chicken-soup-42'
    );
  });

  it('falls back to id-only when title produces an empty slug', () => {
    expect(editRecipePath(7, '!!!')).toBe('/edit-recipe/7');
  });
});

describe('parseRecipeSlug', () => {
  it('extracts id and slug from a slug-id param', () => {
    expect(parseRecipeSlug('chicken-soup-42')).toEqual({
      id: 42,
      slug: 'chicken-soup',
    });
  });

  it('parses an id-only param with empty slug', () => {
    expect(parseRecipeSlug('42')).toEqual({ id: 42, slug: '' });
  });

  it('returns null when there is no trailing id', () => {
    expect(parseRecipeSlug('chicken-soup')).toBeNull();
    expect(parseRecipeSlug('')).toBeNull();
  });

  it('returns null when the slug segment is empty (leading dash)', () => {
    expect(parseRecipeSlug('-42')).toBeNull();
  });

  it('takes only the trailing numeric segment as the id', () => {
    expect(parseRecipeSlug('recipe-2-electric-boogaloo-99')).toEqual({
      id: 99,
      slug: 'recipe-2-electric-boogaloo',
    });
  });
});
