import { isProduction } from "astranova-core/node";
import { ICONFIG } from "@/types";

const SERVER_PORT = Number(process.env.PORT) || 3003;

export const CONFIG: ICONFIG = {
    database: {
        name: isProduction() ? "form-service-prod" : "form-service-dev",
    },
    server: {
        port: SERVER_PORT,
        name: "Form " + (isProduction() ? "production" : "development"),
    },
};
