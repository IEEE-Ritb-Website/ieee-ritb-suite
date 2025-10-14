import { WithResponsePromise } from "@/types";
import { ControllerClass } from ".";
import { ResponseCreator } from "@/utils/responseCreator";
import { getAstraLogger } from "astralogger";
import { CreateShortUrlRequest, CreateShortUrlResponse, ICreateShortUrlResponse } from "@/validators";

export async function ShortenUrlController(
    this: ControllerClass,
    req: CreateShortUrlRequest,
    res: CreateShortUrlResponse,
    responseCreator: ResponseCreator<ICreateShortUrlResponse>,
): WithResponsePromise<ICreateShortUrlResponse> {
    try {
        // TODO: implement the logic for shortening URL
        return responseCreator.created({ success: true, data: { shortUrl: "short.url/abc123" }, message: "Successfully created new short URL" });
    } catch (error) {
        getAstraLogger().fatal(`Error in ShortenUrlController: ${error}`);
        return responseCreator.fatal();
    }
}
