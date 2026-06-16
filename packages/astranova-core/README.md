# astranova-core

Core environment and workspace utility functions for the **IEEE RIT-B Suite** monorepo.

## Package Architecture & Entrypoints

To support both Node.js (backend services/CLIs) and browser environments (Vite/Next.js frontends) without bundling failures due to unresolved Node-specific modules (like `fs` or `path`), `astranova-core` is split into two entrypoints:

1. **Browser-Safe Entrypoint (`.` / `dist/index.js`)**:
   - Contains helpers safe to bundle in browsers.
   - Exposes:
     - `isProduction()`: Determines if the current environment is running in production (compatible with both Vite's `import.meta.env` and Node's `process.env`).

2. **Node-Only Entrypoint (`./node` / `dist/node.js`)**:
   - Contains Node-specific utilities.
   - Exposes:
     - `getMonorepoRoot()`: Synchronously traverses directories upward from `process.cwd()` to find the workspace root.
     - `isProduction()`: Re-exported for convenience.

## Traditional Module Resolution Compatibility

For packages using traditional module resolution (`"moduleResolution": "node"`), a nested `node/package.json` file is provided at the root of this package. This redirects import pathways for `astranova-core/node` to `./dist/node.js` and `./dist/node.d.ts` without requiring physical redirect files at the package root.

## Usage

### In Browser/Frontend
```typescript
import { isProduction } from "astranova-core";
```

### In Backend/CLI (Node.js)
```typescript
import { getMonorepoRoot, isProduction } from "astranova-core/node";
```
