import { it, describe, expect } from 'bun:test';
import { getTagOperations } from '../action-utils';

describe('given current and new tags', () => {
  it('returns empty arrays when there are no tags', () => {
    const actual = getTagOperations([], []);
    expect(actual).toEqual({ tagsToRemove: [], tagsToAdd: [] });
  });

  it('returns current as remove and new as add when tags are disjoint sets', () => {
    const actual = getTagOperations(['a', 'b', 'c'], ['d', 'e', 'f']);
    expect(actual).toEqual({
      tagsToRemove: ['a', 'b', 'c'],
      tagsToAdd: ['d', 'e', 'f'],
    });
  });

  it('returns correct tags when tags are intersecting sets', () => {
    const actual = getTagOperations(['a', 'b', 'c'], ['c', 'd', 'e']);
    expect(actual).toEqual({
      tagsToRemove: ['a', 'b'],
      tagsToAdd: ['d', 'e'],
    });
  });

  it('returns no edits when tags exactly match', () => {
    const actual = getTagOperations(['a', 'b', 'c'], ['c', 'b', 'a']);
    expect(actual).toEqual({
      tagsToRemove: [],
      tagsToAdd: [],
    });
  });

  it('removes tags when new tags are empty', () => {
    const actual = getTagOperations(['a', 'b', 'c'], []);
    expect(actual).toEqual({
      tagsToRemove: ['a', 'b', 'c'],
      tagsToAdd: [],
    });
  });

  it('returns correct result when new tags are longer', () => {
    const actual = getTagOperations(['a', 'b'], ['a', 'b', 'c']);
    expect(actual).toEqual({
      tagsToRemove: [],
      tagsToAdd: ['c'],
    });
  });

  it('returns correct result when old tags are longer', () => {
    const actual = getTagOperations(['a', 'b', 'c'], ['b', 'c']);
    expect(actual).toEqual({
      tagsToRemove: ['a'],
      tagsToAdd: [],
    });
  });
});
