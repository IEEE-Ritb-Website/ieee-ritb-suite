import { WithResponsePromise } from "@/types";
import { ControllerClass } from "..";
import { ResponseCreator } from "@/utils/responseCreator";
import { CreateChapterRequest, CreateChapterResponse, ICreateChapterResponse } from "@/validators";
import { getAstraLogger } from "astralogger";
import { auth, getAuthContext } from "@/lib/auth";
import { organizationCollection } from "@/storage";
import { ObjectId } from "mongodb";

export async function CreateChapterController(
    this: ControllerClass,
    req: CreateChapterRequest,
    res: CreateChapterResponse,
    responseCreator: ResponseCreator<ICreateChapterResponse>,
): WithResponsePromise<ICreateChapterResponse> {
    const ctx = await getAuthContext(req.headers);
    if (!ctx) {
        throw new Error("Should Never Happen: This should have been handled by the middleware");
    }
    if (ctx.user.role !== "rootAdmin") {
        return responseCreator.unauthorized("Only admin is allowed to create new chapters");
    }
    try {
        const chapter = await auth.api.createOrganization({
            body: {
                name: req.body.name,
                slug: req.body.name.toLowerCase().trim().replace(/\s+/g, "-"),
                logo: req.body.logo,
                metadata: {},
                userId: ctx.user.id,
                organizationLevel: "chapter",
                type: req.body.chapterType,
                parentOrganizationId: "68cff36a8fe6216ca5f34e69",   // TODO: fix this hard coded user id (should belong to the student-branch)
                shortDescription: req.body.shortDescription,
                faculty: req.body.faculty,
                facultyImage: req.body.facultyImage,
            }
        })
        return responseCreator.created({ success: true, message: "Successfully created new chapter" });
    } catch (error) {
        getAstraLogger().fatal(`Error in CreateChapterController: ${error}`);
        return responseCreator.fatal();
    }
}
