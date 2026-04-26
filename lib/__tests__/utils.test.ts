import { describe, it, expect } from 'bun:test';
import {
  cn,
  html,
  parseIntWithFallback,
  truncateRange,
  range,
  verticalSlice,
  extractColumn,
  capitalized,
} from '../utils';

describe('cn', () => {
  it('merges class names and lets later tailwind utilities win', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4');
  });

  it('drops falsy values', () => {
    expect(cn('a', false, null, undefined, 'b')).toBe('a b');
  });
});

describe('html', () => {
  it('trims each line and joins them into a single string', () => {
    const result = html`
      <div>
        <p>hi</p>
      </div>
    `;
    expect(result).toBe('<div><p>hi</p></div>');
  });
});

describe('parseIntWithFallback', () => {
  it('returns the parsed number for numeric input', () => {
    expect(parseIntWithFallback('42', 0)).toBe(42);
  });

  it('returns the fallback for non-numeric input', () => {
    expect(parseIntWithFallback('not a number', 7)).toBe(7);
  });

  it('returns the fallback for undefined', () => {
    expect(parseIntWithFallback(undefined, 5)).toBe(5);
  });
});

describe('truncateRange', () => {
  it('returns the value when inside the range', () => {
    expect(truncateRange(5, 0, 10)).toBe(5);
  });

  it('clamps to the floor when below', () => {
    expect(truncateRange(-3, 0, 10)).toBe(0);
  });

  it('clamps to the ceiling when above', () => {
    expect(truncateRange(99, 0, 10)).toBe(10);
  });
});

describe('range', () => {
  it('produces a half-open range [start, end)', () => {
    expect(range(2, 5)).toEqual([2, 3, 4]);
  });

  it('returns an empty array when start equals end', () => {
    expect(range(3, 3)).toEqual([]);
  });
});

describe('verticalSlice', () => {
  it('returns one object per row containing only the requested key', () => {
    const rows = [
      { id: 1, title: 'a' },
      { id: 2, title: 'b' },
    ];
    expect(verticalSlice(rows, 'title')).toEqual([
      { title: 'a' },
      { title: 'b' },
    ]);
  });
});

describe('extractColumn', () => {
  it('returns an array of values for the given key', () => {
    const rows = [
      { id: 1, title: 'a' },
      { id: 2, title: 'b' },
    ];
    expect(extractColumn(rows, 'id')).toEqual([1, 2]);
  });
});

describe('capitalized', () => {
  it('uppercases the first character and lowercases the rest', () => {
    expect(capitalized('hELLO')).toBe('Hello');
  });
});
