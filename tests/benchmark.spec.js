import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test.describe('AdaptiveWeb Quantitative Benchmark Suite', () => {
  const benchmarkData = {
    timestamp: new Date().toISOString(),
    baseline: {},
    adaptive: {}
  };

  test('Benchmark: Baseline (Full Experience) Mode Metrics', async ({ page }) => {
    let totalTransferBytes = 0;
    page.on('response', async (res) => {
      try {
        const body = await res.body();
        totalTransferBytes += body.length;
      } catch (e) {
        // ignore streaming or cross-origin body read restrictions
      }
    });

    const start = Date.now();
    await page.goto('/', { waitUntil: 'networkidle' });

    // Switch to Full Experience mode if button present
    const fullBtn = page.getByRole('button', { name: /FULL EXPERIENCE/i }).or(page.getByText(/FULL EXPERIENCE/i)).first();
    if (await fullBtn.isVisible()) {
      await fullBtn.click();
      await page.waitForTimeout(500);
    }

    const loadTimeMs = Date.now() - start;
    const domCount = await page.evaluate(() => document.querySelectorAll('*').length);

    benchmarkData.baseline = {
      mode: 'Full Experience (Baseline)',
      loadTimeMs,
      estimatedTransferKB: Math.round(totalTransferBytes / 1024 * 100) / 100,
      domNodeCount: domCount
    };

    expect(domCount).toBeGreaterThan(0);
  });

  test('Benchmark: Adaptive (Data Saver) Mode Metrics', async ({ page }) => {
    let totalTransferBytes = 0;
    page.on('response', async (res) => {
      try {
        const body = await res.body();
        totalTransferBytes += body.length;
      } catch (e) {
        // ignore streaming or cross-origin body read restrictions
      }
    });

    const start = Date.now();
    await page.goto('/', { waitUntil: 'networkidle' });

    // Switch to Data Saver mode if button present
    const dataSaverBtn = page.getByRole('button', { name: /DATA SAVER/i }).or(page.getByText(/DATA SAVER/i)).first();
    if (await dataSaverBtn.isVisible()) {
      await dataSaverBtn.click();
      await page.waitForTimeout(500);
    }

    const loadTimeMs = Date.now() - start;
    const domCount = await page.evaluate(() => document.querySelectorAll('*').length);

    benchmarkData.adaptive = {
      mode: 'Data Saver (Adaptive)',
      loadTimeMs,
      estimatedTransferKB: Math.round(totalTransferBytes / 1024 * 100) / 100,
      domNodeCount: domCount
    };

    expect(domCount).toBeGreaterThan(0);
  });

  test.afterAll(() => {
    const dir = path.join(process.cwd(), 'benchmark-results');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(
      path.join(dir, 'benchmark-summary.json'),
      JSON.stringify(benchmarkData, null, 2)
    );
    console.log('[Benchmark Saved] benchmark-results/benchmark-summary.json');
  });
});
