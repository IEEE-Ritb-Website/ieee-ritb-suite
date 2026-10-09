import { CorsOptions } from "cors";

// Restrictive allowlist (comma-separated origins). Defaults to the local
// frontend dev server. Server-to-server callers and curl send no Origin
// header and are always allowed. Credentials stay disabled — the API uses
// Bearer tokens, not cookies, so no cross-origin credentialed requests
// are needed.
const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? "http://localhost:3000")
    .split(",")
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);

export const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
        if (!origin) {
            callback(null, true);
            return;
        }
        callback(null, allowedOrigins.includes(origin));
    },
    credentials: false,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-cron-secret"],
    maxAge: 600,
};
