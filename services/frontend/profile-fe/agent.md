# 👤 Profile Frontend — Agent Handbook (agent.md)

Welcome, Agent! This is the service-specific source of truth for the **Profile Frontend** (`services/frontend/profile-fe`). It details key dependencies, configurations, UI features, styling paradigms, and developer patterns.

---

## 🛠️ Service Overview

The **Profile Frontend** is a Next.js Server-Side Rendered (SSR) web application enabling students to manage their login sessions, secure passwords, create custom profiles, and register for IEEE conclave events.

*   **Package Name:** `profile-fe`
*   **Version:** `0.1.0`
*   **Framework:** Next.js (v16.2.4) + React (v19.2.4)
*   **Authentication Integration:** Integrates `better-auth` directly for server-side auth validation.
*   **Styling Engine:** Tailwind CSS v4 configured via `@tailwindcss/postcss`.

---

## 📚 Major Technologies & Documentation Links

Refer to the official documentation below for technical guidelines on major libraries used in this application:

*   **Next.js 16:** [nextjs.org/docs](https://nextjs.org/docs) — App routing architectures, SSR, API routes, and optimization guidelines.
*   **better-auth:** [better-auth.com Guide](https://www.better-auth.com) — Ingesting login sessions, token rotations, and account registrations.
*   **Cloudinary Node SDK:** [cloudinary.com Documentation](https://cloudinary.com/documentation) — Direct client-side photo uploading and profile picture optimizations.
*   **Nodemailer:** [nodemailer.com Guide](https://nodemailer.com) — Simple transactional verification email SMTP setups.
*   **Tailwind CSS v4:** [tailwindcss.com v4 Guide](https://tailwindcss.com/docs/v4-beta) — Next-gen utility-first styling engine compiled using PostCSS.
*   **@astranova/catalogues:** [@astranova/catalogues](../../../packages/catalogues/README.md) (or `workspace:*`) — IEEE Chapters dataset validation.

---

## 🌐 Dynamic Routing & API Architectures

This app leverages Next.js App Router folders under `src/app/` for modular separation:

### 1. Page Routing Layouts
*   **`d:\ieee-ritb-suite\services\frontend\profile-fe\src\app\page.tsx`**: Base index page of the application (includes forms for landing, overview descriptions, and user registration links).
*   **`src/app/[username]/`**: Dynamic user dashboard layout. Fetches profiles and registers user data dynamically using page slug overrides.
*   **`src/app/auth/`**: Core login and signup routes.

### 2. Transactional Scripts
*   **`scripts/onboard-users.ts`**: Standalone administrative utility script developed in TypeScript to securely ingest, parse, and pre-register a batch database list of user credentials.

---

## 🎨 Creative Aesthetics & UI Styling

### 1. Tailwind CSS v4 setup
PostCSS filters are used in Next.js to parse styling rules.
Tailwind imports are managed within [src/app/globals.css](file:///d:/ieee-ritb-suite/services/frontend/profile-fe/src/app/globals.css) using:
```css
@import "tailwindcss";
```

---

## 📂 Internal Directory Layout

*   `scripts/`: Internal onboarding and backup helper scripts.
*   `src/app/`: Core App Router view structures (Auth routes, Profile pages, layout templates).
*   `src/components/`: Modular UI widgets (Form cards, interactive profile buttons, image upload fields).
*   `src/lib/`: Unified database instances (MongoDB connections, better-auth helpers).

---

## 💻 Developer Action Workflows

Run the following commands inside this service directory during development:

```bash
# Start Next.js development server with hot reloading
pnpm dev

# Compile the application for production (runs tsc & next build)
pnpm run build

# Boot the local production compilation
pnpm start

# Run ESLint validators
pnpm run lint
```
