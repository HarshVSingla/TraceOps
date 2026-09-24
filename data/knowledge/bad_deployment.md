# Payment API Deployment Config Drift

## INC-029 - Bad Deployment Config Drift

The payment-api began behaving inconsistently across instances after a deployment.

### Symptoms
- Some requests succeed while others fail with inconsistent error messages.
- Different instances of the same service appear to behave differently.
- Issue appeared immediately after a deployment rollout.

### Root Cause
The deployment did not apply the updated configuration uniformly across all instances, leaving some instances running with a stale configuration alongside instances running the new configuration.

### Resolution
Verified configuration consistency across all instances post-deployment and added a deployment health check that confirms configuration version before marking a rollout complete.

## Troubleshooting: Deployment Config Drift

If a service behaves inconsistently across instances after a deployment:

1. Compare configuration values across all running instances of the service.
2. Check whether the deployment completed uniformly across all instances.
3. Check deployment logs for partial rollout or failed instance updates.
4. Compare the timing of inconsistent behavior against the deployment timestamp.
5. If some instances show old behavior and others show new behavior, treat incomplete configuration rollout as the primary suspect.
