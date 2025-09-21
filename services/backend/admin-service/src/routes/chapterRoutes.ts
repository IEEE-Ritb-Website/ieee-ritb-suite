import Controllers from "@/controllers";
import { authenticationMiddleware } from "@/middlewares/authenticationMiddleware";
import { validationMiddleware, withResponseValidation } from "@/middlewares/validationMiddleware";
import { ResponseCreator } from "@/utils/responseCreator";
import { CreateChapterRequestValidator, CreateChapterResponseValidator, ICreateChapterResponse } from "@/validators";
import { Router } from "express";

const chapterRouter = Router();

chapterRouter.post("/create-new-chapter",
    authenticationMiddleware,
    validationMiddleware(CreateChapterRequestValidator),
    withResponseValidation<ICreateChapterResponse, typeof CreateChapterRequestValidator>(
        CreateChapterResponseValidator,
        (validatedData, res) =>
            Controllers.createChapter(
                validatedData,
                res,
                new ResponseCreator<ICreateChapterResponse>("createChat"),
            ),
    ),
);

export default chapterRouter;
