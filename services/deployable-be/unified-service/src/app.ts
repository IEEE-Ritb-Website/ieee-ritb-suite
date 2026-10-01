import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import { errorHandler } from "@astranova/backend-common";
import { linkedRouters } from "./linked";

const app = express();

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

for (const link of linkedRouters) {
    app.use(link.mount, link.router);
}

app.get("/health", (_req, res) => {
    res.status(200).json({
        status: "ok",
        services: linkedRouters.map((link) => ({ service: link.service, mount: link.mount })),
    });
});

app.use((_req, res) => {
    res.status(404).json({
        success: false,
        error: { type: "not_found", message: "Route not found" },
    });
});

app.use(errorHandler);

export default app;
