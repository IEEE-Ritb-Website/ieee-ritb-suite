# AGENTS.md

Everything below is a design suggestion, not a requirement. If a better approach exists at development time, propose it instead of following this file blindly.

## TypeScript practices

- Strict TS everywhere, no unused locals, no `any` leaks across package boundaries.
- Backend services are CommonJS + `@/*` path alias resolved by `tsc-alias` on build.
- The unified client is ESM (`module`/`moduleResolution` `NodeNext`, `"type": "module"`); all relative imports must carry explicit `.js` suffixes or plain-node usage breaks.
- Validate at the edges with zod: request schemas via `defineRequestSchema`, responses via `defineResponseSchema` discriminated on `success`.
- Controllers never touch `res` directly; return `ResponseCreator` results through `validationMiddleware` + `withResponseValidation`.
- Never use `instanceof` on errors or zod types across packages (each linked service ships its own copies); match on `.name` instead.
- One shared axios instance per `createUnifiedClient(baseURL)`; client classes take it via constructor, mount paths come from generated `mounts.ts`.
- Self-explanatory code; comments only for non-obvious ordering or cross-package gotchas.

## Layout

- `packages/astralogger` - pino logger used by all backends.
- `packages/catalogues` - static chapter data + shared zod schemas.
- `packages/backend-common` - shared backend primitives (`loadEnv`, `normalizeMongoEnv`, name-matched `errorHandler`, `asyncHandler`).
- `packages/astranova-cli` - scaffolding commands (`create-be`, `create-fe`, `link-service` implementation).
- `scripting/` - user-facing script entrypoint; run commands via `pnpm rs <command>`.
- `services/backend/*` - the four standalone REST services (`admin`, `root`, `form`, `common-app`); each keeps its own strict CORS in its `app.ts` and stays independently runnable.
- `services/deployable-be/unified-service` - the single Render deployable; mounts every linked router in one process. `src/linked.ts`, `src/linked-modules.d.ts`, `client/src/mounts.ts`, `client/src/index.ts` are generated, never hand-edit.
- `services/deployable-be/unified-service/client` - `@astranova/unified-client`: one axios class per service (`AdminClient`, `ChaptersClient`, `FormsClient`, `UrlsClient`); stubs are scaffolded by link-service, endpoint methods are hand-written.
- `services/frontend/*` - Vite/Next frontends; backend access only through `@astranova/unified-client` with base URL from `VITE_API_URL` (fallback `http://localhost:3000`).

## Rules of the road

- One Render free-tier service: all backends ship inside `unified-service`; never add a second deployable backend.
- `GET /l/:code` stays unprefixed at `/` so `ritb.in/l/<code>` keeps working; everything else lives under `/api/*` mounts.
- Unified CORS is default permissive (`cors()`); auth is token-based (sign-in returns a token), no cookie flows across origins.
- One Mongo cluster, separate databases (`test` shared by admin + root in dev with non-overlapping collections, `url-shortener-*`, `form-service-*`); `MONGODB_URI` falls back to `MONGODB_URL` on boot because form-service reads `MONGODB_URI`.
- New backend service flow: build it under `services/backend/*` exporting `./router`, then `pnpm rs link-service <service-name>`, fill in the scaffolded client methods, rebuild.
- Local dev needs a single-node replica set (short-url uses transactions): `docker run -d -p 27017:27017 mongo:7 --replSet rs0` + `rs.initiate()`, then boot with `MONGODB_URL="mongodb://127.0.0.1:27017/?replicaSet=rs0&directConnection=true"`.
