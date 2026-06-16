---
name: create-backend-service
description: Create a new backend Express API package/service in TypeScript in this monorepo project. Use this skill when the user wants to add a backend server, REST API service, Express app, or database handler under the services/backend directory.
---

## What I do

I execute the custom scaffolding process in the project to initialize a new Express API service preconfigured with TypeScript, ESLint, Zod, and Pino logging (astralogger).

## How to use me

Run the custom CLI scripting command in the workspace root directory:

```bash
pnpm rs create-be <projectName>
```

Replace `<projectName>` with the desired folder and package name for the new backend service.

## Process

1. Run the `pnpm rs create-be <projectName>` command in the root folder.
2. The command will:
   - Scaffold a fresh Express + TypeScript app in `services/backend/<projectName>`.
   - Configure ESLint, Zod features, and local `astralogger.json` config.
   - Run `pnpm install` in the root workspace to install all dependencies and wire up workspaces.
3. Once completed, navigate to `services/backend/<projectName>` to verify the project and start development.
