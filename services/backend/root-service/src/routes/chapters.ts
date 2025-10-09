import Controllers from "@/controllers";
import { validationMiddleware, withResponseValidation } from "@/middlewares/validationMiddleware";
import { ResponseCreator } from "@/utils/responseCreator";
import { 
    ChaptersRequestValidator, 
    ChaptersResponseValidator, 
    IChaptersResponse 
} from "@/validators";
import { getAstraLogger } from "astralogger";
import { Router } from "express";

const chapterRouter = Router();

chapterRouter.get("/chapters",
    validationMiddleware(ChaptersRequestValidator),
    withResponseValidation<IChaptersResponse, typeof ChaptersRequestValidator>(
        ChaptersResponseValidator,
        (validatedData, res) => {
            getAstraLogger().info("Hit the unified /chapters route");
            return Controllers.chaptersController(
                validatedData,
                res,
                new ResponseCreator<IChaptersResponse>("chaptersController"),
            )
        }
    )
);

export default chapterRouter;