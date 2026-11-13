# woc-service — RIT Winter of Code backend

Express + TypeScript + Supabase + Zod API for RIT Winter of Code
(IEEE RIT-B Suite).

## Getting Started

### Prerequisites
- Node.js & pnpm
- Supabase project URL and keys (`SUPABASE_URL`, `SUPABASE_ANON_KEY`)

### Database Setup
Execute `supabase-schema.sql` in your Supabase SQL Editor:
- Creates `organizations`, `projects`, and `registrations` tables.
- Disables RLS (or grants public policies) so endpoints can query and register.

### Configure & Run
From the monorepo root:
```bash
cp services/backend/woc-service/.env.example services/backend/woc-service/.env
# fill in SUPABASE_URL and SUPABASE_ANON_KEY
pnpm --filter woc-service build
pnpm --filter woc-service start   # serves on PORT (default 3004)
```

### Seed real project data
```bash
pnpm --filter woc-service seed
```
Seeds Technorishi Consulting Pvt. Ltd. and the BPM project from `src/assets/`.

### Tests
```bash
pnpm --filter woc-service test
```

## Structure
- `src/index.ts` - Entry point (verifies Supabase client, boots server)
- `src/configs/` - Configurations (port, Supabase credentials, secrets)
- `src/controllers/` - Route handlers
- `src/routes/` - Route definitions
- `src/schemas/` - Input validations (Zod)
- `src/middlewares/` - Rate limiting, error handling, async wrappers
- `src/db/` - Supabase client connection & helpers
- `src/assets/` - Project listing assets and PDFs
- `supabase-schema.sql` - Table definitions for Supabase

## Endpoints (base `/api`)
- `GET /ping` - Health check
- `GET /sample` - Sample endpoint
- `GET /cron` - Secured cron endpoint (requires `x-cron-secret` header)
- Organizations — `POST /organizations`, `GET /organizations`, `GET /organizations/:id`
- Projects — `POST /projects`, `GET /projects` (`organizationId`/`difficulty` filters), `GET /projects/:id`, `GET /projects/slug/:slug`
- Registrations — `POST /projects/:id/register` (open registration), `GET /projects/:id/registrations`, `GET /projects/:id/registrations/me`
