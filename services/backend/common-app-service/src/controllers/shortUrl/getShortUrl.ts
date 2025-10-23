import { WithResponsePromise } from "@/types";
import { ControllerClass } from "..";
import { ResponseCreator } from "@/utils/responseCreator";
import { getAstraLogger } from "astralogger";
import { GetShortUrlRequest, GetShortUrlResponse, IGetShortUrlResponse } from "@/validators";
import { shortUrlCollection } from "@/storage";
import { CONFIG } from "@/configs";

export async function GetShortUrlController(
    this: ControllerClass,
    req: GetShortUrlRequest,
    res: GetShortUrlResponse,
    responseCreator: ResponseCreator<IGetShortUrlResponse>,
): WithResponsePromise<IGetShortUrlResponse> {
    try {
        const { code } = req.params;
        const doc = await shortUrlCollection.findOne({
            code,
        });
        if (!doc) {
            return responseCreator.htmlFile({ filePath: CONFIG.static.html.notFound, message: "Url not found" }, 404);
        }
        if (doc.expires_at && doc.expires_at <= new Date()) {
            return responseCreator.htmlFile({ filePath: CONFIG.static.html.linkExpired, message: "Link expired" }, 405);
        }
        return responseCreator.redirect({ success: true, url: doc.long_url, message: "Url found" });
    } catch (error) {
        getAstraLogger().fatal(`Error in GetShortUrlController: ${error}`);
        return responseCreator.fatal();
    }
}
