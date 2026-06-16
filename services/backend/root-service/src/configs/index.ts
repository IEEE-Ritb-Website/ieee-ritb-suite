import { isProduction } from "astranova-core/node";
import { ICONFIG } from "@/types";

const SERVER_PORT = 3002;

export const CONFIG: ICONFIG = {
    database: {
        name: isProduction() ? "astranova" : "test",
    },
    server: {
        port: SERVER_PORT,
        name: "Root " + (isProduction() ? "production" : "development"),
    },
    cronSecret: process.env.CRON_SECRET || "",
};
