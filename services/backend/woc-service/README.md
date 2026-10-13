# woc-service — RIT Winter of Code backend

Express + TypeScript + MongoDB + Zod API for RIT Winter of Code
(IEEE RIT-B Suite).

## Getting Started

### Prerequisites
- Node.js & pnpm
- MongoDB reachable via `MONGODB_URI` (defaults to `mongodb://localhost:27017`)

### Configure & Run
From the monorepo root:
```bash
cp services/backend/woc-service/.env.example services/backend/woc-service/.env
# fill in values (Supabase keys come from the Supabase dashboard)
pnpm --filter woc-service build
pnpm --filter woc-service start   # serves on PORT (default 3004)
```

### Seed sample data (local dev)
```bash
pnpm --filter woc-service seed
```
Idempotent upserts of 2 organizations + 3 projects.

### Tests
```bash
pnpm --filter woc-service test   # vitest: auth, roles, guards, error mapping
```

## Structure
- `src/index.ts` - Entry point (connects DB, ensures indexes, boots server)
- `src/configs/` - Configurations (port, database, secrets)
- `src/controllers/` - Route handlers
- `src/routes/` - Route definitions
- `src/schemas/` - Input validations (Zod)
- `src/middlewares/` - Auth, roles, rate limiting, error handling
- `src/db/` - MongoDB connection + unique index setup
- `src/utils/` - Response helpers, roles, guards, CORS, Supabase client
- `src/__tests__/` - Vitest suite

## Endpoints (base `/api`)
- `GET /ping` - Health check
- `GET /sample` - Sample endpoint
- `GET /cron` - Secured cron endpoint (requires `x-cron-secret` header)
- Organizations — `POST /organizations` (mentor/admin), `GET /organizations`, `GET /organizations/:id`
- Projects — `POST /projects` (mentor/admin), `GET /projects` (`organizationId`/`difficulty` filters), `GET /projects/:id`, `GET /projects/slug/:slug`
- Registrations — `POST /projects/:id/register` (signed-in users), `GET /projects/:id/registrations` (mentor/admin), `GET /projects/:id/registrations/me` (own registration)

## Auth & Safety
- `Authorization: Bearer <supabase-access-token>` verified per request via
  `requireAuth`; roles (`admin`/`mentor`/`participant`) from signed Supabase
  `app_metadata` via `requireRole`. Reads stay public.
- Unique DB indexes (org names, project slugs, one registration per
  user/email per project) backstop the application-level duplicate checks.
- Restrictive CORS allowlist (`ALLOWED_ORIGINS`), rate limits on reads and
  tighter limits on writes, malformed JSON mapped to 400.
