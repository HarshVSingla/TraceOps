export const mockLogs = [
  {
    id: "log-101",
    timestamp: "2026-09-16 09:02:15.812",
    service: "payment-api",
    level: "ERROR",
    message: "request took 5100ms: asyncpg.exceptions.QueryCanceledError: canceling statement due to user request",
    traceId: "trace-9182aa-01",
    spanId: "span-412",
    endpoint: "POST /v1/charges/process",
    statusCode: 504,
    durationMs: 5100,
    attributes: {
      client_id: "acct_984218",
      connection_pool_active: 10,
      connection_pool_queued: 42,
      db_host: "postgres-cluster.internal:5432"
    },
    stackTrace: `asyncpg.exceptions.QueryCanceledError: canceling statement due to statement timeout
  File "/app/services/payment_service.py", line 142, in process_charge
    async with db.acquire(timeout=5.0) as conn:
  File "/usr/local/lib/python3.11/site-packages/asyncpg/pool.py", line 224, in acquire
    raise exceptions.PoolTimeoutError('connection pool queue limit reached: 10 max')`
  },
  {
    id: "log-102",
    timestamp: "2026-09-16 09:01:10.104",
    service: "payment-api",
    level: "ERROR",
    message: "database connection timeout while acquiring connection from pool (max=10)",
    traceId: "trace-9182aa-02",
    spanId: "span-413",
    endpoint: "POST /v1/refunds",
    statusCode: 500,
    durationMs: 5012,
    attributes: {
      client_id: "acct_102914",
      connection_pool_active: 10,
      connection_pool_queued: 38
    },
    stackTrace: `asyncpg.exceptions.PoolTimeoutError: connection pool acquire timeout (5000ms)
  File "/app/db/connection.py", line 88, in get_connection
    return await pool.acquire(timeout=settings.DB_TIMEOUT)`
  },
  {
    id: "log-103",
    timestamp: "2026-09-16 09:00:05.901",
    service: "payment-api",
    level: "ERROR",
    message: "request took 5000ms: gateway upstream request timed out",
    traceId: "trace-9182aa-03",
    spanId: "span-414",
    endpoint: "POST /v1/charges/process",
    statusCode: 504,
    durationMs: 5000,
    attributes: {
      client_id: "acct_552199",
      connection_pool_active: 10,
      connection_pool_queued: 31
    }
  },
  {
    id: "log-104",
    timestamp: "2026-09-16 09:00:04.412",
    service: "payment-api",
    level: "ERROR",
    message: "database connection timeout: failed to acquire connection within 5000ms",
    traceId: "trace-9182aa-04",
    spanId: "span-415",
    endpoint: "GET /v1/payment_methods",
    statusCode: 500,
    durationMs: 5002,
    attributes: {
      connection_pool_active: 10,
      connection_pool_queued: 25
    }
  },
  {
    id: "log-105",
    timestamp: "2026-09-16 09:00:03.189",
    service: "payment-api",
    level: "ERROR",
    message: "database connection timeout: pool exhausted",
    traceId: "trace-9182aa-05",
    spanId: "span-416",
    endpoint: "POST /v1/charges/process",
    statusCode: 500,
    durationMs: 5001,
    attributes: {
      connection_pool_active: 10,
      connection_pool_queued: 19
    }
  },
  {
    id: "log-106",
    timestamp: "2026-09-16 09:00:01.011",
    service: "api-gateway",
    level: "WARN",
    message: "upstream payment-api 504 Gateway Timeout on /v1/charges/process, retrying (attempt 1/2)",
    traceId: "trace-9182aa-06",
    spanId: "span-417",
    endpoint: "POST /v1/charges/process",
    statusCode: 504,
    durationMs: 5010,
    attributes: {
      upstream_cluster: "payment_api_service",
      retry_budget_percent: 88
    }
  },
  {
    id: "log-107",
    timestamp: "2026-09-16 08:58:20.450",
    service: "postgres-cluster",
    level: "WARN",
    message: "client connection slot wait queue exceeded 20 pending requests for user 'payment_usr'",
    traceId: "trace-pg-9912",
    spanId: "span-pg-01",
    endpoint: "SQL",
    statusCode: 0,
    durationMs: 240,
    attributes: {
      max_connections: 500,
      current_active: 412,
      waiting_backends: 24
    }
  },
  {
    id: "log-108",
    timestamp: "2026-09-16 08:55:12.671",
    service: "payment-api",
    level: "INFO",
    message: "request completed in 230ms: 200 OK POST /v1/charges/process",
    traceId: "trace-8891-ok",
    spanId: "span-401",
    endpoint: "POST /v1/charges/process",
    statusCode: 200,
    durationMs: 230,
    attributes: {
      client_id: "acct_102914",
      amount_cents: 9900
    }
  },
  {
    id: "log-109",
    timestamp: "2026-09-16 08:50:01.320",
    service: "payment-api",
    level: "INFO",
    message: "request completed in 210ms: 200 OK GET /v1/payment_methods",
    traceId: "trace-8890-ok",
    spanId: "span-400",
    endpoint: "GET /v1/payment_methods",
    statusCode: 200,
    durationMs: 210,
    attributes: {
      client_id: "acct_552199"
    }
  },
  {
    id: "log-110",
    timestamp: "2026-09-16 08:45:10.005",
    service: "payment-api",
    level: "INFO",
    message: "Application container v2.4.0 started with DB_POOL_MAX=10, DB_TIMEOUT=5000ms",
    traceId: "trace-boot-01",
    spanId: "span-001",
    endpoint: "SYSTEM",
    statusCode: 200,
    durationMs: 120,
    attributes: {
      env: "production",
      commit: "f8e3c12"
    }
  },
  {
    id: "log-111",
    timestamp: "2026-09-16 08:40:00.118",
    service: "auth-service",
    level: "INFO",
    message: "token verification cache hit 99.4%, avg latency 1.4ms",
    traceId: "trace-auth-77",
    spanId: "span-auth-01",
    endpoint: "POST /auth/verify",
    statusCode: 200,
    durationMs: 2,
    attributes: {}
  },
  {
    id: "log-112",
    timestamp: "2026-09-16 08:35:44.200",
    service: "redis-cache",
    level: "INFO",
    message: "CLUSTER SLOTS verified 16384/16384 ok, memory 1.4GB / 8GB",
    traceId: "trace-redis-01",
    spanId: "span-red-01",
    endpoint: "HEALTHCHECK",
    statusCode: 200,
    durationMs: 1,
    attributes: {}
  }
];
