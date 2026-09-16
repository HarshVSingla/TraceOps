# Payment API Troubleshooting

## Database Connection Timeout

If the payment API reports repeated database connection timeouts:

1. Check the database connection pool configuration.
2. Check the database timeout settings.
3. Compare the current configuration with the previous stable deployment.
4. If the issue started immediately after a deployment, investigate the deployment changes.