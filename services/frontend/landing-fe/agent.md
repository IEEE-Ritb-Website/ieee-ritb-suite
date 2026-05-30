# 🏠 Landing Frontend — Agent Handbook (agent.md)

Welcome, Agent! This is the service-specific source of truth for the **Landing Frontend** (`services/frontend/landing-fe`). It details key dependencies, configurations, UI features, styling paradigms, and developer patterns.

---

## 🛠️ Service Overview

The **Landing Frontend** represents the premium, highly interactive public landing portal of the IEEE RIT Bangalore Student Branch. It features standard-setting 3D WebGL scenes, smooth scrolling mechanics, and rich micro-animations.

*   **Package Name:** `landing-fe`
*   **Version:** `0.0.0`
*   **Core Stack:** Vite 7 + React 19 + TypeScript
*   **Routing System:** `react-router-dom` (`^7.12.0`)
*   **Path Aliasing:** Supports the `@/` path alias mapped directly to `./src/*`.

---

## 📚 Major Technologies & Documentation Links

Refer to the official documentation below for technical guidelines on major libraries used in this application:

*   **React 19:** [react.dev](https://react.dev) — Core rendering library.
*   **Vite 7:** [vite.dev Guide](https://vite.dev) — Lightning fast local development server with Hot Module Replacement (HMR).
*   **Three.js:** [threejs.org Docs](https://threejs.org/docs/) — Core WebGL 3D graphics rendering engine.
*   **React Three Fiber (R3F):** [docs.pmnd.rs/react-three-fiber](https://docs.pmnd.rs/react-three-fiber) — Declarative React elements wrapper for Three.js canvases.
*   **Framer Motion:** [framer.com/motion](https://www.framer.com/motion/) — Advanced entrance, hover, and scroll-bound micro-animations.
*   **Lenis Smooth Scroll:** [lenis.darkroom.engineering](https://lenis.darkroom.engineering/) — High-performance smooth scrolling controller.
*   **Tailwind CSS v4:** [tailwindcss.com v4 Guide](https://tailwindcss.com/docs/v4-beta) — Styled compiled via `@tailwindcss/vite` bundling plugin.
*   **EmailJS Browser SDK:** [emailjs.com/docs](https://www.emailjs.com/docs/) — Secure contact form submission handler.
*   **@astranova/catalogues:** [@astranova/catalogues](../../../packages/catalogues/README.md) (or `workspace:^`) — Chapter specifications data loader.

---

## 🎨 Creative Aesthetics & UI Styling

### 1. Tailwind CSS v4 Configuration
This app utilizes the modern Tailwind CSS v4 engine configured directly inside `vite.config.ts`:
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
```
Styling rules are initialized inside [src/index.css](file:///d:/ieee-ritb-suite/services/frontend/landing-fe/src/index.css) using `@import "tailwindcss";`.

### 2. Custom Typography Systems
This app bypasses standard browser defaults, importing curated Google Webfonts:
*   `@fontsource/inter` — Clean corporate headers and paragraph contexts.
*   `@fontsource/jetbrains-mono` — Structured code block displays.
*   `@fontsource/space-grotesk` — Ultra-premium futuristic aesthetic headers.

---

## 📂 Internal Directory Layout

*   `src/assets/`: Static image and WebGL asset resources.
*   `src/components/`: Modular interactive UI components (Hero sections, Contact forms, Chapter showcase grids).
*   `src/contexts/`: Shared React contexts (e.g. state contexts).
*   `src/hooks/`: Custom state and scroll handlers.
*   `src/pages/`: Layout views.
*   `src/styles/`: Custom CSS rules.
*   `src/index.css`: Global styling entry point with Tailwind imports.
*   `src/main.tsx`: Application entry point.

---

## 💻 Developer Action Workflows

Run the following commands inside this service directory during development:

```bash
# Start Vite development server with hot reload
pnpm dev

# Lint verify components
pnpm run lint

# Automatically correct simple linting mistakes
pnpm run lint:fix

# Compile the application for production deployment
pnpm run build

# Preview the local production bundle locally
pnpm run preview
```
