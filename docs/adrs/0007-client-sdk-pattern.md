# ADR 0007: Client SDK Pattern

## Status

Accepted

## Context

Each backend microservice exposes a REST API consumed by one or more frontend applications. Before adopting this pattern, frontends had no standardised way to call backend APIs — developers could use raw `fetch`, install `axios` directly, or write ad-hoc HTTP wrappers. This led to:

- Duplicated request logic (headers, error handling, base URL config) across components
- No typed request/response contracts — frontends manually guessed payload shapes
- Tight coupling to `axios` internals in application code, making future migration harder
- Inconsistent API consumption patterns across different frontend apps

We needed a standardised approach that preserves type safety, minimises boilerplate, and keeps API contracts in sync with the backend that implements them.

## Decision

Each backend microservice that provides an externally-consumed API **must** ship a typed **Client SDK** — a workspace package under its own directory that wraps HTTP calls using `axios` and exposes strongly typed functions.

### Structure

Each client SDK follows this convention:

```
services/backend/<service-name>/
├── client/
│   ├── src/
│   │   ├── index.ts          # Public entry — exports createClient(baseURL) and types
│   │   ├── api.ts            # Axios instance factory
│   │   └── types.ts          # Request/response interfaces
│   ├── package.json          # Scoped as @astranova/<service-name>-client, consumed via workspace:*
│   └── tsconfig.json
```

### Rules

1. **`createClient(baseURL: string)`** — Each SDK exports a factory function that takes the backend's base URL as a parameter. The caller (frontend or another service) provides the URL from its own configuration (env var, hardcoded default, etc.).

2. **No default base URL** — The client SDK itself does not hardcode or guess a base URL. This keeps it environment-agnostic and avoids coupling the client to a specific deployment.

3. **Workspace protocol** — Frontends declare the dependency in `package.json` as `"@astranova/<service-name>-client": "workspace:*"` so they always consume the local version during development.

4. **No raw HTTP in frontends** — Frontend code must never call `fetch`, `axios.create`, or any other HTTP primitive directly. All API communication goes through a client SDK.

5. **Co-location** — The client lives inside the backend service's directory, not in `packages/`. This keeps the API contract close to the backend that implements it, making it easier to update both in a single commit.

### Example

```typescript
// Frontend component
import { createClient } from "@astranova/common-app-client";

const api = createClient(import.meta.env.VITE_API_URL ?? "http://localhost:3000");
const result = await api.createShortUrl({ body: { long_url: url, ttl_seconds: null } });
```

## Options Considered

### Raw `fetch` / `axios` directly in frontends
- No abstraction layer — every component manages its own HTTP logic
- No centralised error handling or request/response interceptors
- No type safety — payloads are manually typed or left as `any`
- Harder to migrate if the HTTP library changes

### Shared HTTP client library (e.g. `@astranova/http`)
- A generic HTTP wrapper doesn't capture service-specific endpoint shapes
- Still requires each frontend to know endpoint paths, method types, and payload structures
- Provides minimal benefit over using `axios` directly

### Auto-generated client from OpenAPI spec
- Ideal in theory (always in sync), but adds a code-generation step to the build pipeline
- Requires maintaining an accurate OpenAPI spec, which adds overhead for small services
- Better suited to larger organisations with dedicated API documentation tooling

## Rationale

1. **Type safety**: Request and response types are defined once in the client SDK and imported by all consumers. A change in the backend payload propagates as a type error at build time.

2. **Co-location**: Keeping the client in the backend service directory means a single PR can update both the endpoint and its typed client. No cross-package coordination needed.

3. **Simplicity**: The factory function pattern (`createClient(baseURL)`) is trivially simple — no DI containers, no singletons, no global state. New contributors understand it immediately.

4. **Framework-agnostic**: Because the client is a plain TypeScript package with no framework dependencies, it can be consumed by React (Vite), Next.js, or even other backend services without changes.

5. **No code generation**: The SDK is hand-written alongside the backend routes. For a project of this scale, code-generation tooling adds unnecessary complexity.

## Consequences

- Each backend service that exposes an API must maintain its own client SDK directory and build pipeline
- The client SDK and backend must be updated in sync — a breaking API change must include a client update in the same commit
- Frontends must always pull the base URL from their own configuration (env var or default), never from the client package
- Build order matters: the client must be built before any frontend that depends on it (`pnpm build-all` handles this automatically via the workspace dependency graph)
