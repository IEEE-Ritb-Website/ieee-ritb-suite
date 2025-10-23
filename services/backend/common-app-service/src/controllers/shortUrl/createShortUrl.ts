import { WithResponsePromise } from "@/types";
import { ControllerClass } from "..";
import { ResponseCreator } from "@/utils/responseCreator";
import { getAstraLogger } from "astralogger";
import { CreateShortUrlRequest, CreateShortUrlResponse, ICreateShortUrlResponse } from "@/validators";
import { UrlShortener } from "@/utils/urlShortener";
import { shortUrlCollection } from "@/storage";
import { ObjectId } from "mongodb";
import { mongodbClient } from "@/db";

export async function CreateShortUrlController(
    this: ControllerClass,
    req: CreateShortUrlRequest,
    res: CreateShortUrlResponse,
    responseCreator: ResponseCreator<ICreateShortUrlResponse>,
): WithResponsePromise<ICreateShortUrlResponse> {
    const session = mongodbClient.startSession();
    try {
        const { code, long_url, ttl_seconds } = req.body;
        const urlShortener = new UrlShortener();
        const urlId = new ObjectId();
        let shortUrlCode: string;
        const response = await session.withTransaction(async () => {
            if (!code) {
                const urlDoc = await shortUrlCollection.findOne({ long_url }, { session });
                if (urlDoc) {
                    if (!urlDoc.expires_at || urlDoc.expires_at > new Date()) {
                        return responseCreator.ok({
                            success: true,
                            message: "Successfully created short URL",
                            data: {
                                long_url: urlDoc.long_url,
                                short_url: urlShortener.getShortUrl(urlDoc.code),
                                ttl_seconds: urlDoc.ttl_seconds,
                                created_at: urlDoc.created_at,
                                expires_at: urlDoc.expires_at,
                            },
                        })
                    }
                    const deleteRes = await shortUrlCollection.deleteOne({ ...urlDoc }, { session });
                    if (deleteRes.deletedCount === 0) {
                        throw new Error("Could not delete existing expired url");
                    }
                    getAstraLogger().info("Deleted existing expired url");
                }
                shortUrlCode = await urlShortener.generateUniqueCode(urlId);
            } else {
                const codeExists = await urlShortener.codeExists(code);
                if (codeExists) {
                    return responseCreator.badRequest("Code already exists");
                }
                shortUrlCode = code;
            }
            const created_at = new Date();
            const expires_at = ttl_seconds ? new Date(created_at.getTime() + ttl_seconds * 1000) : null;
            const doc = await shortUrlCollection.insertOne({
                _id: urlId,
                code: shortUrlCode,
                long_url,
                ttl_seconds,
                created_at,
                expires_at,
            }, { session });
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
                message: "Successfully created new short URL",
            });
        });
        return response;
    } catch (error) {
        getAstraLogger().fatal(`Error in CreateShortUrlController: ${error}`);
        return responseCreator.fatal();
    } finally {
        await session.endSession();
    }
}
