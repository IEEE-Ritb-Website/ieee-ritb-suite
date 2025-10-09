import { WithResponsePromise } from "@/types";
import { ControllerClass } from ".";
import { ResponseCreator } from "@/utils/responseCreator";
import { ChaptersRequest, ChaptersResponse, IChaptersResponse } from "../validators/index";
import { getAstraLogger } from "astralogger";
import { Chapters as ChaptersCatalogue } from "@astranova/catalogues";
import { IChapter } from "@/schemas/chapterSchema";



export async function ChaptersController(
    this: ControllerClass,
    req: ChaptersRequest,
    res: ChaptersResponse,
    responseCreator: ResponseCreator<IChaptersResponse>
): WithResponsePromise<IChaptersResponse> {
    try {
        const { chapterName, acronym, type } = req.query;
        const hasFilters = chapterName || acronym || type;
        let chapters: IChapter[];

        if (hasFilters) {
            chapters = ChaptersCatalogue.filter((ch) => 
                (!chapterName || ch.name.toLowerCase() === chapterName.toLowerCase()) &&
                (!acronym || ch.acronym === acronym) &&
                (!type || ch.type === type)
            );
        } else {
            getAstraLogger().info("No filters provided, returning all chapters.");
            chapters = Array.from(ChaptersCatalogue);
        }

        if (hasFilters && chapters.length === 0) {
            getAstraLogger().warn(`No chapters found for query.`);
            return responseCreator.notFound('No chapters matching the specified criteria were found.');
        }
        
        return responseCreator.ok({ success: true, data: chapters });

    } catch (error) {
        getAstraLogger().fatal(`Error in ChaptersController: ${error}`);
        return responseCreator.fatal();
    }
}