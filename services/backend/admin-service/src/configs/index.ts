import { isProduction } from "astranova-core/node";
import { ICONFIG } from "@/types";

const SERVER_PORT = 3000;
const FRONTEND_URL = !isProduction() ? "http://localhost:5173" : "https://ieee.ritb.in";
const BACKEND_BASE_URL = !isProduction() ? `http://localhost:${SERVER_PORT}` : "https://ieee.ritb.in";

export const CONFIG: ICONFIG = {
    database: {
        name: !isProduction() ? "test" : "prod",
    },
    server: {
        port: SERVER_PORT,
        name: "Admin " + (isProduction() ? "production" : "development"),
    },
    auth: {
        trustedOrigins: FRONTEND_URL,
        baseUrl: BACKEND_BASE_URL,
    },
};
