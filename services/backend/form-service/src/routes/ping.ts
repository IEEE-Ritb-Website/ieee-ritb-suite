import { Router, Request, Response } from "express";

export const pingRoute = Router();

pingRoute.get("/ping", (req: Request, res: Response) => {
    res.status(200).json({ message: "pong", timestamp: new Date().toISOString() });
});