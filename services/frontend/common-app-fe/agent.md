# 🧰 Developer Tools Frontend — Agent Handbook (agent.md)

Welcome, Agent! This is the service-specific source of truth for the **Developer Tools Frontend** (`services/frontend/common-app-fe`). It details key dependencies, configurations, UI features, styling paradigms, and developer patterns.

---

## 🛠️ Service Overview

The **Developer Tools Frontend** serves as a modular dashboard for developer utilities (e.g. hash generators, UUID creators, JSON formatters) and the administrator panel for managing URL shortening mappings on `ritb.in`.

*   **Package Name:** `common-app-fe`
*   **Version:** `0.0.0`
*   **Core Stack:** Vite 7 + React 19 + TypeScript
*   **Routing System:** `react-router` (`^7.9.4`)
*   **Path Aliasing:** Mapped directly to `./src/*` via `@/*`.

---

## 📚 Major Technologies & Documentation Links

Refer to the official documentation below for technical guidelines on major libraries used in this application:

*   **React 19:** [react.dev](https://react.dev) — Component rendering and reactivity model.
*   **react-router v7:** [reactrouter.com](https://reactrouter.com) — Standard routing architecture.
*   **shadcn ui & Radix UI Primitives:** [ui.shadcn.com](https://ui.shadcn.com) and [radix-ui.com](https://www.radix-ui.com/primitives) — Accessible unstyled primitives (Dialog, Dropdown Menu, Select, Label, Slot) styled with custom Tailwind themes.
*   **Tailwind CSS v4:** [tailwindcss.com v4 Guide](https://tailwindcss.com/docs/v4-beta) — Fast compile times utility styling framework.
*   **Sonner Toast:** [emilkowal.ski/ui/sonner](https://emilkowal.ski/ui/sonner) — Clean toast notifications engine.
*   **Lucide React Icons:** [lucide.dev](https://lucide.dev) — Reusable premium SVG vectors.
*   **next-themes:** [github.com/pacocoursey/next-themes](https://github.com/pacocoursey/next-themes) — High speed Light/Dark mode state synchronization.
*   **Vaul Drawers:** [vaul.emilkowal.ski](https://vaul.emilkowal.ski/) — Accessible sheet drawers.
*   **@astranova/common-app-client:** [Workspace SDK](../../backend/common-app-service/client/README.md) (or `workspace:*`) — Axios-based API client wrappers.

---

## 🎨 Creative Aesthetics & UI Styling

### 1. shadcn ui Configuration
This app utilizes **shadcn ui** component primitives. Workspace parameters are configured at the service root inside [components.json](file:///d:/ieee-ritb-suite/services/frontend/common-app-fe/components.json).

### 2. Tailwind CSS v4 setup
Custom styles compile using Tailwind v4 configured via `@tailwindcss/vite` in `vite.config.ts`.
Style overrides and Tailwind animations are imported inside `src/index.css` via:
```css
@import "tailwindcss";
@plugin "tailwindcss-animate";
```

---

## 📂 Features & Tools Registry

All active tools are mapped dynamically to router paths under `/src/components/tools/` and `/src/components/apps/`:
*   **`Theme Toggle`**: Global Light / Dark toggling using tailwind variables.
*   **`URL Shortener` (`url-shortener.tsx`)**: Queries `@astranova/common-app-client` to create shortcode maps, copy redirection links, and monitor analytics parameters.
*   **`UUID Tool` (`uuid-tool.tsx`)**: Client-side secure cryptographically generated v4 UUID tools.
*   **`JSON Tool` (`json-tool.tsx`)**: High speed client-side validator and formatter.
*   **`Hash Tool` (`hash-tool.tsx`)**: Secure cryptography converters (SHA-256, MD5, SHA-512).
*   **`Base64 Tool` (`base64-tool.tsx`)**: Text encoder and decoder wrappers.
*   **`Color Tool` (`color-tool.tsx`)**: Premium palette generator and format converter (HEX, HSL, RGB).

---

## 📂 Internal Directory Layout

*   `src/assets/`: Static visual files.
*   `src/components/`: Split into custom utilities `/apps`, `/tools`, and accessible components `/common`.
*   `src/pages/`: Page layout definitions (HomePage, ToolsPage, AdminDashboard).
*   `src/routes/`: Router mappings linking layouts to paths.
*   `src/utils/`: Custom utility classes (e.g. CSS tailwind merges).

---

## 💻 Developer Action Workflows

Run the following commands inside this service directory during development:

```bash
# Start Vite development server with hot reload
pnpm dev

# Lint verify components
pnpm run lint

# Compile the application for production deployment
pnpm run build

# Preview the local production bundle locally
pnpm run preview
```
