# ADR 0005: Cron Jobs for Backend Services

## Status

Accepted

## Context

Backend services are deployed on the **Render free tier**, which spins down instances after periods of inactivity. This means long-running or periodic maintenance tasks (database cleanup, cache warming, health checks) cannot rely on a permanently active process. We needed a way to schedule recurring HTTP requests to wake services and trigger maintenance logic.

## Decision

We implemented a secured `GET /api/cron` endpoint in the `common-app-service` and schedule it using **cron-job.org**.

## Options Considered

### In-process cron (node-cron / bull)
- Requires a permanently running process — not viable on Render's free tier
- Adds process-level complexity

### External cron service — cron-job.org
- Free tier supports scheduling HTTP requests at intervals as low as 1 minute
- No account required for basic usage
- Supports custom headers for authentication (`x-cron-secret`)
- Reliable and simple — just hit a URL on a schedule

### External cron service — EasyCron / SetCronJob
- Similar functionality but with stricter free-tier limits
- Fewer free jobs per account

## Rationale

1. **Render free tier constraints**: Services spin down after 15 minutes of inactivity. A cron job pinging the service every 5 minutes keeps it warm and ensures task execution.

2. **cron-job.org is free**: The service offers 3+ scheduled jobs at no cost, which covers our needs without introducing billing.

3. **Header-based auth**: cron-job.org supports custom HTTP headers, allowing us to secure the endpoint with the `x-cron-secret` header — keeping credentials out of URLs and server logs.

4. **Simple architecture**: The endpoint is a lightweight health-check that logs execution time. Future maintenance logic (expired URL cleanup, session pruning) can be added without architectural changes.

## Consequences

- The `CRON_SECRET` environment variable must be set on all environments where the cron endpoint is reachable
- The cron endpoint must remain lightweight — heavy work should be offloaded to background processing if needed
- cron-job.org availability is relied upon for service wake-up
