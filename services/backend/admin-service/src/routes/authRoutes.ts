import Controllers from "@/controllers";
import {
    ChangePasswordRequestValidator,
    ChangePasswordResponseValidator,
    CreateChapterAdminRequestValidator,
    CreateChapterAdminResponseValidator,
    CreateChapterExecomRequestValidator,
    CreateChapterExecomResponseValidator,
    IChangePasswordResponse,
    ICreateChapterAdminResponse,
    ICreateChapterExecomResponse,
    ISignInResponse,
    SignInRequestValidator,
    SignInResponseValidator
} from "@/validators";
import { authenticationMiddleware } from "@/middlewares/authenticationMiddleware";
import { validationMiddleware, withResponseValidation } from "@/middlewares/validationMiddleware";
import { ResponseCreator } from "@/utils/responseCreator";
import { Router } from "express";
import { auth } from "@/lib/auth";
import { fromNodeHeaders } from "better-auth/node";

const authRouter = Router();

authRouter.get("/auth/me",
    authenticationMiddleware,
    async (req, res) => {
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers),
        });
        return res.json(session);
    }
);
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
authRouter.post('/auth/create-execom',
    authenticationMiddleware,
    validationMiddleware(CreateChapterExecomRequestValidator),
    withResponseValidation<ICreateChapterExecomResponse, typeof CreateChapterExecomRequestValidator>(
        CreateChapterExecomResponseValidator,
        (validatedData, res) =>
            Controllers.createChapterExecom(
                validatedData,
                res,
                new ResponseCreator<ICreateChapterExecomResponse>("createChat"),
            ),
    ),
)
authRouter.post('/auth/change-password',
    authenticationMiddleware,
    validationMiddleware(ChangePasswordRequestValidator),
    withResponseValidation<IChangePasswordResponse, typeof ChangePasswordRequestValidator>(
        ChangePasswordResponseValidator,
        (validatedData, res) =>
            Controllers.changePassword(
                validatedData,
                res,
                new ResponseCreator<ICreateChapterAdminResponse>("createChat"),
            ),
    )
)

export default authRouter;
