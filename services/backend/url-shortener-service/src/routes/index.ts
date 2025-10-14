import Controllers from '@/controllers';
import { validationMiddleware, withResponseValidation } from '@/middlewares/validationMiddleware';
import { ResponseCreator } from '@/utils/responseCreator';
import { CreateShortUrlRequestValidator, CreateShortUrlResponseValidator, ICreateShortUrlResponse } from '@/validators';
import { Router } from 'express';

const router = Router();

router.post("/shorten-url",
    validationMiddleware(CreateShortUrlRequestValidator),
    withResponseValidation<ICreateShortUrlResponse, typeof CreateShortUrlRequestValidator>(
        CreateShortUrlResponseValidator,
        (validatedData, res) =>
            Controllers.shortenUrl(
                validatedData,
                res,
                new ResponseCreator<ICreateShortUrlResponse>("createShortUrl"),
            ),
    ),
);

export default router;
