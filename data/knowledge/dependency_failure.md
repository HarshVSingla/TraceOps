# Redis Cache Replica Replication Lag

## INC-058 - Redis Replica Replication Lag

Services reading from a redis-cache replica began receiving stale data.

### Symptoms
- Reads from the replica return outdated values compared to the primary.
- Replication lag metrics show an increasing delay between primary and replica.
- Downstream services relying on the replica show inconsistent behavior.

### Root Cause
The replica fell behind the primary due to a sustained write burst that exceeded the replica's replication throughput, causing an increasing lag rather than the expected near-real-time sync.

### Resolution
Added replication lag monitoring with alerting thresholds and adjusted read routing to fall back to the primary when lag exceeds an acceptable threshold.

## Troubleshooting: Replica Replication Lag

If services reading from a replica report stale or inconsistent data:

1. Check current replication lag metrics between primary and replica.
2. Check for recent spikes in write volume to the primary.
3. Compare the timing of stale reads against the onset of increased replication lag.
4. Check whether read routing falls back to the primary when lag is high.
5. If lag is elevated and correlates with a write volume spike, treat replication lag as the primary suspect rather than the replica being down.
