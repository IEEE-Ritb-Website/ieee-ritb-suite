import Controllers from "@/controllers";
import { validationMiddleware, withResponseValidation } from "@/middlewares/validationMiddleware";
import { ResponseCreator } from "@/utils/responseCreator";
import { CreateShortUrlRequestValidator, CreateShortUrlResponseValidator, ICreateShortUrlResponse } from "@/validators";
import { Router } from "express";

const shortUrlRouter = Router();

shortUrlRouter.post("/shorten-url",
    validationMiddleware(CreateShortUrlRequestValidator),
    withResponseValidation<ICreateShortUrlResponse, typeof CreateShortUrlRequestValidator>(
        CreateShortUrlResponseValidator,
        (validatedData, res) =>
            Controllers.createShortUrl(
                validatedData,
                res,
                new ResponseCreator<ICreateShortUrlResponse>("createShortUrl"),
            ),
    ),
);

export default shortUrlRouter;
