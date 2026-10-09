import { isProduction } from "astranova-core/node";
import { ICONFIG } from "@/types";

const SERVER_PORT = Number(process.env.PORT) || 3004;

export const CONFIG: ICONFIG = {
    database: {
        name: isProduction() ? "woc-service-prod" : "woc-service-dev",
    },
    server: {
        port: SERVER_PORT,
        name: "woc-service " + (isProduction() ? "production" : "development"),
    },
    cronSecret: process.env.CRON_SECRET || "",
    supabase: {
        url: process.env.SUPABASE_URL || "",
        anonKey: process.env.SUPABASE_ANON_KEY || "",
    },
};
