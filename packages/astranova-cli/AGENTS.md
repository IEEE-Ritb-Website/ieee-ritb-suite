# 📦 astranova-cli (Shared Package)

## 📝 Description
Developer scaffolding tool and microservice generator.

---

## 🎯 Scope
Exposes template builders to instantly scaffold new microservices in the monorepo:
- Express backends with `pnpm rs create-be`
- Vite + React + Tailwind v4 frontends with `pnpm rs create-fe`
- Next.js + TypeScript + Tailwind v4 frontends with `pnpm rs create-next`

All scaffolded frontends include `@astranova/unified-client` for typed backend access through the single unified-service base URL.

---

## 🛠️ Usage & Integration
```typescript
pnpm rs create-be my-service
pnpm rs create-fe my-vite-app
pnpm rs create-next my-next-app
pnpm rs link-service my-service
```
