import { type Request, type Response, Router } from "express";
import Controllers from "@/controllers/index";

export const pingRoute = Router();

pingRoute.get('/ping', (req: Request, res: Response) => void Controllers.pingController(req, res));