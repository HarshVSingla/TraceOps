# Postgres Cluster Connection Pool Saturation

## INC-045 - Connection Pool Saturation

Services connecting to the postgres-cluster began failing to acquire database connections.

### Symptoms
- Errors indicating no available connections in the pool.
- Increased request latency as callers wait for a connection.
- Issue correlates with an increase in concurrent traffic or a recent configuration change.

### Root Cause
The connection pool's maximum size was set too low for the current traffic level, or a recent configuration change reduced the pool size, causing connections to be exhausted under normal load.

### Resolution
Increased the connection pool size to match expected concurrent load and added monitoring on pool utilization to catch saturation before it causes failures.

## Troubleshooting: Connection Pool Saturation

If services report an inability to acquire database connections:

1. Check current connection pool size and utilization.
2. Check whether the pool size was recently changed in a deployment or configuration update.
3. Compare current traffic levels against the pool's configured capacity.
4. Check whether connections are being released properly or are being held longer than expected.
5. If pool utilization is consistently at capacity, treat pool sizing as the primary suspect.
