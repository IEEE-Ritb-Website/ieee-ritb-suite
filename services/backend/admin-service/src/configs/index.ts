import { ICONFIG } from "@/types";

export const FRONTEND_URL = process.env.NODE_ENV === "development" ? "http://localhost:5173" : "https://ieee.ritb.in";

export const CONFIG: ICONFIG = {
    auth: {
        trustedOrigins: FRONTEND_URL,
    },
};
