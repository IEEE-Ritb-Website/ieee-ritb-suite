# 📦 @astranova/catalogues (Shared Package)

## 📝 Description
Data model and registry registry for IEEE Chapters in the Bangalore Student Branch.

---

## 🎯 Scope
Acts as the single source of truth (SSOT) defining chapter acronyms, profiles, and accent styles for all 18 branches (12 tech, 6 non-tech). Exports Zod schemas to ensure unified input verification across the monorepo.

---

## 🛠️ Usage & Integration
```typescript
import { Chapters, ChapterNameSchema } from "@astranova/catalogues";
```
