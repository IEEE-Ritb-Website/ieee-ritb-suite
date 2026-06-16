# Architecture Decision Records (ADRs)

This directory contains Architecture Decision Records documenting significant technical choices made in the IEEE RIT-B Suite project.

Each ADR describes a decision, its context, the options considered, and the rationale for the chosen approach.

## Index

| ADR | Title | Description |
|-----|-------|-------------|
| [0001](./0001-pnpm-package-manager.md) | pnpm as Package Manager | Why pnpm was chosen over npm and Yarn |
| [0002](./0002-nx-build-system.md) | Nx Build System | Why Nx was chosen for monorepo orchestration |
| [0003](./0003-monorepo-architecture.md) | Monorepo Architecture | Why a monorepo structure was adopted |
| [0004](./0004-react-hook-form-with-zod.md) | React Hook Form with Zod | Why react-hook-form and Zod are used for form validation |
| [0005](./0005-cron-jobs.md) | Cron Jobs for Backend Services | Why cron jobs are used (Render free tier constraints) |
| [0006](./0006-ci-cd-deployment.md) | CI/CD and Deployment Strategy | Deployment targets and pipeline choices |
| [0007](./0007-client-sdk-pattern.md) | Client SDK Pattern | Typed API client packages co-located with backend services |
