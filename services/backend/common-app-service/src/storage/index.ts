import { mongodbClient } from "@/db"
import { IShortUrl } from "@/schemas";

const db = mongodbClient.getDb();

const shortUrlCollection = db.collection<IShortUrl>("short-url");

export {
    shortUrlCollection,
}
