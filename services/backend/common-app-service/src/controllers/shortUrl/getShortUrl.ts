import { WithResponsePromise } from "@/types";
import { ControllerClass } from "..";
import { ResponseCreator } from "@/utils/responseCreator";
import { getAstraLogger } from "astralogger";
import { GetShortUrlRequest, GetShortUrlResponse, IGetShortUrlResponse } from "@/validators";
import { shortUrlCollection } from "@/storage";

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
            return responseCreator.notFound("Url not found");
        }
        return responseCreator.redirect({ success: true, _redirect: doc.long_url });
    } catch (error) {
        getAstraLogger().fatal(`Error in GetShortUrlController: ${error}`);
        return responseCreator.fatal();
    }
}
