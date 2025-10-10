import Controllers from "@/controllers";
import { validationMiddleware, withResponseValidation } from "@/middlewares/validationMiddleware";
import { ResponseCreator } from "@/utils/responseCreator";
import {
    GetChaptersRequestValidator,
    GetChaptersResponseValidator,
    IGetChaptersResponse
} from "@/validators";
import { getAstraLogger } from "astralogger";
import { Router } from "express";

const chapterRouter = Router();

chapterRouter.get("/chapters",
    validationMiddleware(GetChaptersRequestValidator),
    withResponseValidation<IGetChaptersResponse, typeof GetChaptersRequestValidator>(
        GetChaptersResponseValidator,
        (validatedData, res) => {
            return Controllers.getChapters(
                validatedData,
                res,
                new ResponseCreator<IGetChaptersResponse>("getChapters"),
            )
        }
    )
);

export default chapterRouter;