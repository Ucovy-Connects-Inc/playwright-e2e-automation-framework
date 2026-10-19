# Playwright performance testing (Weeks 1–4)

## Purpose
This module adds repeatable **lightweight** API concurrency checks and browser navigation measurements to the existing Playwright JavaScript suite. It does not replace a dedicated load generator for high-scale peak, stress, spike, or endurance testing.

## Coverage and design
- Week 1: Identify read-only critical API paths and browser journeys; define environment, traffic expectations, thresholds and monitoring.
- Week 2: Add isolated API and browser performance scenarios with configurable targets.
- Week 3: Bounded concurrent virtual requests, response-time percentiles, throughput and error-rate checks.
- Week 4: Machine-readable JSON artifacts, Playwright attachments, CI opt-in execution and documented validation.

## Setup
Use a **permitted non-production environment**. The test is disabled by default unless explicitly invoked.

PowerShell example:

```powershell
$env:PERF_BASE_URL = "https://qa.example.com"
$env:PERF_API_PATH = "/health"
$env:PERF_BROWSER_PATH = "/"
$env:PERF_USERS = "2"
$env:PERF_ITERATIONS = "5"
$env:PERF_P95_MS = "3000"
$env:PERF_MAX_ERROR_RATE = "0.05"
npx playwright test tests/performance --project=chromium-ai-visual --workers=1
```

The API workload uses GET requests only; choose a safe, authorized endpoint. It starts all workers together and does **not** implement gradual ramp-up. The report is written to `test-results/performance/api-performance.json` and attached to Playwright test results.

## Interpreting results
- p50/p90/p95/p99: observed request-duration percentiles.
- Throughput: completed requests per second across the sampled wall-clock period.
- Error rate: unsuccessful HTTP responses and request exceptions divided by total requests.
- Browser metrics: navigation duration, DOM content loaded, response end, first paint and first contentful paint (when available).
- Results include network conditions and runner overhead; compare equivalent environments and repeat runs.

## Important limitations
Playwright is not a dedicated high-load engine. Browser tests do not simulate large numbers of real users. There is no implemented ramp-up, soak test, backend CPU/memory telemetry, Core Web Vitals LCP/CLS/INP, or AI bottleneck diagnosis in this phase. These require separate instrumentation or a load tool such as k6.

## Next steps
Configure actual authorized journeys, record baseline results, tune thresholds from measured data, integrate application observability, and use a purpose-built load generator for high concurrency. Never target production without approval.
