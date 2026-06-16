# astranova-cli

A scaffolding and developer utility CLI tool for the monorepo workspace.

## Scaffolding Commands

Run these commands from the monorepo root:

*   `pnpm rs create-be <service-name>`
    Generates a TypeScript + Express backend microservice in `services/backend/` with preconfigured astralogger, ESLint, paths aliases (`@/*`), and automatic package linking.
*   `pnpm rs create-fe <application-name>`
    Generates a Vite + React + TypeScript + Tailwind CSS v4 frontend application in `services/frontend/` with alias mappings and template configurations.

## Generator Commands

These commands should be executed from within a specific backend service directory:

*   `pnpm "gen client"` (or `astranova-cli generate-client`)
    Uses astranova-ai to analyze the routes and validation schemas in the backend directory and generates a typed client SDK under `src/client/`.
*   `pnpm "gen docs"` (or `astranova-cli generate-docs`)
    Uses astranova-ai to analyze the backend directory and generates OpenAPI/Swagger documentation inside `docs/swagger.json`.
