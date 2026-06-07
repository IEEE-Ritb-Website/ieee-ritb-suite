import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import router from "./routes";
import { errorHandler } from "./middlewares";
import { corsOptions } from "@/utils/cors";

const app = express();

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

app.use("/api", router);

app.use(errorHandler);

export default app;
