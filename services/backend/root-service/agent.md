# 🌐 Root Service — Agent Handbook (agent.md)

Welcome, Agent! This is the service-specific source of truth for the **Root Service** (`services/backend/root-service`). It details key dependencies, routes, architecture, configurations, and developer patterns.

---

## 🛠️ Service Overview

The **Root Service** serves as the core public-facing API server for the IEEE RIT-B Suite. It processes public read operations, such as serving the chapter directories and static catalogues validation schemas to the frontends.

*   **Package Name:** `root-service`
*   **Version:** `1.0.0`
*   **Base URL (Dev):** `http://localhost:3000` (can be overridden via system environmental variables)
*   **Database Names:** Uses `test` (development) / `prod` (production) databases in MongoDB.

---

## 📚 Major Technologies & Documentation Links

Refer to the official documentation below for technical guidelines on major libraries used in this service:

*   **Express.js v5:** [expressjs.com](https://expressjs.com) — Powering backend public routes with async middleware support.
*   **MongoDB Node.js Driver:** [mongodb.com Docs](https://www.mongodb.com/docs/) — Driver used to fetch chapter catalogs.
*   **Zod Schema Validation:** [zod.dev](https://zod.dev) — Validating request inputs and formatting output bodies.
*   **AstraLogger:** [astralogger Guide](../../../packages/astralogger/README.md) (or `workspace:*`) — Unified JSON log compiler.
*   **@astranova/catalogues:** [@astranova/catalogues](../../../packages/catalogues/README.md) (or `workspace:*`) — Single source of truth chapter list database registry.

---

## 🔌 Workspace Exports

The Root Service exports types consumed by other parts of the monorepo workspace:

```json
"exports": {
  "types": "./dist/types/index.js"
}
```

---

## 🌐 API Routing & Chapter Directory

Routes are structured inside `src/routes/` under the main chapter mapping file `chapter.ts`.

### 1. Chapter Directory Routes (`/api/...`)
*   **`GET /chapters`**: Fetches the structured list of all registered IEEE chapters (technical and non-technical branches).
    *   *Validation:* `GetChaptersRequestValidator` handles filters -> `GetChaptersResponseValidator` formats output.

---

## 📂 Internal Directory Layout

*   `src/configs/`: Configuration parameters detailing ports and database connection overrides.
*   `src/controllers/`: Endpoint controller logic (interfaces with MongoDB database collection queries).
*   `src/db/`: MongoDB database connection initialization setup.
*   `src/middlewares/`: Request filtering interceptors (`validationMiddleware.ts`).
*   `src/routes/`: Route definitions.
*   `src/types/`: TypeScript structural schemas and definitions.
*   `src/validators/`: Zod object validators designed for query shape validation.

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
