import Controllers from "@/controllers";
import {
    CreateChapterAdminRequestValidator,
    CreateChapterAdminResponseValidator,
    ICreateChapterAdminResponse,
    ISignInResponse,
    SignInRequestValidator,
    SignInResponseValidator
} from "@/validators";
import { authenticationMiddleware } from "@/middlewares/authenticationMiddleware";
import { validationMiddleware, withResponseValidation } from "@/middlewares/validationMiddleware";
import { ResponseCreator } from "@/utils/responseCreator";
import { Router } from "express";

const authRouter = Router();

authRouter.post('/auth/sign-in',
    validationMiddleware(SignInRequestValidator),
    withResponseValidation<ISignInResponse, typeof SignInRequestValidator>(
        SignInResponseValidator,
        (validatedData, res) =>
            Controllers.signIn(
                validatedData,
                res,
                new ResponseCreator<ISignInResponse>("createChat"),
            ),
    ),
)
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
