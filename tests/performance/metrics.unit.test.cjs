const {test} = require('node:test');
const assert = require('node:assert/strict');
// Import ES module without relying on project package type.
test('percentiles and empty sample behavior', async () => {
  const {percentile,summarize,evaluate} = await import('../../utils/performance/metrics.js');
  assert.equal(percentile([10,20,30],50),20);
  assert.equal(percentile([],95),0);
  const summary = summarize([{durationMs:100,ok:true},{durationMs:200,ok:false}],1000);
  assert.equal(summary.requests,2);
  assert.equal(summary.errorRate,0.5);
  assert.equal(summary.throughputRps,2);
  assert.deepEqual(evaluate(summary,{p95Ms:300,maxErrorRate:0.1}),{p95:true,errorRate:false});
});
