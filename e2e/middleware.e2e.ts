import { setupClerkTestingToken } from '@clerk/testing/playwright';
import { test, expect } from '@playwright/test';

test.describe('middleware route protection', () => {
  const redirectsToSignIn = ['/create-recipe', '/edit-recipe/some-id'];
  const returnsNotFound = ['/admin'];
  const publicRoutes = ['/', '/about'];

  for (const route of redirectsToSignIn) {
    test(
      `redirects unauthenticated user away from ${route}`,
      { tag: '@smoke' },
      async ({ page }) => {
        // @ts-ignore — same workaround as signIn.e2e.ts
        await setupClerkTestingToken({ page });

        await page.goto(route);
        await expect(
          page.getByRole('heading', { name: 'Sign In' })
        ).toBeVisible();
        expect(page.url()).not.toContain(route);
      }
    );
  }

  for (const route of returnsNotFound) {
    test(
      `returns 404 for unauthenticated user at ${route}`,
      { tag: '@smoke' },
      async ({ page }) => {
        // @ts-ignore — same workaround as signIn.e2e.ts
        await setupClerkTestingToken({ page });

        const response = await page.goto(route);
        expect(response?.status()).toBe(404);
        await expect(
          page.getByRole('heading', { name: 'Sign In' })
        ).toHaveCount(0);
      }
    );
  }

  for (const route of publicRoutes) {
    test(
      `serves ${route} without authentication`,
      { tag: '@smoke' },
      async ({ page }) => {
        const response = await page.goto(route);
        expect(response?.status()).toBe(200);
        await expect(
          page.getByRole('heading', { name: 'Sign In' })
        ).toHaveCount(0);
      }
    );
  }
});
