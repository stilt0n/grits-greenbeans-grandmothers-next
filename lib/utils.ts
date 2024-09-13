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
