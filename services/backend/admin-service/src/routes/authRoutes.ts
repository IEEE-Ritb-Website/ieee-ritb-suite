import Controllers from "@/controllers";
import { authenticationMiddleware } from "@/middlewares/authenticationMiddleware";
import { validationMiddleware, withResponseValidation } from "@/middlewares/validationMiddleware";
import { ResponseCreator } from "@/utils/responseCreator";
import { CreateChapterAdminRequestValidator, CreateChapterAdminResponseValidator, ICreateChapterAdminResponse } from "@/validators";
import { Router } from "express";

const authRouter = Router();

authRouter.post('/auth/create-chapter-admin',
    authenticationMiddleware,
    validationMiddleware(CreateChapterAdminRequestValidator),
    withResponseValidation<ICreateChapterAdminResponse, typeof CreateChapterAdminRequestValidator>(
        CreateChapterAdminResponseValidator,
        (validatedData, res) =>
            Controllers.createChapterAdmin(
                validatedData,
                res,
                new ResponseCreator<ICreateChapterAdminResponse>("createChat"),
            ),
    ),
)

export default authRouter;
