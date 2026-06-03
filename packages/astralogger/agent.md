# 📦 astralogger (Shared Package)

## 📝 Description
Pino-based unified logging utility for all backend services.

---

## 🎯 Scope
Provides a configured, environment-aware logger singleton. It reads formatting configs from local `astralogger.json` files and automatically enforces log level restrictions in production environments to maintain security and prevent verbose trace output.

---

## 🛠️ Usage & Integration
```typescript
import { getAstraLogger } from "astralogger";
getAstraLogger().info("Message");
```
