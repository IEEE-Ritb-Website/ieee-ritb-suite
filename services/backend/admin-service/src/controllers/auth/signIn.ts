import { ISignInResponse, SignInRequest, SignInResponse } from "@/validators";
import { ControllerClass } from "..";
import { ResponseCreator } from "@/utils/responseCreator";
import { WithResponsePromise } from "@/types";
import { getAstraLogger } from "astralogger";
import { auth } from "@/lib/auth";

export async function SignInController(
    this: ControllerClass,
    req: SignInRequest,
    res: SignInResponse,
    responseCreator: ResponseCreator<ISignInResponse>,
): WithResponsePromise<ISignInResponse> {
    try {
        const session = await auth.api.signInEmail({
            body: {
                email: req.body.email,
                password: req.body.password,
            },
        });
        if (!session.user) {
            return responseCreator.unauthorized("Invalid email or password");
        }
        return responseCreator.ok({
            success: true,
            message: "Successfully signed in",
            redirect: session.redirect,
            token: session.token,
            user: { ...session.user }
        });
    } catch (error) {
        getAstraLogger().fatal(`Error in SignInController, should never happen: ${error}`);
        return responseCreator.fatal();
    }
}
