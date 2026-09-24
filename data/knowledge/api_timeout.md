# API Gateway Upstream Timeout Cascade

## INC-052 - Upstream API Timeout Cascade

The api-gateway began returning elevated 504 Gateway Timeout responses to clients.

### Symptoms
- A spike in 504 errors across multiple downstream routes.
- Upstream service response times increased significantly before failures began.
- Retry storms amplified load on already slow upstream services.

### Root Cause
A downstream dependency's response time degraded, and the gateway's retry policy did not have a circuit breaker, causing retries to compound the load on an already struggling service.

### Resolution
Added a circuit breaker to the retry policy and reduced the retry count for upstream calls exceeding a latency threshold.

## Troubleshooting: Upstream Timeout Cascades

If the gateway reports a spike in timeout or 504 errors:

1. Check upstream response time trends leading up to the failures.
2. Check whether retries are amplifying load on a slow upstream service.
3. Check whether a circuit breaker or retry limit is configured.
4. Compare the timing of the timeout spike against recent deployments to the gateway or its upstream dependencies.
5. If retries are compounding an existing slowdown, treat the retry policy as a contributing factor alongside the upstream slowdown.
