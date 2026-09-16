# Previous Incidents

## INC-023 - Payment API Latency

The payment API experienced high latency after a deployment.

### Symptoms
- Response time increased significantly.
- Multiple database connection timeout errors appeared.

### Root Cause
The database connection pool configuration was changed incorrectly.

### Resolution
The connection pool configuration was reverted to the previous stable configuration.