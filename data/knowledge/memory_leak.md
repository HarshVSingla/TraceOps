# Auth Service Memory Leak (OOMKilled)

## INC-041 - Auth Service Memory Leak

The auth-service was repeatedly restarted after being OOMKilled by the container orchestrator.

### Symptoms
- Memory usage climbed steadily over several hours without release.
- Health checks began failing shortly before each restart.
- Container was OOMKilled and automatically restarted.

### Root Cause
A session cache introduced in a recent deployment did not evict expired entries, causing unbounded memory growth over time.

### Resolution
Added a time-based eviction policy to the session cache and set an explicit memory limit with alerting before the OOM threshold.

## Troubleshooting: Memory Leaks and OOMKilled Containers

If a service is repeatedly OOMKilled or shows steadily increasing memory usage:

1. Check memory usage trends over time, not just the current value.
2. Identify any recently deployed caches, buffers, or in-memory stores.
3. Check whether the cache or buffer has an eviction or expiry policy.
4. Compare memory growth timing against the most recent deployment.
5. If growth is unbounded and tied to a recent deployment, treat the new caching/buffering logic as the primary suspect.
