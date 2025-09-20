import { type Request, type Response, Router } from "express";
import Controllers from "@/controllers/index";

export const sampleRoute = Router();

sampleRoute.get('/sample', (req: Request, res: Response) => void Controllers.sampleController(req, res));