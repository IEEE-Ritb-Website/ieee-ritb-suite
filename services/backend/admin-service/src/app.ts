import express from "express";
import cors, { CorsOptions } from "cors";
import bodyParser from "body-parser";

import router from "@/routes";
import { auth } from "@/lib/auth";
import { fromNodeHeaders, toNodeHandler } from "better-auth/node";
import { CONFIG } from "./configs";

const app = express();

const corsOptions: CorsOptions = {
    origin: process.env.NODE_ENV === "development" ? "http://localhost:5173" : CONFIG.auth.trustedOrigins,
    credentials: true,
}

app.use(cors(corsOptions));

app.get("/api/me", async (req, res) => {
    const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
    });
    return res.json(session);
});

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

app.use("/api", router);

export default app;