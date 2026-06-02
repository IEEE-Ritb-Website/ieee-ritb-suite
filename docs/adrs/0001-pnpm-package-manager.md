# ADR 0001: pnpm as Package Manager

## Status

Accepted

## Context

The IEEE RIT-B Suite is a multi-service, multi-package monorepo containing shared libraries, backend microservices, and frontend applications. We needed a package manager that could handle workspace-linked dependencies efficiently while minimising disk usage and install times.

## Decision

We chose **pnpm** as the package manager for this project.

## Options Considered

### npm Workspaces
- Native to Node.js, zero extra tooling
- Uses flat `node_modules`, leading to dependency bloat and potential version conflicts
- Slower install times compared to pnpm

### Yarn Workspaces
- Good workspace support and plugin system
- Uses flat `node_modules` by default (Yarn v1) or PnP (Yarn Berry)
- Yarn Berry's PnP mode introduces compatibility issues with many tools

### pnpm
- Uses a content-addressable store with hard links, saving significant disk space
- Strict `node_modules` structure prevents phantom dependencies and enforces correct `package.json` declarations
- Built-in workspace protocol (`workspace:*`) for monorepo dependency linking
- Fast install speeds due to caching and parallel downloads

## Rationale

1. **Disk efficiency**: With 4+ backend services and 4+ frontend apps sharing many dependencies (TypeScript, Zod, React, etc.), pnpm's content-addressable store avoids duplicating the same package versions across the entire monorepo.

2. **Strict dependency resolution**: pnpm's nested `node_modules` prevents implicit access to undeclared dependencies, catching missing `package.json` entries at development time rather than in production.

3. **Workspace protocol**: The `workspace:*` protocol cleanly links shared packages (`@astranova/catalogues`, `astralogger`) without manual npm publishing or version bumping.

4. **Speed**: pnpm's caching and parallel installation outperforms both npm and Yarn in monorepo scenarios.

## Consequences

- All developers must use pnpm (not npm or Yarn) for package management
- CI/CD pipelines must include pnpm setup steps
- Some tools that expect flat `node_modules` may require additional configuration

## Account Setup Note

All platform accounts (pnpm registry, npm registry, Vercel, Netlify, Cloudflare, Render, cron-job.org, and related services) are configured using the official IEEE RIT Bangalore email address. Team members should log in using the credentials received at the start of their term, or via Google / GitHub OAuth where available, to access these platforms.
