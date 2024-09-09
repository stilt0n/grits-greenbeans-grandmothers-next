import { test, expect } from '@playwright/test';

// TODO: replace this test with one that is more permanent
test('Home page is up', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Under Construction...')).toBeVisible();
});
