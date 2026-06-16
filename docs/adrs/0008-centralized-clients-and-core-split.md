# ADR 0008: Centralized API Clients and Core Split

## Status

Accepted

## Context

Frontend applications (`common-app-fe`, `landing-fe`, etc.) consume multiple backend services. Before this record, each frontend had to manually import individual client factories (e.g. `createCommonAppServiceAPIClient`), configure their base URLs, determine production vs. local dev environments, and check local backend server status individually. This resulted in:
- Duplicate client configuration boilerplate in frontends.
- Hardcoded URLs scattered across files.
- No warnings to developers in local development if the backend server was not running.

Additionally, utility functions like `isProduction()` (environment detection) and `getMonorepoRoot()` (workspace root resolution) were duplicated across several services (`admin-service`, `root-service`, `common-app-service`, `astranova-cli`, `astranova-ai`), leading to code redundancy and fragile relative path operations (`../../../.env`).

We needed a unified, non-intrusive way to instantiate all API clients, centralize production/local URL configurations, and consolidate core environment/monorepo resolution helpers.

## Decision

We decided to introduce two architectural updates:

1.  **Centralized Clients Package (`shared-clients`)**:
    - Created a lightweight package `services/shared-clients` that instantiates all generated API clients.
    - Exposes instantiated client singletons (`CommonAppServiceClient`, `AdminServiceClient`, `RootServiceClient`).
    - Exposes a central config file `client-config.json` in the monorepo root to hold production/development URLs, which the client generator reads and embeds into the package code automatically.
    - Implements a non-blocking HEAD request health-check in development to warn developers if the local server is down.

2.  **Shared Core Utilities Package (`astranova-core`)**:
    - Created `packages/astranova-core` to export `isProduction()` and `getMonorepoRoot()`.
    - Split the package into two entrypoints:
      - `.` (browser-safe, exporting `isProduction`)
      - `./node` (Node-only, exporting `getMonorepoRoot`, importing `fs`/`path` modules).
    - To support CommonJS backend services using `"moduleResolution": "node"`, we added redirection files `node.js` and `node.d.ts` in the root of the package.

## Options Considered

### Dynamic imports in a single `astranova-core` package
- Consolidating browser and node functions in a single file and using dynamic imports for Node builtins.
- **Why rejected**: Standard bundlers (Vite/Next.js) statically analyze imports and would fail due to unresolved `fs` and `path` modules in browser environments.

### Creating `@astranova/clients` in the `packages` directory
- Placing the instantiated client singletons in `packages/clients`.
- **Why rejected**: The `packages/` folder is reserved for shared library utilities. Placing client singletons there mixes general utilities with application-level API orchestrations. Putting it under `services/shared-clients` keeps it scoped as a frontend service aggregator.

## Consequences

- Frontend services can import instantiated client singletons directly: `import { CommonAppServiceClient } from "shared-clients"`.
- Backend services and CLIs resolve the monorepo root dynamically using `getMonorepoRoot` from `astranova-core/node` instead of relying on fragile relative paths.
- Developers edit backend URLs in a single file `client-config.json` in the monorepo root, which remains unaffected by client regenerations.
