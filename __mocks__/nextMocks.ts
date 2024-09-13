import { mock } from 'bun:test';

interface MockNavigationArgs {
  pathname?: string;
  searchParams?: Record<string, string>;
}

export const withMockNavigation = (args: MockNavigationArgs = {}) => {
  const searchParams = new Map(Object.entries(args.searchParams ?? {}));
  mock.module('next/navigation', () => {
    return {
      usePathname: () => args.pathname ?? '',
      useSearchParams: () => searchParams,
    };
  });
};
