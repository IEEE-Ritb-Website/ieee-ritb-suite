import { ResponseCreator } from "@/utils/responseCreator";
import { ControllerClass } from "..";
import { WithResponsePromise } from "@/types";
import { getAstraLogger } from "astralogger";
import { auth, getAuthContext } from "@/lib/auth";
import { ChangePasswordRequest, ChangePasswordResponse, IChangePasswordResponse } from "@/validators";
import { userCollection } from "@/storage";
import { fromNodeHeaders } from "better-auth/node";

export async function ChangePasswordController(
    this: ControllerClass,
    req: ChangePasswordRequest,
    res: ChangePasswordResponse,
    responseCreator: ResponseCreator<IChangePasswordResponse>,
): WithResponsePromise<IChangePasswordResponse> {
    const ctx = await getAuthContext(req.headers);
    if (!ctx) {
        throw new Error("Should Never Happen: This should have been handled by the middleware");
    }
    if (ctx.user.role !== "admin") {
        return responseCreator.unauthorized("Only admin is allowed to change password of existing users");
    }
    try {
        const user = await userCollection.findOne({ email: req.body.email });
        if (!user) {
            return responseCreator.notFound("User not found");
        }
        const data = await auth.api.setUserPassword({
            body: {
                userId: user._id,
                newPassword: req.body.newPassword,
            },
            headers: fromNodeHeaders(req.headers),
        });
        if (!data.status) {
            getAstraLogger().error("Some internal conditions for the new password might be failing here which is causing this issue");
            throw new Error("Could not change user password, unhandled error");
        }
        return responseCreator.ok({
            success: true,
            message: "Successfully changed user password",
        });
    } catch (error) {
        getAstraLogger().fatal(`Error in ChangePasswordController: ${error}`);
        return responseCreator.fatal();
    }
}
