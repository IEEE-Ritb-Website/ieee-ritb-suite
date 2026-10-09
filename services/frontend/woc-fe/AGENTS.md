# Agent Guide: woc-fe

## Purpose
Next.js frontend application under the IEEE RIT-B Suite.

## Scope
- SSR pages and client components using the App Router.
- Styled using Tailwind CSS v4.

## Styling & Design Guidelines
- Use Tailwind CSS v4 utility classes. Use `@import "tailwindcss";` in globals.css.
- Ensure all components are written in TypeScript.
- Client components must be explicitly marked with `"use client"`.
- Server Actions must be in separate files marked with `"use server"`.

## Shared Clients
- Import service clients from `shared-clients` (workspace package).
- Connection warnings are forwarded to the dev terminal via `instrumentation-client.ts` + `logToTerminal` Server Action.
- Do NOT create a provider component for this — it is already wired up via `src/instrumentation-client.ts`.
