export const mockIncidents = [
  {
    id: "INC-001",
    title: "API latency increased & DB timeouts after deployment",
    service: "payment-api",
    severity: "high", // critical, high, medium, low
    severityRank: "P1",
    description: "API response time increased from 200ms to 5 seconds after a recent deployment v2.4.0. Multiple database connection timeouts detected.",
    timestamp: "2026-09-16T09:00:00Z",
    detectedTime: "42 mins ago",
    status: "investigating", // investigating, active, mitigated, resolved
    commander: "Alex Rivera (Lead SRE)",
    affectedServices: ["payment-api", "api-gateway", "postgres-cluster"],
    rootCauseSummary: "Database connection pool size reduced from 50 to 10 in deployment v2.4.0, causing severe pool starvation under peak traffic.",
    confidence: 96,
    mttd: "3m 12s",
    mttrForecast: "12m remaining",
    errorRateSpike: "+4.8%",
    p95LatencySpike: "4,210 ms (baseline 210 ms)",
    leadAgent: "Root Cause Agent",
    agentStatus: "Remediation Pending Approval",
    recommendedAction: {
      actionType: "rollback",
      targetVersion: "v2.3.9",
      summary: "Rollback deployment v2.4.0 to v2.3.9 or hotfix DB_POOL_MAX to 50",
      estimatedDowntime: "0s (zero-downtime rolling restart)",
      humanApprovalRequired: true,
      applied: false,
    },
    timeline: [
      {
        id: "t1",
        time: "08:45:00",
        type: "deployment",
        title: "Deployment v2.4.0 completed",
        description: "payment-api updated commit f8e3c12 (db config changes)",
        author: "CI/CD Pipeline"
      },
      {
        id: "t2",
        time: "09:00:03",
        type: "error",
        title: "First connection timeout detected",
        description: "asyncpg.PoolTimeoutError: pool exhausted (max=10)",
        author: "Datadog APM"
      },
      {
        id: "t3",
        time: "09:00:15",
        type: "alert",
        title: "P1 Alert Triggered: High Latency SLO Breach",
        description: "p95 latency exceeded 2,000ms threshold (measured 4,210ms)",
        author: "PagerDuty"
      },
      {
        id: "t4",
        time: "09:00:20",
        type: "ai",
        title: "TraceOps Orchestrator Dispatched",
        description: "Log Agent, Deployment Agent, Knowledge Agent launched in parallel",
        author: "TraceOps AI"
      },
      {
        id: "t5",
        time: "09:00:48",
        type: "ai_success",
        title: "Root Cause Identified with 96% Confidence",
        description: "Cross-correlated commit f8e3c12 config diff with past incident INC-023",
        author: "Root Cause Agent"
      },
      {
        id: "t6",
        time: "09:01:00",
        type: "action",
        title: "Awaiting Human Sign-off for Automated Rollback",
        description: "Remediation proposal generated: revert DB_POOL_MAX to 50",
        author: "TraceOps Safety Guard"
      }
    ]
  },
  {
    id: "INC-002",
    title: "Upstream 504 Gateway Timeouts cascading to Web/Mobile clients",
    service: "api-gateway",
    severity: "high",
    severityRank: "P1",
    description: "Cloudflare reports 3.1% of public requests returning 504 Gateway Timeout due to slow payment-api upstream responses.",
    timestamp: "2026-09-16T09:05:00Z",
    detectedTime: "37 mins ago",
    status: "active",
    commander: "Sarah Chen (Platform Infra)",
    affectedServices: ["api-gateway", "payment-api"],
    rootCauseSummary: "Direct secondary cascade caused by payment-api database latency timeouts.",
    confidence: 91,
    mttd: "1m 45s",
    mttrForecast: "15m remaining",
    errorRateSpike: "+3.15%",
    p95LatencySpike: "380 ms (baseline 48 ms)",
    leadAgent: "Orchestrator",
    agentStatus: "Linked as secondary cascade to INC-001",
    recommendedAction: {
      actionType: "isolate",
      summary: "Enable circuit breaker for non-critical payment endpoints to stop client retry storms",
      humanApprovalRequired: true,
      applied: false,
    },
    timeline: [
      {
        id: "t21",
        time: "09:05:00",
        type: "alert",
        title: "Gateway 504 Spike Alert",
        description: "Rate of 504 exceeded 1% threshold on ingress gateway",
        author: "Prometheus Alertmanager"
      },
      {
        id: "t22",
        time: "09:05:30",
        type: "ai",
        title: "AI Causality Graph Linked to INC-001",
        description: "TraceOps correlation identified payment-api as single upstream bottleneck",
        author: "Orchestrator Agent"
      }
    ]
  },
  {
    id: "INC-003",
    title: "PostgreSQL Client Connection Wait Queue Saturation",
    service: "postgres-cluster",
    severity: "medium",
    severityRank: "P2",
    description: "Database backend slot wait queue exceeded 24 pending connections for payment_usr role.",
    timestamp: "2026-09-16T08:58:00Z",
    detectedTime: "44 mins ago",
    status: "investigating",
    commander: "Devon Vance (DBRE)",
    affectedServices: ["postgres-cluster", "payment-api"],
    rootCauseSummary: "Abrupt connection churn from clients repeatedly reconnecting after 5000ms timeouts.",
    confidence: 88,
    mttd: "4m 10s",
    mttrForecast: "25m",
    errorRateSpike: "+2.1%",
    p95LatencySpike: "84 ms",
    leadAgent: "Log Agent",
    agentStatus: "Analyzing Query Locks",
    recommendedAction: {
      actionType: "scale",
      summary: "Flush idle client threads and maintain connection pooling at service tier",
      humanApprovalRequired: false,
      applied: false,
    },
    timeline: [
      {
        id: "t31",
        time: "08:58:00",
        type: "alert",
        title: "Postgres Connection Queue Warning",
        description: "Wait queue exceeded 20 slots",
        author: "AWS RDS Alarms"
      }
    ]
  },
  {
    id: "INC-004",
    title: "Intermittent Redis cache shard replica sync delay",
    service: "redis-cache",
    severity: "low",
    severityRank: "P3",
    description: "Replica node redis-03 experienced 450ms replication lag during automated snapshot generation.",
    timestamp: "2026-09-15T22:15:00Z",
    detectedTime: "11 hours ago",
    status: "resolved",
    commander: "Automated SRE Agent",
    affectedServices: ["redis-cache"],
    rootCauseSummary: "BGSAVE fork copy-on-write memory overhead during heavy evening traffic.",
    confidence: 99,
    mttd: "45s",
    mttrForecast: "Resolved",
    errorRateSpike: "0.0%",
    p95LatencySpike: "4.2 ms",
    leadAgent: "Root Cause Agent",
    agentStatus: "Closed",
    recommendedAction: {
      actionType: "config",
      summary: "Rescheduled BGSAVE snapshots to low-traffic maintenance window (03:00 UTC)",
      humanApprovalRequired: false,
      applied: true,
    },
    timeline: [
      {
        id: "t41",
        time: "22:15:00",
        type: "alert",
        title: "Replica sync lag warning",
        description: "Replication offset exceeded 10MB threshold",
        author: "CloudWatch"
      },
      {
        id: "t42",
        time: "22:17:30",
        type: "ai_success",
        title: "Autonomous Resolution Applied",
        description: "Snapshot moved to secondary replica; lag dropped to 0ms",
        author: "TraceOps Autonomous Remediation"
      }
    ]
  }
];
