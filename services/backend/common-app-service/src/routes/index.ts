import Controllers from '@/controllers';
import { validationMiddleware, withResponseValidation } from '@/middlewares/validationMiddleware';
import { ResponseCreator } from '@/utils/responseCreator';
import { GetShortUrlRequestValidator, GetShortUrlResponseValidator, IGetShortUrlResponse } from '@/validators';
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

// all other api routes
router.use("/api", shortUrlRouter);

export default router;
