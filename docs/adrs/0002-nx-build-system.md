# ADR 0002: Nx Build System

## Status

Accepted

## Context

As the monorepo grew to include multiple packages and services, build times increased. We needed a tool to orchestrate builds efficiently — rebuilding only what changed, caching results, and visualising the dependency graph.

## Decision

We chose **Nx** as the build orchestration system.

## Options Considered

### Turborepo
- Good caching and dependency graph support
- Lighter weight than Nx
- Less mature task orchestration and no built-in code generation

### Nx
- Powerful local and remote build caching
- Dependency graph visualisation (`nx graph`)
- Task orchestration with `run-many`, `affected` commands
- Extensible plugin system
- Strong TypeScript support

### Manual scripts (no orchestrator)
- No caching — every build is a full rebuild
- No dependency graph visibility
- No affected-project detection

## Rationale

1. **Incremental builds**: Nx's caching ensures that only changed projects and their dependents are rebuilt, drastically reducing CI/CD times.

2. **Dependency graph**: `nx graph` provides a visual map of how packages and services relate, which is invaluable for onboarding and refactoring.

3. **Task orchestration**: `nx run-many --target=build --all` with parallel execution and topological sorting handles our multi-project builds cleanly.

4. **Local caching**: Nx stores build artifacts in `.nx/cache`, making repeated local builds near-instant.

## Consequences

- All build commands go through Nx (`pnpm build-all` maps to Nx)
- Cache must be invalidated manually if file-watching fails
- Developers should be familiar with basic Nx commands (`nx graph`, `nx run-many`)
