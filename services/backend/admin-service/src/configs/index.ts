import { ICONFIG } from "@/types";

const SERVER_PORT = 3000;
const FRONTEND_URL = process.env.NODE_ENV === "development" ? "http://localhost:5173" : "https://ieee.ritb.in";
const BACKEND_BASE_URL = process.env.NODE_ENV === "development" ? `http://localhost:${SERVER_PORT}` : "https://ieee.ritb.in";

export const CONFIG: ICONFIG = {
    database: {
        name: process.env.NODE_ENV === "development" ? "test" : "prod",
    },
    server: {
        port: SERVER_PORT,
        name: "Admin " + process.env.NODE_ENV,
    },
    auth: {
        trustedOrigins: FRONTEND_URL,
        baseUrl: BACKEND_BASE_URL,
    },
};
