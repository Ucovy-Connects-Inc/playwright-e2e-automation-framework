import { test, expect } from '@playwright/test';
import { performanceConfig as cfg, requireSafeTarget } from '../../config/performance.config.js';

test.describe('Browser navigation performance @performance', () => {
  test('navigation timing and web vitals', async ({ page }, testInfo) => {
    requireSafeTarget(cfg);
    const url = new URL(cfg.browserPath, cfg.baseURL).toString();
    await page.goto(url,{waitUntil:'load',timeout:cfg.timeoutMs});
    const metrics = await page.evaluate(() => {
      const nav = performance.getEntriesByType('navigation')[0];
      const paint = performance.getEntriesByType('paint');
      const fp = paint.find(p => p.name === 'first-paint');
      const fcp = paint.find(p => p.name === 'first-contentful-paint');
      return { navigationMs: nav?.duration ?? null, domContentLoadedMs:nav?.domContentLoadedEventEnd ?? null,
        responseEndMs:nav?.responseEnd ?? null, firstPaintMs:fp?.startTime ?? null,
        firstContentfulPaintMs:fcp?.startTime ?? null };
    });
    await testInfo.attach('browser-performance.json',{body:JSON.stringify({url,metrics},null,2),contentType:'application/json'});
    expect(metrics.navigationMs).not.toBeNull();
    expect(metrics.navigationMs).toBeLessThanOrEqual(cfg.p95Ms);
  });
});
