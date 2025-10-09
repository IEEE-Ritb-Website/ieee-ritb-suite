import { WithResponsePromise } from "@/types";
import { ControllerClass } from "..";
import { GetChaptersRequest, GetChaptersResponse, IGetChaptersResponse } from "@/validators";
import { ResponseCreator } from "@/utils/responseCreator";
import { getAstraLogger } from "astralogger";
import { Chapters as ChaptersCatalogue } from "@astranova/catalogues";

export async function GetChaptersController(
    this: ControllerClass,
    req: GetChaptersRequest,
    res: GetChaptersResponse,
    responseCreator: ResponseCreator<IGetChaptersResponse>
): WithResponsePromise<IGetChaptersResponse> {
    try {
        const { name, acronym, type } = req.query;
        let chapters = Array.from(ChaptersCatalogue);

        if (name) {
            chapters = chapters.filter((chapter) => chapter.name.toLowerCase() === name.toLowerCase());
        }
        if (acronym) {
            chapters = chapters.filter((chapter) => chapter.acronym.toLowerCase() === acronym.toLowerCase());
        }
        if (type) {
            chapters = chapters.filter((chapter) => chapter.type === type);
        }

        // TODO: get logo of the chapters and map it here (use a cdn provider like cloudinary or imgix)

        return responseCreator.ok({ success: true, data: chapters });
    } catch (error) {
        getAstraLogger().fatal(`Should Never Happen: Error at GetChaptersController. Error: ${error}`);
        return responseCreator.fatal("Should never happen");
    }
}
