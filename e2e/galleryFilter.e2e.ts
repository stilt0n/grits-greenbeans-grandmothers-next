import { test, expect } from '@playwright/test';

test.describe('recipe gallery filtering', () => {
  test(
    'serves the gallery with a tag filter without crashing',
    { tag: '@smoke' },
    async ({ page }) => {
      const response = await page.goto('/?query=southern&category=tag');
      expect(response?.status()).toBe(200);
      await expect(
        page.getByText('Grits, Greenbeans and Grandmothers')
      ).toBeVisible();
    }
  );

  test(
    'serves the gallery with a title filter without crashing',
    { tag: '@smoke' },
    async ({ page }) => {
      const response = await page.goto('/?query=test&category=title');
      expect(response?.status()).toBe(200);
    }
  );

  test(
    'ignores invalid category values and still renders',
    { tag: '@smoke' },
    async ({ page }) => {
      const response = await page.goto('/?query=foo&category=not-a-category');
      expect(response?.status()).toBe(200);
    }
  );
});
