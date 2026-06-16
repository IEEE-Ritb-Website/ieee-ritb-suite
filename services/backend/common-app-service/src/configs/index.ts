import { isProduction } from "astranova-core/node";
import { ICONFIG } from "@/types";

const SERVER_PORT = 3001;

export const CONFIG: ICONFIG = {
    database: {
        name: isProduction() ? "url-shortener-prod" : "url-shortener-test",
    },
    server: {
        port: SERVER_PORT,
        name: "Admin " + (isProduction() ? "production" : "development"),
    },
    url: 'https://ritb.in',
    static: {
        html: {
            notFound: "public/templates/not-found.html",
            linkExpired: "public/templates/not-found.html",
        }
    },
    cronSecret: process.env.CRON_SECRET || "",
};
