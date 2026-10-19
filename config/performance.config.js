function integer(name, fallback, max) {
  const n = Number(process.env[name] ?? fallback);
  if (!Number.isInteger(n) || n < 1 || n > max) throw new Error(`Invalid ${name}: expected integer 1..${max}`);
  return n;
}
function number(name, fallback, min, max) {
  const n = Number(process.env[name] ?? fallback);
  if (!Number.isFinite(n) || n < min || n > max) throw new Error(`Invalid ${name}`);
  return n;
}
export const performanceConfig = {
  baseURL: process.env.PERF_BASE_URL || '',
  apiPath: process.env.PERF_API_PATH || '/',
  browserPath: process.env.PERF_BROWSER_PATH || '/',
  users: integer('PERF_USERS', 2, 20),
  iterations: integer('PERF_ITERATIONS', 5, 100),
  p95Ms: number('PERF_P95_MS', 3000, 1, 120000),
  maxErrorRate: number('PERF_MAX_ERROR_RATE', 0.05, 0, 1),
  timeoutMs: number('PERF_TIMEOUT_MS', 15000, 100, 120000),
  allowWrite: process.env.PERF_ALLOW_WRITE === 'true'
};
export function requireSafeTarget(config) {
  if (!config.baseURL) throw new Error('Set PERF_BASE_URL to an approved test environment');
  const url = new URL(config.baseURL);
  if (!['https:', 'http:'].includes(url.protocol)) throw new Error('HTTP(S) target required');
  if (!config.allowWrite && !['GET','HEAD'].includes(process.env.PERF_METHOD || 'GET')) {
    throw new Error('Write requests require explicit PERF_ALLOW_WRITE=true');
  }
  return url;
}
