import { CorsOptions } from "cors";

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
        // In local development, permit any localhost origin (e.g. localhost:3000, 3001, 3002)
        if (/^https?:\/\/localhost(:\d+)?$/.test(origin) || /^https?:\/\/127\.0\.0\.1(:\d+)?$/.test(origin)) {
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
