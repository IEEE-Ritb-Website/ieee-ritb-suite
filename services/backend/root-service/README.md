# root-service

Core backend service exposing public endpoints for the student branch catalog, branch members, and secure scheduler cron tasks.

## Commands

Run these commands from the service directory (or via pnpm filter from root):

```bash
pnpm build
```
Builds the production transpiled JavaScript.

```bash
pnpm start
```
Starts the production server.

```bash
pnpm lint
```
Runs the ESLint code quality checks.

```bash
pnpm gen-client
```
Generates the typed client SDK under src/client/.

```bash
pnpm gen-docs
```
Generates OpenAPI/Swagger documentation inside docs/swagger.json.
