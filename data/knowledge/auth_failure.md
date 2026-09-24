# Auth Service JWT Certificate Rotation Failure

## INC-037 - JWT Certificate Rotation Failure

The auth-service began rejecting valid user tokens with 401 Unauthorized errors after a scheduled certificate rotation.

### Symptoms
- A sudden spike in 401 Unauthorized responses across authenticated endpoints.
- Errors reference token signature verification failures.
- Issue began immediately after a scheduled deployment or certificate rotation.

### Root Cause
The signing certificate was rotated, but the service's public key cache was not refreshed, so it continued validating tokens against the old, now-invalid key.

### Resolution
Reduced the public key cache TTL and added a forced cache refresh step to the certificate rotation deployment process.

## Troubleshooting: Authentication Failures After Certificate Rotation

If authenticated requests begin failing with signature verification errors:

1. Check whether a certificate or key rotation occurred recently.
2. Check whether the service's key cache has been refreshed since the rotation.
3. Compare the timing of the failure spike against the rotation or deployment timestamp.
4. Check for consistent 401 errors specifically referencing signature or token verification, rather than generic auth failures.
5. If failures started immediately after a rotation and reference signature verification, treat stale key caching as the primary suspect.
