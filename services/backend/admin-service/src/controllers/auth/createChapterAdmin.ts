import { CreateChapterAdminRequest, CreateChapterAdminResponse, ICreateChapterAdminResponse } from "@/validators";
import { ControllerClass } from "..";
import { ResponseCreator } from "@/utils/responseCreator";
import { WithResponsePromise } from "@/types";
import { getAstraLogger } from "astralogger";
import { auth, getAuthContext } from "@/lib/auth";

export async function CreateChapterAdminController(
    this: ControllerClass,
    req: CreateChapterAdminRequest,
    res: CreateChapterAdminResponse,
    responseCreator: ResponseCreator<ICreateChapterAdminResponse>,
): WithResponsePromise<ICreateChapterAdminResponse> {
    const ctx = await getAuthContext(req.headers);
    if (!ctx) {
        throw new Error("Should Never Happen: This should have been handled by the middleware");
    }
    if (ctx.user.role !== "admin") {
        return responseCreator.unauthorized("Only admin is allowed to create new users");
    }
    try {
        const createUser = await auth.api.createUser({
            body: {
                email: req.body.email,
                name: req.body.name,
                password: req.body.password,
                role: "user",
                data: {
                    chapter: req.body.chapter,
                },
            },
        });
        if (!createUser.user) {
            throw new Error("Error creating the user");
        }
        return responseCreator.created({ success: true, message: "User created successfully" });
    } catch (error) {
        getAstraLogger().fatal(`Error in CreateChapterAdminController, should never happen: ${error}`);
        return responseCreator.fatal();
    }
}
