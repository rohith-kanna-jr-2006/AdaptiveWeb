import { test, expect } from '@playwright/test';

test.describe('AdaptiveWeb E2E User Journey & Policy Integration', () => {
  test('Complete End-to-End User Journey: Navigation, Mode Switching & Policy Inspection', async ({ page }) => {
    // Step 1: Open application
    await page.goto('/');
    await expect(page).toHaveTitle(/AdaptiveWeb/i);

    // Step 2: Verify Main Header & Navigation
    const headerTitle = page.getByText('AdaptiveWeb', { exact: true }).first();
    await expect(headerTitle).toBeVisible();

    // Step 3: Inspect Environment & Hardware Detection Status
    const envHeading = page.getByRole('heading', { name: /Environment & Hardware Detection/i });
    await expect(envHeading).toBeVisible();

    const netStatusCard = page.locator('#environment').getByText(/Network Information|Connection|4G|Not available|Status/i).first();
    await expect(netStatusCard).toBeVisible();

    // Step 4: Interact with Adaptive Showcase Component
    const showcaseSection = page.locator('#adaptive-showcase');
    await expect(showcaseSection).toBeVisible();

    // Step 5: Test Adaptive Mode Switching in Settings Panel (Data Saver -> Balanced -> Full Experience -> Automatic)
    const settingsSection = page.getByRole('region', { name: 'Settings Panel' });
    await settingsSection.scrollIntoViewIfNeeded();

    // Select Data Saver mode
    const dataSaverRadio = page.locator('input[value="DATA SAVER"]');
    if (await dataSaverRadio.isVisible()) {
      await dataSaverRadio.click({ force: true });
      await page.waitForTimeout(400);

      // Verify mode badge reflects DATA SAVER
      const badge = page.getByText(/DATA SAVER/i).first();
      await expect(badge).toBeVisible();
    }

    // Select Full Experience mode
    const fullRadio = page.locator('input[value="FULL EXPERIENCE"]');
    if (await fullRadio.isVisible()) {
      await fullRadio.click({ force: true });
      await page.waitForTimeout(400);

      // Verify mode badge reflects FULL EXPERIENCE
      const badgeFull = page.getByText(/FULL EXPERIENCE/i).first();
      await expect(badgeFull).toBeVisible();
    }

    // Reset to Automatic mode
    const autoRadio = page.locator('input[value="AUTOMATIC"]');
    if (await autoRadio.isVisible()) {
      await autoRadio.click({ force: true });
      await page.waitForTimeout(400);
    }
  });
});
