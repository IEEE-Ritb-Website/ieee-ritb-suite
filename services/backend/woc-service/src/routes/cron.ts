import { type Request, type Response, Router } from "express";
import { CONFIG } from "@/configs";
import { getAstraLogger } from "astralogger";

export const cronRoute = Router();

cronRoute.get('/cron', (req: Request, res: Response) => {
    const secret = req.headers["x-cron-secret"];
    if (!secret || secret !== CONFIG.cronSecret) {
        return res.status(401).json({ success: false, error: { type: "unauthorized", message: "Invalid cron secret" } });
    }

    getAstraLogger().info("Cron job executed successfully");
    return res.status(200).json({
        success: true,
        data: {
            timestamp: new Date().toISOString(),
            message: "Cron job executed successfully",
        },
        message: "Cron job completed",
    });
});
