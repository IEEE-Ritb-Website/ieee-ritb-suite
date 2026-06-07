import express from "express";
import cors, { CorsOptions } from "cors";
import bodyParser from "body-parser";

import router from "@/routes";
import { auth } from "@/lib/auth";
import { fromNodeHeaders } from "better-auth/node";
import { CONFIG } from "./configs";
import { corsOptions } from "@/utils/cors";

const app = express();

app.use(cors(corsOptions));

// app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

app.use("/api", router);

export default app;
