import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import router from "./routes";


const app = express();

app.use(cors({ origin: "*", credentials: true, }));

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

app.use("/api", router);

export default app;