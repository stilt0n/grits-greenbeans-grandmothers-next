import { test, expect } from '@playwright/test';

test('Home page is up', { tag: '@smoke' }, async ({ page }) => {
  await page.goto('/');
  await expect(
    page.getByText('Grits, Greenbeans and Grandmothers')
  ).toBeVisible();
});
