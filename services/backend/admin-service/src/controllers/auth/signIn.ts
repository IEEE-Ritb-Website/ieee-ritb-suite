import { ISignInResponse, SignInRequest, SignInResponse } from "@/validators";
import { ControllerClass } from "..";
import { ResponseCreator } from "@/utils/responseCreator";
import { WithResponsePromise } from "@/types";
import { getAstraLogger } from "astralogger";
import { auth } from "@/lib/auth";
import { APIError } from "better-auth";

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
            returnHeaders: true,
        });
        for (const [key, value] of session.headers.entries()) {
            if (key.toLowerCase() === "set-cookie") {
                res.append("Set-Cookie", value);
            }
        }
        return responseCreator.ok({
            success: true,
            message: "Successfully signed in",
            redirect: session.response.redirect,
            url: session.response.url,
            token: session.response.token,
            user: { ...session.response.user },
        });
    } catch (error) {
        if (error instanceof APIError) {
            getAstraLogger().error(`APIError in SignInController: ${error.message}`);
            return responseCreator.badRequest(error.message);
        }
        getAstraLogger().fatal(`Error in SignInController: ${error}`);
        return responseCreator.fatal();
    }
}
