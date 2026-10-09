# Agent Guide: woc-service

## Purpose
This microservice serves as part of the backend API layer.

## Scope
- Business logic for woc-service features.
- Endpoint validation using Zod.
- Logging via `astralogger`.

## Coding Rules
- Use `getAstraLogger()` from the `astralogger` package for logging. Do not use `console.log`.
- Validate all route payloads using Zod schemas inside `src/schemas/`.
- Keep business logic in controllers, not inline in routing code.
