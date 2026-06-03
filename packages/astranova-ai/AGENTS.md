# 📦 astranova-ai (Shared Package)

## 📝 Description
AI Command Line Assistant CLI wrapper around OpenCode.

---

## 🎯 Scope
Provides developer productivity utilities. Runs natural language instructions either directly inside the current terminal session (`--native`) or triggers them asynchronously inside the Web UI (`--ui` or default), supporting session persistence (`--fresh`). Resolves binaries project-locally.

---

## 🛠️ Usage & Integration
```typescript
pnpm ai "explain this project"
pnpm ai --native --fresh "explain this project"
```
