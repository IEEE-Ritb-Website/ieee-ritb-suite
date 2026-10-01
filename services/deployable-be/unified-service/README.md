# unified-service

Single deployable backend for the whole suite. It mounts every backend
service's Express router in one process so the stack fits Render's free tier
(one web service).

## Do not edit routes by hand

`src/linked.ts` and `src/linked-modules.d.ts` are generated. Link or re-link a service with:

```sh
pnpm rs link-service <service-name> [--mount /api/example] [--subpath router] [--named redirectRouter] [--no-client] [--client-file urls] [--client-name UrlsClient] [--client-key urls]
```

The command validates `services/backend/<service-name>`, adds the
`workspace:*` dependency here, ensures the service exports its router, and
regenerates `src/linked.ts`, `src/linked-modules.d.ts`,
`client/src/mounts.ts`, and `client/src/index.ts` from
`services.config.json`. It also scaffolds `client/src/<service>.ts` with an
empty client class when missing - add the endpoint methods there by hand.
Commit the regenerated files.

To unlink, remove the entry from `services.config.json` and re-run the
command for any remaining service, or delete the line from `src/linked.ts`.

## Route map

| Service | Mount | Example |
| --- | --- | --- |
| admin-service | `/api/admin` | `POST /api/admin/auth/sign-in` |
| root-service | `/api` | `GET /api/chapters`, `GET /api/users`, `GET /api/cron` |
| form-service | `/api/forms` | `GET /api/forms/events`, `GET /api/forms/ping` |
| common-app-service API | `/api/urls` | `POST /api/urls/shorten-url` |
| common-app-service cron | `/api/urls` | `GET /api/urls/cron` |
| short-link redirect | `/` (no prefix) | `GET /l/:code` |

`GET /l/:code` intentionally keeps the `ritb.in/l/<code>` shape. It is the
named `redirectRouter` export of `common-app-service`, mounted at `/`.
`GET /health` lists every linked service and mount; use it as the Render
health check.

## Clients (`@astranova/unified-client`)

`client/` holds one axios client class per linked service, sharing a single
axios instance. `client/src/mounts.ts` and `client/src/index.ts` are generated
by `pnpm rs link-service`; the `*Client` classes are scaffolded by it and their
endpoint methods are hand-written.

```ts
import { createUnifiedClient, UrlsClient } from "@astranova/unified-client";

const { urls } = createUnifiedClient(import.meta.env.VITE_API_URL ?? "http://localhost:3000");
await urls.createShortUrl({ long_url, ttl_seconds: null });
```

Frontends depend on `@astranova/unified-client` (`workspace:*`) and pick the
base URL from `VITE_API_URL`, falling back to local dev. Set `VITE_API_URL` to
the deployed unified-service URL for production builds.

## Local dev

```sh
docker run -d --name ieee-mongo -p 27017:27017 mongo:7 --replSet rs0
docker exec ieee-mongo mongosh --quiet --eval "rs.initiate()"
MONGODB_URL="mongodb://127.0.0.1:27017/?replicaSet=rs0&directConnection=true" \
  pnpm --filter unified-service start
```

A single-node replica set is required locally because the short-url service
uses transactions (production Atlas already is one).

## CORS

The unified service allows requests from anywhere (default `cors()`). Each
individual service keeps its own stricter CORS setup in its own `app.ts`,
which applies whenever that service runs standalone.

## Environment

Same variables as the root `.env.example`, plus:

- `PORT` - injected by Render, defaults to `3000`.
- `MONGODB_URL` - the single cluster. `MONGODB_URI` falls back to it on boot
  because form-service reads `MONGODB_URI`.

Databases on that cluster stay separate: `test`/`astranova` (admin + root share
it, their collections do not overlap), `url-shortener-prod`/`url-shortener-test`,
`form-service-prod`/`form-service-dev`.

## Run

```sh
pnpm install
pnpm --filter unified-service build
pnpm --filter unified-service start
```
