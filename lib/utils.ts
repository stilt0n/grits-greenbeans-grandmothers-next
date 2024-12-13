import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Quick and dirty tag function to sort of minify html
 * Should probably replace this if it ever sees significant use
 */
export const html = (strings: TemplateStringsArray) => {
  return strings
    .join('')
    .split('\n')
    .map((s) => s.trim())
    .join('');
};

export const parseIntWithFallback = (maybeInt: unknown, fallback: number) => {
  const parsedInt = Number(maybeInt);
  return Number.isNaN(parsedInt) ? fallback : parsedInt;
};

export const truncateRange = (num: number, floor: number, ceiling: number) => {
  return Math.min(Math.max(num, floor), ceiling);
};

// returns [start, end)
export const range = (start: number, end: number) =>
  [...Array(end - start)].map((_, i) => i + start);

// Gets a vertical slice of a table. Returns it as { K: V }[]
export const verticalSlice = <T, K extends keyof T>(
  tableRows: T[],
  key: K
): { [J in K]: T[J] }[] => {
  return tableRows.map(({ [key]: v }) => ({ [key]: v })) as {
    [J in K]: T[J];
  }[];
};

// gets a key from an array of objects and extracts an array of values
export const extractColumn = <T, K extends keyof T>(objs: T[], key: K) => {
  return objs.map(({ [key]: value }) => value);
};
