# 📦 astranova-ai (Shared Package)

## 📝 Description
AI Command Line Assistant CLI wrapper around OpenCode.

---

## 🎯 Scope
Provides developer productivity utilities. Runs natural language instructions either inside the Web UI (`--web` or default), inside the Terminal UI (`--tui`), or directly in the current terminal session (`--native`), supporting session persistence (`--fresh`). Resolves binaries project-locally.

---

## 🛠️ Usage & Integration
```typescript
pnpm ai "explain this project"
pnpm ai --tui --fresh "explain this project"
pnpm ai --native --fresh "explain this project"
```
