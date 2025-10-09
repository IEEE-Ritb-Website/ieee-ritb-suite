import { ICONFIG } from "@/types";

const SERVER_PORT = 3000;

export const CONFIG: ICONFIG = {
    database: {
        name: process.env.NODE_ENV === "development" ? "test" : "prod",
    },
    server: {
        port: SERVER_PORT,
        name: "Root " + process.env.NODE_ENV,
    },
};
