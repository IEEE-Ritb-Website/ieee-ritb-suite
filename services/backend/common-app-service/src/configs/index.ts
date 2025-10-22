import { ICONFIG } from "@/types";

const SERVER_PORT = 3000;

export const CONFIG: ICONFIG = {
    database: {
        name: process.env.NODE_ENV === "development" ? "url-shortener-test" : "url-shortener-prod",
    },
    server: {
        port: SERVER_PORT,
        name: "Admin " + process.env.NODE_ENV,
    },
    url: 'https://ritb.in',
};
