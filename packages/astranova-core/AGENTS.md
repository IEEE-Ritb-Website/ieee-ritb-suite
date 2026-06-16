# 🚀 Agent Guide - astranova-core

This package is the single source of truth for core environment checks and monorepo path resolutions. 

---

## 🛠️ Key Architectures

### Browser vs. Node Entrypoint Split
- **Why**: Frontend projects (like Vite/Next.js) will fail to bundle if they import code that statically references Node-only builtins like `fs` or `path`.
- **How**:
  - `src/index.ts` contains browser-safe functions (e.g. `isProduction`).
  - `src/node.ts` contains Node-specific code (e.g. `getMonorepoRoot`).
  - `package.json` specifies `"exports"` mapping `.` to `dist/index.js` and `./node` to `dist/node.js`.

### CommonJS / Traditional Resolution Redirection
- **Problem**: Backend services use `tsconfig.json` with `moduleResolution: "node"`, which ignores package.json `exports`.
- **Solution**: A nested subdirectory `node/` containing a `package.json` file is located at the package root to map imports of `astranova-core/node` to `./dist/node.js` and `./dist/node.d.ts` for legacy CommonJS module resolution.

---

## 🧼 Code Quality & Guidelines

1. **Keep it Dependency-Free**: Avoid adding third-party NPM packages here unless absolutely necessary.
2. **Never import Node modules in `src/index.ts`**: All Node built-in imports must reside strictly in `src/node.ts`.
3. **Keep functions synchronous**: Core utilities like `getMonorepoRoot` and `isProduction` must remain synchronous so they can be consumed inside configuration and environment loader initializers.
