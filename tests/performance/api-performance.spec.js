import { test, expect, request } from '@playwright/test';
import { performanceConfig as cfg, requireSafeTarget } from '../../config/performance.config.js';
import { summarize, evaluate } from '../../utils/performance/metrics.js';
import fs from 'node:fs/promises';
import path from 'node:path';

test.describe('API performance @performance', () => {
  test('baseline and bounded concurrent GET workload', async ({}, testInfo) => {
    requireSafeTarget(cfg);
    const url = new URL(cfg.apiPath, cfg.baseURL).toString();
    const context = await request.newContext({ timeout: cfg.timeoutMs, ignoreHTTPSErrors: false });
    const samples = [];
    const started = performance.now();
    try {
      // Each worker performs sequential requests; workers run concurrently.
      await Promise.all(Array.from({length: cfg.users}, async (_, user) => {
        for (let i=0; i<cfg.iterations; i++) {
          const t = performance.now();
          try {
            const response = await context.get(url);
            samples.push({user, iteration:i, durationMs:performance.now()-t, status:response.status(), ok:response.ok()});
            await response.dispose();
          } catch (err) {
            samples.push({user, iteration:i, durationMs:performance.now()-t, status:0, ok:false, error:String(err.message || err)});
          }
        }
      }));
    } finally { await context.dispose(); }
    const summary = summarize(samples, performance.now()-started);
    const thresholds = evaluate(summary, {p95Ms:cfg.p95Ms, maxErrorRate:cfg.maxErrorRate});
    const report = {url, workload:{users:cfg.users,iterations:cfg.iterations}, thresholds, summary, samples};
    const dir = path.join('test-results','performance');
    await fs.mkdir(dir,{recursive:true});
    const filename = path.join(dir,'api-performance.json');
    await fs.writeFile(filename, JSON.stringify(report,null,2));
    await testInfo.attach('api-performance.json',{body:JSON.stringify(report,null,2),contentType:'application/json'});
    expect(thresholds.errorRate, 'API error-rate threshold').toBe(true);
    expect(thresholds.p95, 'API p95 threshold').toBe(true);
  });
});
