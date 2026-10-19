export function percentile(values, p) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const rank = (sorted.length - 1) * p / 100;
  const low = Math.floor(rank), high = Math.ceil(rank);
  return sorted[low] + (sorted[high] - sorted[low]) * (rank - low);
}
export function summarize(samples, elapsedMs) {
  const durations = samples.map(s => s.durationMs);
  const failures = samples.filter(s => !s.ok).length;
  return {
    requests: samples.length, failures,
    errorRate: samples.length ? failures / samples.length : 0,
    throughputRps: elapsedMs > 0 ? samples.length / (elapsedMs / 1000) : 0,
    meanMs: durations.length ? durations.reduce((a,b) => a+b,0)/durations.length : 0,
    p50Ms: percentile(durations,50), p90Ms: percentile(durations,90),
    p95Ms: percentile(durations,95), p99Ms: percentile(durations,99),
    maxMs: durations.length ? Math.max(...durations) : 0
  };
}
export function evaluate(summary, thresholds) {
  return {
    p95: summary.p95Ms <= thresholds.p95Ms,
    errorRate: summary.errorRate <= thresholds.maxErrorRate
  };
}
