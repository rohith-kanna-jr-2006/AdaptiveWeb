import { test, expect } from '@playwright/test';

test.describe('AdaptiveWeb Network Profile & Throttling Verification', () => {
  test('Fast Profile (Normal 4G): Verify unconstrained responsive delivery', async ({ page }) => {
    // Connect to CDP session for network emulation
    const client = await page.context().newCDPSession(page);
    await client.send('Network.emulateNetworkConditions', {
      offline: false,
      latency: 20, // 20ms RTT
      downloadThroughput: (10 * 1024 * 1024) / 8, // 10 Mbps
      uploadThroughput: (5 * 1024 * 1024) / 8, // 5 Mbps
    });

    const start = Date.now();
    await page.goto('/', { waitUntil: 'networkidle' });
    const loadTimeMs = Date.now() - start;

    console.log(`[Fast Profile 4G] Load Time: ${loadTimeMs}ms`);
    expect(loadTimeMs).toBeLessThan(15000);
  });

  test('Constrained Profile (Slow 3G): Verify graceful degradation under latency', async ({ page }) => {
    // Connect to CDP session for slow network emulation
    const client = await page.context().newCDPSession(page);
    await client.send('Network.emulateNetworkConditions', {
      offline: false,
      latency: 300, // 300ms RTT
      downloadThroughput: (500 * 1024) / 8, // 500 kbps
      uploadThroughput: (500 * 1024) / 8, // 500 kbps
    });

    const start = Date.now();
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const loadTimeMs = Date.now() - start;

    console.log(`[Constrained Profile Slow 3G] DOM Loaded in: ${loadTimeMs}ms`);

    // Verify main page elements render despite latency
    const header = page.getByText('AdaptiveWeb', { exact: true }).first();
    await expect(header).toBeVisible();
  });
});
