import { CONFIG } from "@/configs";
import { IShortUrl } from "@/schemas";
import { shortUrlCollection } from "@/storage";
import { getAstraLogger } from "astralogger";
import { Collection, ObjectId } from "mongodb";

export const BASE62_ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

export class UrlShortener {
    private collection: Collection<IShortUrl>;

    constructor() {
        this.collection = shortUrlCollection;
    }

    async codeExists(code: string): Promise<boolean> {
        const record = await this.collection.findOne({ code });
        return !!record;
    }

    objectIdToBase62(objectId: ObjectId): string {
        const hex = objectId.toHexString();
        getAstraLogger().debug(`hex: ${hex}`);
        let num = BigInt("0x" + hex);
        getAstraLogger().debug(`num: ${num}`);
        let base62 = "";
        while (num > 0n) {
            const remainder = Number(num % 62n);
            base62 = BASE62_ALPHABET[remainder] + base62;
            num = num / 62n;
        }
        return base62;
    }

    getShortUrl(code: string): string {
        return CONFIG.url + '/l/' + code;
    }
}
