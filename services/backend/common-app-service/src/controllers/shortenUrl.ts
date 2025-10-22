import { WithResponsePromise } from "@/types";
import { ControllerClass } from ".";
import { ResponseCreator } from "@/utils/responseCreator";
import { getAstraLogger } from "astralogger";
import { CreateShortUrlRequest, CreateShortUrlResponse, ICreateShortUrlResponse } from "@/validators";
import { UrlShortener } from "@/utils/urlShortener";
import { shortUrlCollection } from "@/storage";
import { ObjectId } from "mongodb";

export async function ShortenUrlController(
    this: ControllerClass,
    req: CreateShortUrlRequest,
    res: CreateShortUrlResponse,
    responseCreator: ResponseCreator<ICreateShortUrlResponse>,
): WithResponsePromise<ICreateShortUrlResponse> {
    try {
        const { code, long_url, ttl_seconds } = req.body;
        const urlId = new ObjectId();
        let shortUrlCode: string;
        const urlShortener = new UrlShortener();
        if (!code) {
            shortUrlCode = urlShortener.objectIdToBase62(urlId);
        } else {
            const codeExists = await urlShortener.codeExists(code);
            if (codeExists) {
                return responseCreator.badRequest("Code already exists");
            }
            shortUrlCode = code;
        }
        const created_at = new Date();
        const expires_at = ttl_seconds ? new Date(created_at.getTime() + ttl_seconds * 1000) : undefined;
        const doc = await shortUrlCollection.insertOne({
            _id: urlId,
            code: shortUrlCode,
            long_url,
            ttl_seconds,
            created_at,
            expires_at,
        })
        if (!doc.acknowledged) {
            throw new Error("Could not add the short url to the database");
        }
        return responseCreator.created({
            success: true,
            data: {
                ttl_seconds,
                long_url,
                short_url: urlShortener.getShortUrl(shortUrlCode),
                created_at,
                expires_at,
            },
            message: "Successfully created new short URL"
        });
    } catch (error) {
        getAstraLogger().fatal(`Error in ShortenUrlController: ${error}`);
        return responseCreator.fatal();
    }
}
