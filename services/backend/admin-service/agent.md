# 🔐 Admin Service — Agent Handbook (agent.md)

Welcome, Agent! This is the service-specific source of truth for the **Admin Service** (`services/backend/admin-service`). It details key dependencies, routes, architecture, configurations, and developer patterns.

---

## 🛠️ Service Overview

The **Admin Service** handles security, identity management, user permissions, and admin operations for the IEEE RIT-B Suite. It integrates `better-auth` for user sessions and exports authentication clients and type schemas to other applications in the monorepo workspace.

*   **Package Name:** `admin-service`
*   **Version:** `1.0.0`
*   **Base URL (Dev):** `http://localhost:3000`
*   **Base URL (Prod):** `https://ieee.ritb.in`
*   **Database Names:** Uses `test` (development) / `prod` (production) databases in MongoDB.

---

## 📚 Major Technologies & Documentation Links

Refer to the official documentation below for technical guidelines on major libraries used in this service:

*   **better-auth:** [better-auth.com](https://www.better-auth.com) — Handles multi-session, server validation, and credential configuration.
*   **Express.js v5:** [expressjs.com](https://expressjs.com) — Powering backend endpoints with async middleware routing.
*   **MongoDB Node.js Driver:** [mongodb.com Docs](https://www.mongodb.com/docs/) — Driver used to store users, sessions, and chapters.
*   **Cloudinary Node SDK:** [cloudinary.com Documentation](https://cloudinary.com/documentation) — Upload and management engine for user media assets.
*   **Zod Schema Validation:** [zod.dev](https://zod.dev) — Validating request inputs and structural formats.
*   **AstraLogger:** [astralogger Guide](../../../packages/astralogger/README.md) (or `workspace:*`) — Unified JSON log compiler.

---

## 🔌 Workspace Exports

The Admin Service exports compiled modules that are consumed by frontend workspaces (`workspace:*`). They are exposed via `package.json` entry exports:

```json
"exports": {
  "auth-client": "./dist/client/authClient/index.js",
  "validators": "./dist/validators/index.js",
  "types": "./dist/types/index.js"
}
```

---

## 🌐 API Routing & Middleware Guard System

Routes are structured inside `src/routes/` and split logically into Authentication (`authRoutes.ts`) and Chapter Management (`chapterRoutes.ts`).

### Route Guarding Pattern
Interactive operations are protected by the custom `authenticationMiddleware` to verify active better-auth sessions:
```typescript
import { authenticationMiddleware } from "@/middlewares/authenticationMiddleware";
import { validationMiddleware } from "@/middlewares/validationMiddleware";
```

### 1. Authentication Routes (`/api/...`)
*   **`GET /auth/me`**: Returns the active authenticated user profile.
    *   *Middlewares:* `authenticationMiddleware`
*   **`POST /auth/sign-in`**: Processes credential signing request.
    *   *Validation:* validated by `SignInRequestValidator` and mapped by `SignInResponseValidator`
*   **`POST /auth/create-chapter-admin`**: Scaffolds a new user admin account assigned to a chapter.
    *   *Middlewares:* `authenticationMiddleware`
    *   *Validation:* `CreateChapterAdminRequestValidator` -> `CreateChapterAdminResponseValidator`
*   **`POST /auth/create-execom`**: Adds a new ExeCom (Executive Committee) record.
    *   *Middlewares:* `authenticationMiddleware`
    *   *Validation:* `CreateChapterExecomRequestValidator` -> `CreateChapterExecomResponseValidator`
*   **`POST /auth/change-password`**: Updates active password credentials.
    *   *Middlewares:* `authenticationMiddleware`
    *   *Validation:* `ChangePasswordRequestValidator` -> `ChangePasswordResponseValidator`

### 2. Chapter Operations Routes (`/api/...`)
*   **`POST /create-new-chapter`**: Registers a new chapter profile in database.
    *   *Middlewares:* `authenticationMiddleware`
    *   *Validation:* `CreateChapterRequestValidator` -> `CreateChapterResponseValidator`

---

## 📂 Internal Directory Layout

*   `src/configs/`: Server configs (ports, environments, trusted origins).
*   `src/controllers/`: Endpoint handlers. Performs database reads/writes and structures replies.
*   `src/db/`: Database configuration and client instances.
*   `src/lib/auth.ts`: Configuration of `better-auth` options and handlers.
*   `src/middlewares/`: Express interceptors (`authenticationMiddleware.ts`, `validationMiddleware.ts`).
*   `src/storage/`: Cloudinary storage wrappers for image/file uploading.
*   `src/validators/`: Strict schemas mapped via Zod libraries to shape API request/response payloads.

---

## 💻 Developer Action Workflows

Run the following commands inside this service directory during development:

```bash
# Run ESLint validation
pnpm run lint

# Compile and compile-alias source directories
pnpm run build

# Start the compiled service
pnpm start
```
