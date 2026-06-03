# 📦 common-app-service (Backend Microservice)

## 📝 Description
Backend platform supporting developer tools and the `ritb.in` URL shortener.

---

## 🎯 Scope
Maintains link redirects, shortcode allocations, dev-tools settings, and hosts a secured cron endpoint (`GET /api/cron`) triggered by external schedule tasks.

---

## 🛠️ Usage & Integration
```typescript
Runs on Express.js v5. Exports `@astranova/common-app-client` axios SDK.
```
