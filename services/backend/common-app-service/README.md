# common-app-service

Backend service for developer tools and the URL shortener.

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
