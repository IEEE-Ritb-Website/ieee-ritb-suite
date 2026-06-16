# 📦 astranova-cli (Shared Package)

## 📝 Description
Developer scaffolding tool and microservice generator.

---

## 🎯 Scope
Exposes template builders to instantly scaffold new microservices in the monorepo:
- Express backends with `pnpm rs create-be`
- Vite + React + Tailwind v4 frontends with `pnpm rs create-fe`
- Next.js + TypeScript + Tailwind v4 frontends with `pnpm rs create-next`

All scaffolded frontends include `shared-clients` and the `terminalLoggerPlugin` / `TerminalLoggerProvider` so connection warnings from backend service clients surface in the dev server terminal.

---

## 🛠️ Usage & Integration
```typescript
pnpm rs create-be my-service
pnpm rs create-fe my-vite-app
pnpm rs create-next my-next-app
```
