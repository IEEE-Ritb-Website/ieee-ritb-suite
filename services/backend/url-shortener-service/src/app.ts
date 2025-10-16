import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import urlRoutes from "./routes/url.routes";

const app = express();

app.use(helmet());
app.use(express.json());
app.use(morgan("tiny"));

app.use(urlRoutes);

app.get("/health", (_req, res) => res.json({ ok: true }));

export default app;