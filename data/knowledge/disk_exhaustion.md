# Order Worker Disk Space Exhaustion

## INC-063 - Container Disk Space Exhaustion

The order-worker container began failing to write temporary files and eventually crashed.

### Symptoms
- Errors indicating no space left on device.
- Failures writing temporary or log files.
- Container crashes or restarts following the disk errors.

### Root Cause
A local log or temporary file directory was not being rotated or cleaned up, causing disk usage to grow unbounded until the container's disk allocation was exhausted.

### Resolution
Added log rotation and periodic cleanup of temporary files, and set disk usage alerting before the container reaches capacity.

## Troubleshooting: Disk Space Exhaustion

If a container reports disk space errors or fails to write files:

1. Check current disk usage on the affected container.
2. Identify which directories are consuming the most space, particularly logs and temporary files.
3. Check whether log rotation or cleanup jobs are configured and running.
4. Compare the timing of disk growth against any recent change in logging verbosity or file write patterns.
5. If a specific directory shows unbounded growth without rotation, treat missing cleanup/rotation as the primary suspect.
