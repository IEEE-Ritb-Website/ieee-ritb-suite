import { isProduction } from "astranova-core/node";

const SERVER_PORT = Number(process.env.PORT) || 3004;

export const CONFIG = {
    database: {
        name: isProduction() ? "prod" : "test",
    },
    server: {
        port: SERVER_PORT,
        name: "woc-service " + (isProduction() ? "production" : "development"),
    },
    cronSecret: process.env.CRON_SECRET || "",
};
