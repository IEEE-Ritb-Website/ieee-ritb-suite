# ADR 0003: Monorepo Architecture

## Status

Accepted

## Context

The IEEE RIT-B project consists of shared libraries (`astralogger`, `@astranova/catalogues`), multiple backend microservices (admin, forms, URL shortener, common-app), and multiple frontend applications (landing, profiles, tools, links). We needed to decide how to organise these related but independent components.

## Decision

We adopted a **monorepo architecture** using pnpm workspaces.

## Options Considered

### Multi-repo (separate repositories per service)
- Each service isolated with its own versioning and CI/CD
- Significant overhead in managing cross-repo changes
- Duplicated tooling, configs, and CI pipelines
- Harder to enforce consistent code standards

### Monorepo (single repository)
- Single source of truth for all code
- Shared tooling, linting, and TypeScript configs
- Atomic cross-service changes in a single commit
- Simplified dependency management via workspace protocol
- Easier onboarding — clone one repo, install once

## Rationale

1. **Shared packages**: `astralogger` and `@astranova/catalogues` are consumed by multiple services. A monorepo lets us develop and version them alongside their consumers without publishing to a registry.

2. **Atomic changes**: A bug fix in a shared package that requires updates in consuming services can be committed as a single changeset, keeping the codebase consistent at every commit.

3. **Single CI/CD pipeline**: One CI configuration handles linting, type-checking, and building across the entire project. Nx's affected-detection ensures only changed projects are rebuilt.

4. **Consistency**: Shared ESLint configs, TypeScript settings, and coding conventions are enforced uniformly across all packages and services.

## Consequences

- Repository size is larger (though pnpm's store keeps `node_modules` efficient)
- CI must be configured to handle workspace-level orchestration
- Git history is shared across all projects — developers must be mindful of scope in commit messages
