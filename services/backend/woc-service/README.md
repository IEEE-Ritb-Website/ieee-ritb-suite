# woc-service

Backend Express microservice for the IEEE RIT-B Suite.

## Getting Started

### Prerequisites
- Node.js & pnpm

### Run in Development
From the monorepo root:
```bash
pnpm --filter woc-service dev
```

## Structure
- `src/index.ts` - Entry point
- `src/configs/` - Configurations
- `src/controllers/` - Route handlers
- `src/routes/` - Route definitions
- `src/schemas/` - Input validations (Zod)

## Endpoints
- `GET /api/ping` - Health check
- `GET /api/sample` - Sample endpoint
- `GET /api/cron` - Secured cron endpoint (requires `x-cron-secret` header)
