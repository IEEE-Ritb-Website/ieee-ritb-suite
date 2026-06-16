# shared-clients

Unified, instantiated API client singletons for frontends.

> [!IMPORTANT]
> This service package is **completely auto-generated**. Do not modify files in this directory manually.

## Regeneration

Whenever you generate or regenerate an API client for any backend service, this package is automatically synchronized and updated:

```bash
# Inside any backend service directory (e.g. services/backend/admin-service)
pnpm run gen-client
```

This updates:
1. Instantiated singletons (`AdminServiceClient`, `CommonAppServiceClient`, etc.).
2. The `CLIENT_CONFIG` containing:
   - Deployed production URLs (statically parsed from root `client-config.json`).
   - Local development URLs (auto-detected from each service's configuration).
