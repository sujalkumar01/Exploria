const { LRUCache } = require("lru-cache");

const cache = new LRUCache({
  max: 15
});

let latencies = [];
let hitCount = 0;
let missCount = 0;

function trackLatency(latency) {
  latencies.push(latency);
}

function getP90() {
  if (latencies.length === 0) return 0;
  const sorted = [...latencies].sort((a, b) => a - b);
  const index = Math.floor(0.9 * sorted.length);
  return sorted[index];
}

function getStats() {
  return {
    size: cache.size,
    hits: hitCount,
    misses: missCount,
  };
}

function resetLatencies() {
  latencies = [];
  hitCount = 0;
  missCount = 0;
}

function resetCache() {
  cache.clear();
  resetLatencies();
}

const originalGet = cache.get.bind(cache);
cache.get = (key) => {
  const result = originalGet(key);
  if (result !== undefined) hitCount++;
  else missCount++;
  return result;
};

module.exports = {
  cache,
  trackLatency,
  getP90,
  getStats,
  resetLatencies,
  resetCache,
};
