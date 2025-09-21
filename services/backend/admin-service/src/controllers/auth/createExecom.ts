import { CreateChapterExecomRequest, CreateChapterExecomResponse, ICreateChapterExecomResponse } from "@/validators";
import { ControllerClass } from "..";
import { ResponseCreator } from "@/utils/responseCreator";
import { WithResponsePromise } from "@/types";
import { getAstraLogger } from "astralogger";
import { auth, getAuthContext } from "@/lib/auth";

export async function CreateChapterExecomController(
    this: ControllerClass,
    req: CreateChapterExecomRequest,
    res: CreateChapterExecomResponse,
    responseCreator: ResponseCreator<ICreateChapterExecomResponse>,
): WithResponsePromise<ICreateChapterExecomResponse> {
    const ctx = await getAuthContext(req.headers);
    if (!ctx) {
        throw new Error("Should Never Happen: This should have been handled by the middleware");
    }
    if (ctx.user.role !== "orgAdmin") {
        return responseCreator.unauthorized("Only chapter admin is allowed to create new execoms");
    }
    try {
        const createUser = await auth.api.createUser({
            body: {
                email: req.body.email,
                name: req.body.name,
                password: req.body.password,
                role: "member",
            },
        });
        if (!createUser.user) {
            throw new Error("Error creating the user");
        }
        return responseCreator.created({ success: true, message: "Execom user created successfully" });
    } catch (error) {
        getAstraLogger().fatal(`Error in CreateChapterExecomController: ${error}`);
        return responseCreator.fatal();
    }
}
