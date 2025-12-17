import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://ecommerce-playground.lambdatest.io/');
  await expect(page.getByRole('heading', { name: 'Top categories close' })).toBeVisible();

  await page.getByRole('link', { name: 'Home' }).click();
  await expect(page.getByRole('heading', { name: 'Top categories close' })).toBeVisible();

  await page.getByRole('link', { name: 'Blog', exact: true }).click();
});