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
