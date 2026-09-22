export const mockInvestigationScenarios = [
  {
    id: "scenario-payment",
    label: "Payment API Latency Spike (INC-001)",
    service: "payment-api",
    description: "API response time increased from 200ms to 5 seconds after a recent deployment.",
    result: {
      incident_service: "payment-api",
      log_evidence: {
        total_logs: 7,
        error_count: 5,
        errors: [
          "2026-09-16 09:00:03 ERROR payment-api database connection timeout",
          "2026-09-16 09:00:04 ERROR payment-api database connection timeout",
          "2026-09-16 09:00:05 ERROR payment-api request took 5000ms",
          "2026-09-16 09:01:10 ERROR payment-api database connection timeout",
          "2026-09-16 09:02:15 ERROR payment-api request took 5100ms"
        ],
        sample_stack: `asyncpg.exceptions.PoolTimeoutError: connection pool acquire timeout (5000ms)
  File "/app/services/payment_service.py", line 142, in process_charge
    async with db.acquire(timeout=5.0) as conn:
  File "/usr/local/lib/python3.11/site-packages/asyncpg/pool.py", line 224, in acquire
    raise exceptions.PoolTimeoutError('connection pool queue limit reached: 10 max')`
      },
      deployment_evidence: {
        service: "payment-api",
        latest_version: "v2.4.0",
        previous_version: "v2.3.9",
        deployment_time: "2026-09-16T08:45:00",
        commit_hash: "f8e3c12",
        author: "dev-sre@traceops.internal",
        changes: [
          "Changed database connection pool configuration (reduced pool size from 50 to 10)",
          "Updated database timeout settings (reduced timeout from 30s to 5000ms)"
        ],
        diff: [
          { file: "config/database.py", type: "delete", line: "- DB_POOL_MAX = 50" },
          { file: "config/database.py", type: "add", line: "+ DB_POOL_MAX = 10" },
          { file: "config/database.py", type: "delete", line: "- DB_TIMEOUT = 30.0" },
          { file: "config/database.py", type: "add", line: "+ DB_TIMEOUT = 5.0" }
        ]
      },
      knowledge_evidence: {
        matches: [
          {
            file_name: "troubleshooting.md",
            title: "Payment API Database Connection Timeout Runbook",
            relevanceScore: "98%",
            content: "If the payment API reports repeated database connection timeouts: 1. Check database connection pool configuration. 2. Check timeout settings. 3. Compare current config with previous stable deployment. 4. If issue started immediately after deployment, investigate deployment changes."
          },
          {
            file_name: "previous_incidents.md",
            title: "Historical Incident INC-023: Payment API Latency",
            relevanceScore: "95%",
            content: "Symptoms: Response time increased significantly; multiple database connection timeout errors. Root Cause: The database connection pool configuration was changed incorrectly. Resolution: The connection pool configuration was reverted to the previous stable configuration."
          }
        ]
      },
      root_cause_analysis: {
        incident_summary: "The payment API is experiencing severe latency degradation (p95 spiked to 5,100ms) and repeated database connection timeouts immediately following deployment v2.4.0.",
        root_cause: "Deployment v2.4.0 reduced the database connection pool maximum size from 50 to 10 and reduced connection timeout to 5 seconds. Under normal traffic (~850 req/s), this exhausted all available connection slots, queuing incoming requests and triggering statement timeouts.",
        confidence: "96% (Very High)",
        evidence: [
          "Logs report 5 connection timeout errors starting at 09:00:03, 15 minutes post-deployment",
          "Deployment v2.4.0 specifically altered DB connection pool configuration",
          "Historical incident INC-023 confirms identical root cause and symptoms in past deployment"
        ],
        recommended_fix: "Revert deployment v2.4.0 back to v2.3.9, or deploy an immediate hotfix resetting DB_POOL_MAX to 50 and DB_TIMEOUT to 30.0 seconds in config/database.py.",
        verification_steps: [
          "Trigger zero-downtime rollback to version v2.3.9",
          "Monitor /v1/charges/process latency; confirm p95 returns below 250ms",
          "Inspect PostgreSQL connection pool metrics to ensure active connections stabilize under 35",
          "Verify zero 504 Gateway Timeouts in api-gateway access logs over 5 minutes"
        ],
        human_approval_required: true,
        proposed_patch: `--- a/config/database.py
+++ b/config/database.py
@@ -12,2 +12,2 @@
-DB_POOL_MAX = 10
-DB_TIMEOUT = 5.0
+DB_POOL_MAX = 50
+DB_TIMEOUT = 30.0`
      }
    }
  },
  {
    id: "scenario-auth",
    label: "Auth Service Redis Timeout (INC-005)",
    service: "auth-service",
    description: "Token validation endpoint returning 500 internal server errors intermittently.",
    result: {
      incident_service: "auth-service",
      log_evidence: {
        total_logs: 12,
        error_count: 8,
        errors: [
          "2026-09-16 07:12:01 ERROR auth-service redis i/o timeout while reading session key",
          "2026-09-16 07:12:05 ERROR auth-service fallback to secondary JWT store failed",
          "2026-09-16 07:12:10 ERROR auth-service context deadline exceeded"
        ],
        sample_stack: `redis.exceptions.TimeoutError: Connection to redis-cluster-node-02:6379 timed out after 1000ms
  at /app/cache/redis.go:78`
      },
      deployment_evidence: {
        service: "auth-service",
        latest_version: "v1.18.2",
        previous_version: "v1.18.1",
        deployment_time: "4 days ago",
        changes: ["Standard dependency security patches"],
        diff: []
      },
      knowledge_evidence: {
        matches: [
          {
            file_name: "redis_cluster_ops.md",
            title: "Redis Cluster Failover & Client Read Replicas",
            relevanceScore: "91%",
            content: "Network partition or transient failovers on Redis nodes require auth-service client pool to cycle dead socket handles rather than hanging indefinitely."
          }
        ]
      },
      root_cause_analysis: {
        incident_summary: "Auth-service token validation experiencing transient 500 errors due to stuck TCP socket on degraded Redis replica node 02.",
        root_cause: "Node 02 in Redis cluster underwent planned memory compaction, causing 1200ms socket freezes. Client pool lacked proper TCP keepalive retries.",
        confidence: "89% (High)",
        evidence: [
          "Logs clearly flag socket timeout on node redis-02",
          "No recent code deployment in last 4 days; infrastructure level event"
        ],
        recommended_fix: "Force client pool refresh on auth-service pods and adjust Redis client connectTimeout from 1000ms to 2500ms with jittered exponential backoff.",
        verification_steps: [
          "Restart auth-service pod instances sequentially",
          "Verify Redis cluster node health in topology map",
          "Validate p99 authentication latency is under 30ms"
        ],
        human_approval_required: false,
        proposed_patch: `--- a/cache/redis.go
+++ b/cache/redis.go
@@ -40,1 +40,2 @@
- ReadTimeout: 1000 * time.Millisecond,
+ ReadTimeout: 2500 * time.Millisecond,
+ MaxRetries:  3,`
      }
    }
  }
];
