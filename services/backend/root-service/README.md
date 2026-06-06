# 🌐 IEEE RIT Bangalore - Root Service Backend

The `root-service` is a TypeScript Express.js backend microservice within the **IEEE RIT-B Suite** monorepo workspace. It exposes public-facing endpoints for the student branch catalog, active branch member lookup, and secure scheduler cron jobs.

---

## 🛠️ Requirements & Environment Variables

Create a `.env` file (or `.env.local` / `.env.development` / `.env.production`) at the project root or within this service folder. The following keys are required:

| Variable      | Description                                                                         | Default / Example                     |
| :------------ | :---------------------------------------------------------------------------------- | :------------------------------------ |
| `PORT`        | Local server port for the service.                                                  | `3000`                                |
| `MONGODB_URI` | Connection URI for the MongoDB database (stores user & chapter documents).          | `mongodb://localhost:27017/astranova` |
| `CRON_SECRET` | Secure authorization key for validating scheduler requests to the `/cron` endpoint. | _See command below_                   |

### Generating a Cron Secret Key

To generate a secure, cryptographically random 64-character hexadecimal key to use as the `CRON_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Set the output string in your `.env` configuration:

```env
CRON_SECRET=your_generated_64_char_hex_key
```

---

## 🚀 Commands & Workflows

Ensure you are at the monorepo workspace root before running workspace-scoped commands:

### Development & Scoping

- **Launch Dev Server**: Starts the Express server in hot-reload mode.
  ```bash
  pnpm --filter root-service dev
  ```
- **Build Service**: Transpiles TypeScript files into compiled JavaScript in `dist/`.
  ```bash
  pnpm --filter root-service build
  ```
- **Run Linter**: Validates code quality on the source code.
  ```bash
  pnpm --filter root-service lint
  ```
- **Run Formatter**: Formats the source code style using Prettier.
  ```bash
  pnpm prettier --write "services/backend/root-service/src/**/*.ts"
  ```
- **Launch Production**: Executes the compiled output in `dist/index.js`.
  ```bash
  pnpm --filter root-service start
  ```

---

## 📖 API Documentation (OpenAPI / Swagger)

The complete specification of endpoints, parameters, schemas, and responses is maintained in:

- [swagger.json](docs/swagger.json)

### Exposed Endpoints

- `GET /api/chapters`: Retrieves IEEE Technical/Non-Technical Chapter lists.
- `GET /api/users`: Retrieves active Student Branch members, support comma-separated `chapters` query filtering, standard position name matching, and position category boolean flags (`onlySeniorPositions`, `onlyJuniorPositions`, `onlyExecoms`).
- `GET /api/cron`: Secured cron trigger endpoint (requires `x-cron-secret` custom authorization header matching `CRON_SECRET`).
