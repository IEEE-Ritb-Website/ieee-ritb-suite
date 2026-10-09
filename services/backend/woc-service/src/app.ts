import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import router from "./routes";
import { errorHandler } from "./middlewares";
import { apiLimiter } from "./middlewares/rateLimit";
import { corsOptions } from "@/utils/cors";

const app = express();

// Single trusted proxy hop (hosting provider) so rate limiting and
// req.ip see the real client address. Harmless for local development.
app.set("trust proxy", 1);

app.use(cors(corsOptions));
app.use(apiLimiter);

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
    extended: true,
    })
);

app.use("/api", router);

app.use(errorHandler);

export default app;
