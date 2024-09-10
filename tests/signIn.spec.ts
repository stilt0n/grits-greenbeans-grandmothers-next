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
      await setupClerkTestingToken({ page });

      await page.goto('/create-recipe');
      await expect(page.locator('h1')).toContainText('Sign In');
      await page.waitForSelector('.cl-signIn-root', { state: 'attached' });
      await page.locator('input[name=identifier]').fill(username);
      await page.getByRole('button', { name: 'Continue', exact: true }).click();
      await page.locator('input[name=password]').fill(password);
      await page.getByRole('button', { name: 'Continue', exact: true }).click();
      await page.waitForURL('**/create-recipe');

      await expect(page.locator('h1')).toContainText('Add a Recipe');
    }
  );
});
