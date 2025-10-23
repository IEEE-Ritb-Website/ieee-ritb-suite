import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import router from "./routes";

const app = express();

app.use(cors({ origin: true, credentials: true, }));

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

app.use("/", router);

export default app;