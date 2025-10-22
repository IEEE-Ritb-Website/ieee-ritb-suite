import { ICONFIG } from "@/types";

const SERVER_PORT = 3000;

export function isProduction(): boolean {
    return process.env.NODE_ENV === "production";
}

export const CONFIG: ICONFIG = {
    database: {
        name: isProduction() ? "url-shortener-prod" : "url-shortener-test",
    },
    server: {
        port: SERVER_PORT,
        name: "Admin " + process.env.NODE_ENV,
    },
    url: 'https://ritb.in',
};
