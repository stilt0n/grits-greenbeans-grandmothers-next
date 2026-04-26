import { describe, it, expect } from 'bun:test';
import {
  queryFromKeys,
  splitRecipeAndTags,
  createPaginateClause,
  createWhereIdClause,
  createWhereSearchClause,
} from '../utils';

describe('queryFromKeys', () => {
  it('builds a select object with each key mapped to true', () => {
    expect(queryFromKeys(['title', 'author'])).toEqual({
      title: true,
      author: true,
    });
  });

  it('throws on an empty array', () => {
    expect(() => queryFromKeys([])).toThrow(TypeError);
  });
});

describe('splitRecipeAndTags', () => {
  it('separates the tags sentinel from real recipe columns', () => {
    expect(splitRecipeAndTags(['title', 'tags', 'author'])).toEqual({
      recipeKeys: ['title', 'author'],
      includeTags: true,
    });
  });

  it('reports includeTags=false when the sentinel is absent', () => {
    expect(splitRecipeAndTags(['title', 'author'])).toEqual({
      recipeKeys: ['title', 'author'],
      includeTags: false,
    });
  });
});

describe('createPaginateClause', () => {
  it('uses 1-indexed pages so page 1 has no offset', () => {
    expect(createPaginateClause(1, 10)).toEqual({ limit: 10, offset: 0 });
  });

  it('computes offset as (page - 1) * pageSize for later pages', () => {
    expect(createPaginateClause(3, 25)).toEqual({ limit: 25, offset: 50 });
  });
});

describe('createWhereIdClause', () => {
  it('returns an object with a where property', () => {
    const clause = createWhereIdClause(7);
    expect(clause).toHaveProperty('where');
  });
});

describe('createWhereSearchClause', () => {
  it('returns an object with a where property for the title column by default', () => {
    const clause = createWhereSearchClause('soup');
    expect(clause).toHaveProperty('where');
  });

  it('accepts an explicit search column', () => {
    const clause = createWhereSearchClause('grandma', 'author');
    expect(clause).toHaveProperty('where');
  });
});
