# 🛠️ Common App Service — Agent Handbook (agent.md)

Welcome, Agent! This is the service-specific source of truth for the **Common App Service** (`services/backend/common-app-service`). It details key dependencies, routes, architecture, configurations, and developer patterns.

---

## 🛠️ Service Overview

The **Common App Service** operates as the multi-utility API server for dev-tools and the `ritb.in` URL shortening system. It maps shortcodes to long destination URLs, monitors access counts, and services utility requests from the common developer dashboard application.

*   **Package Name:** `common-app-service`
*   **Version:** `1.0.0`
*   **Base URL (Dev):** `http://localhost:3000` (can be overridden via environmental parameters)
*   **Database Names:** Uses `url-shortener-test` (development) / `url-shortener-prod` (production) databases in MongoDB.

---

## 📚 Major Technologies & Documentation Links

Refer to the official documentation below for technical guidelines on major libraries used in this service:

*   **Express.js v5:** [expressjs.com](https://expressjs.com) — Powers high-speed async middleware routing and redirection.
*   **MongoDB Node.js Driver:** [mongodb.com Docs](https://www.mongodb.com/docs/) — Driver used to store and manage redirected mappings.
*   **Zod Schema Validation:** [zod.dev](https://zod.dev) — Strictly validating input schemas and parameters.
*   **AstraLogger:** [astralogger Guide](../../../packages/astralogger/README.md) (or `workspace:*`) — Unified JSON log compiler.
*   **Axios Client:** [axios-http.com](https://axios-http.com/) — Used in the internal SDK client generator.

---

## 🔌 Embedded Workspace Client SDK (`@astranova/common-app-client`)

This service embeds an isolated client SDK workspace under `./client` (`@astranova/common-app-client`). Frontends directly import this compiled workspace client package to communicate with endpoints:

```json
"dependencies": {
  "@astranova/common-app-client": "workspace:*"
}
```

---

## 🌐 API Routing & URL Shortener Redirection

Routes are structured inside `src/routes/` and divided into the redirection interceptor (`index.ts`) and administrative creation tools (`shortUrl.routes.ts`).

### 1. Public Link Redirection
*   **`GET /l/:code`**: Core redirection gateway interceptor. Translates dynamic codes into structured target URLs.
    *   *Validation:* `GetShortUrlRequestValidator` verifies format -> `GetShortUrlResponseValidator` structures lookup data.
    *   *Fallback behavior:* If shortcodes are expired or not found, the service loads and serves the static templates configured in `CONFIG.static.html.notFound` (`public/templates/not-found.html`).

### 2. Administrator Creation API (`/api/...`)
*   **`POST /api/shorten-url`**: Generates a new shortcode mapping and records the target URL details.
    *   *Validation:* `CreateShortUrlRequestValidator` -> `CreateShortUrlResponseValidator`.

---

## 📂 Internal Directory Layout

*   `client/`: Isolated pnpm sub-workspace package that compiles the `@astranova/common-app-client` API SDK library.
*   `src/configs/`: Configuration parameters detailing ports, MongoDB connection strings, base short URLs, and HTML templates.
*   `src/controllers/`: Core lookup and controller operations (performing redirection analytics increments).
*   `src/db/`: MongoDB database connection initialization setup.
*   `src/middlewares/`: Express validation interceptors.
*   `src/routes/`: Redirection routing maps and REST API controllers.
*   `src/validators/`: Strict schemas mapped via Zod libraries to shape request/response payloads.

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
