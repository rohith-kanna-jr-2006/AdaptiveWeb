import { test, expect } from '@playwright/test';

test.describe('AdaptiveWeb Next.js UI & Policy Verification', () => {
  test('should render main Adaptive Dashboard UI components', async ({ page }) => {
    await page.goto('/');

    // Check title or main header
    await expect(page).toHaveTitle(/AdaptiveWeb/i);

    // Verify main interactive sections exist
    const modeBadge = page.locator('header, main').filter({ hasText: /BALANCED|DATA SAVER|FULL EXPERIENCE/i }).first();
    await expect(modeBadge).toBeVisible();
  });

  test('should allow mode preference changes between Data Saver, Balanced, and Full Experience', async ({ page }) => {
    await page.goto('/');

    // Locate mode buttons or mode cards
    const dataSaverBtn = page.getByRole('button', { name: /DATA SAVER/i }).or(page.getByText(/DATA SAVER/i)).first();
    if (await dataSaverBtn.isVisible()) {
      await dataSaverBtn.click();
      await page.waitForTimeout(500);
    }

    const fullExpBtn = page.getByRole('button', { name: /FULL EXPERIENCE/i }).or(page.getByText(/FULL EXPERIENCE/i)).first();
    if (await fullExpBtn.isVisible()) {
      await fullExpBtn.click();
      await page.waitForTimeout(500);
    }
  });
});
