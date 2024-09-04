import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Multiline string function
 * Quick and dirty tag function to fix indentation on multiline strings.
 * This is not a reliable dedent function and does not preserve indentation.
 */
export const mls = (strings: TemplateStringsArray) => {
  return strings
    .join('')
    .split('\n')
    .map((s) => s.trim())
    .join('\n');
};
