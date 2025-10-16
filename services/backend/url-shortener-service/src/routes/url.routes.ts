import { Router } from "express";
import { createShortUrl, redirectByCode } from "../controllers/url.controller";

const r = Router();

r.post("/api/shorten", createShortUrl);
r.get("/:code", redirectByCode);

export default r;


