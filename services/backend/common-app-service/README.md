# 🛠️ common-app-service

Backend service for developer tools and URL shortener (`ritb.in`).

## ⏰ Cron Job

### `GET /api/cron`

A secured health-check endpoint designed to be triggered by an external cron scheduler.

**Setup with [cron-job.org](https://cron-job.org):**

```bash
# Generate a random secret key
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

1. Paste the generated key as `CRON_SECRET` in your `.env` file
2. In cron-job.org, create a new job pointing to `https://your-domain.com/api/cron`
3. Under **Advanced > Custom Headers**, add:
   ```
   x-cron-secret: <your-generated-key>
   ```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "timestamp": "2026-06-03T02:37:00.000Z",
    "message": "Cron job executed successfully"
  },
  "message": "Cron job completed"
}
```

**Response (401 — missing/invalid secret):**
```json
{
  "success": false,
  "error": {
    "type": "unauthorized",
    "message": "Invalid cron secret"
  }
}
```
