import express from "express";
import cors, { CorsOptions } from "cors";
import bodyParser from "body-parser";

import router from "@/routes";
import { auth } from "@/lib/auth";
import { fromNodeHeaders } from "better-auth/node";
import { CONFIG } from "./configs";

const app = express();

const corsOptions: CorsOptions = {
    origin: process.env.NODE_ENV === "development" ? "http://localhost:5173" : CONFIG.auth.trustedOrigins,
    credentials: true,
}

app.use(cors(corsOptions));

// app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

app.use("/api", router);

export default app;