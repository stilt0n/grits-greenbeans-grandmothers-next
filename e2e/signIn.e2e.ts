import { setupClerkTestingToken } from '@clerk/testing/playwright';
import { test, expect } from '@playwright/test';
import { requireEnv } from '@/types/typeguards';

test.describe('sign-in tests', () => {
  const {
    E2E_CLERK_USER_USERNAME: username,
    E2E_CLERK_USER_PASSWORD: password,
  } = requireEnv('E2E_CLERK_USER_USERNAME', 'E2E_CLERK_USER_PASSWORD');

  test(
    'redirects to signin page when attempting to access protected page',
    { tag: '@smoke' },
    async ({ page }) => {
      // TODO: this type error does not seem to be a problem
      // but I should probably investigate why it's occurring
      // later anyway
      // @ts-ignore
      await setupClerkTestingToken({ page });

      await page.goto('/create-recipe');
      await expect(
        page.getByRole('heading', { name: 'Sign In' })
      ).toBeVisible();
      await page.waitForSelector('.cl-signIn-root', { state: 'attached' });
      await page.locator('input[name=identifier]').fill(username);
      await page.getByRole('button', { name: 'Continue', exact: true }).click();
      await page.locator('input[name=password]').fill(password);
      await page.getByRole('button', { name: 'Continue', exact: true }).click();
      await page.waitForURL('**/create-recipe');

      await expect(
        page.getByRole('heading', { name: 'Add a Recipe' })
      ).toBeVisible();
    }
  );
});
