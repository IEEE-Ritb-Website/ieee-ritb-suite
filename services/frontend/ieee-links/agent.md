# 📋 IEEE Links Frontend — Agent Handbook (agent.md)

Welcome, Agent! This is the service-specific source of truth for the **IEEE Links Frontend** (`services/frontend/ieee-links`). It details key dependencies, configurations, UI features, styling paradigms, and developer patterns.

---

## 🛠️ Service Overview

The **IEEE Links Frontend** is a centralized, mobile-responsive portal hosting active links, event redirects, and chapter showcase routes. Think of it as a premium Linktree replacement customized for IEEE RIT Bangalore Student Branch activities.

*   **Package Name:** `ieee-links`
*   **Version:** `0.0.0`
*   **Core Stack:** Vite 7 + React 19 + TypeScript
*   **Path Aliasing:** Mapped directly to `./src/*` via `@/*`.

---

## 📚 Major Technologies & Documentation Links

Refer to the official documentation below for technical guidelines on major libraries used in this application:

*   **React 19:** [react.dev](https://react.dev) — Core rendering mechanics.
*   **Framer Motion:** [framer.com/motion](https://www.framer.com/motion/) — Powering responsive hover effects, fluid entrance cards, and smooth link selections.
*   **shadcn ui & Radix UI Slot:** [ui.shadcn.com](https://ui.shadcn.com) and [radix-ui.com/primitives](https://www.radix-ui.com/primitives) — Headless components styled with Tailwind class mappings.
*   **Tailwind CSS v4:** [tailwindcss.com v4 Guide](https://tailwindcss.com/docs/v4-beta) — Fast compile times utility styling framework.
*   **Lucide React Icons:** [lucide.dev](https://lucide.dev) — Reusable premium SVG vectors.

---

## 🎨 Creative Aesthetics & UI Styling

### 1. shadcn ui configuration
Component defaults are styled and structured using the **shadcn ui** specifications. Configured at the service root inside [components.json](file:///d:/ieee-ritb-suite/services/frontend/ieee-links/components.json).

### 2. Tailwind CSS v4 setup
Styles compile using the Tailwind v4 plugin configured via `@tailwindcss/vite` in `vite.config.ts`.
Global overrides are declared inside `src/index.css` via:
```css
@import "tailwindcss";
```

### 3. Glassmorphic Animations
Cards feature a high-end dark glassmorphic design styled using custom backdrops and micro-animations loaded from `framer-motion` to improve click engagement rates.

---

## 📂 Internal Directory Layout

*   `src/assets/`: Chapter logos and visual graphics.
*   `src/components/`: Link items, social anchors, and backdrop grids.
*   `src/styles/`: global layout settings.
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

# Compile the application for production deployment
pnpm run build

# Preview the local production bundle locally
pnpm run preview
```
