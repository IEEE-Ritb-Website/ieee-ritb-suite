# 📋 Form Service — Agent Handbook (agent.md)

Welcome, Agent! This is the service-specific source of truth for the **Form Service** (`services/backend/form-service`). It details key dependencies, routes, architecture, configurations, and developer patterns.

---

## 🛠️ Service Overview

The **Form Service** provides a backend engine to query registered events and ingest structured form submissions (e.g. registrations, attendee questionnaires, applications). It serves dynamic form schemas, handles structured data verification, and records submission models to a MongoDB backend.

*   **Package Name:** `form-service`
*   **Version:** `1.0.0`
*   **Base URL (Dev):** `http://localhost:3000` (configurable via environmental files)
*   **Database Integration:** MongoDB-backed data capture engines.

---

## 📚 Major Technologies & Documentation Links

Refer to the official documentation below for technical guidelines on major libraries used in this service:

*   **Express.js v5:** [expressjs.com](https://expressjs.com) — Standardized backend framework using async middlewares.
*   **MongoDB Node.js Driver:** [mongodb.com Docs](https://www.mongodb.com/docs/) — Driver used to store forms, models, and registration responses.
*   **Zod Schema Validation:** [zod.dev](https://zod.dev) — Ingesting data through strict Zod validators.

---

## 🌐 API Routing & Form Operations

Routes are structured inside `src/routes/` and split into Health Checks (`ping.ts`), Event Metadata (`eventRoutes.ts`), and Submission Handlers (`formRoutes.ts`).

### 1. Health Diagnostics
*   **`GET /ping`**: Diagnostic health check. Returns service status metrics.

### 2. Public Event Directory (`/events/...`)
*   **`GET /events`**: Returns a list of all active registered public events.
*   **`GET /events/:eventId`**: Fetches specific event descriptors matching the parameters ID.
*   **`GET /events/slug/:slug`**: Fetches specific event details using its unique SEO slug.

### 3. Dynamic Form Schemas & Submission (`/events/...`)
*   **`GET /events/:eventId/form-model`**: Queries the database to return the dynamically structured input layout schema required for event registration.
*   **`GET /events/slug/:slug/form-model`**: Returns the input schema based on the event's SEO slug.
*   **`POST /events/:eventId/submit`**: Handles structured event submissions, executing validation rules and recording participant entries.

---

## 📂 Internal Directory Layout

*   `src/configs/`: Configuration parameters detailing ports, MongoDB environments, and origins.
*   `src/controllers/`: Controllers separating read listing functions from registration validation engines.
*   `src/db/`: MongoDB database connection initialization setup.
*   `src/middlewares/`: Express request filters and `asyncHandler` logic wrapping.
*   `src/routes/`: Route pathways separating health routes, events, and forms.
*   `src/types/`: Internal typings for forms, models, and submission schemas.

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
