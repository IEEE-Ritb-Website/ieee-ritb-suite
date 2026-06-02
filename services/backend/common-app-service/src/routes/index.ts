import { CONFIG } from '@/configs';
import Controllers from '@/controllers';
import { validationMiddleware, withResponseValidation } from '@/middlewares/validationMiddleware';
import { ResponseCreator } from '@/utils/responseCreator';
import { GetShortUrlRequestValidator, GetShortUrlResponseValidator, IGetShortUrlResponse, CronRequestValidator, CronResponseValidator, ICronResponse } from '@/validators';
import { Router } from 'express';
import shortUrlRouter from './shortUrl.routes';

const router = Router();

// default route for short url redirect
router.get("/l/:code",
    validationMiddleware(GetShortUrlRequestValidator),
    withResponseValidation<IGetShortUrlResponse, typeof GetShortUrlRequestValidator>(
        GetShortUrlResponseValidator,
        (validatedData, res) =>
            Controllers.getShortUrl(
                validatedData,
                res,
                new ResponseCreator<IGetShortUrlResponse>("getShortUrl"),
            ),
    ),
);

// cron job endpoint — secured with x-cron-secret header
router.get("/api/cron",
    (req, res, next) => {
        const secret = req.headers["x-cron-secret"];
        if (!secret || secret !== CONFIG.cronSecret) {
            return res.status(401).json({ success: false, error: { type: "unauthorized", message: "Invalid cron secret" } });
        }
        next();
    },
    validationMiddleware(CronRequestValidator),
    withResponseValidation<ICronResponse, typeof CronRequestValidator>(
        CronResponseValidator,
        (validatedData, res) =>
            Controllers.cronHandler(
                validatedData,
                res,
                new ResponseCreator<ICronResponse>("cron"),
            ),
    ),
);

// all other api routes
router.use("/api", shortUrlRouter);

export default router;
