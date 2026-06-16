---
name: create-frontend-service
description: Create a new frontend application/service (Vite + React + TypeScript + Tailwind CSS v4) in this monorepo project. Use this skill when the user wants to add a new frontend, client app, or web dashboard under the services/frontend directory.
---

## What I do

I execute the custom scaffolding process in the project to initialize a new Vite + React + TypeScript project preconfigured with Tailwind CSS v4 and monorepo workspace configurations.

## How to use me

Run the custom CLI scripting command in the workspace root directory:

```bash
pnpm rs create-fe <projectName>
```

Replace `<projectName>` with the desired folder and package name for the new frontend application.

## Process

1. Run the `pnpm rs create-fe <projectName>` command in the root folder.
2. The command will:
   - Scaffold a fresh Vite + React + TypeScript app in `services/frontend/<projectName>`.
   - Install Tailwind CSS v4 and the `@tailwindcss/vite` plugin.
   - Configure `vite.config.ts`, `index.css`, `App.tsx`, and ESLint configurations.
   - Run `pnpm install` in the root workspace to install all dependencies and wire up workspaces.
3. Once completed, navigate to `services/frontend/<projectName>` to verify the project and start development.
