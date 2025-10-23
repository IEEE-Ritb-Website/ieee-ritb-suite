import { CONFIG } from "@/configs";
import { IShortUrl } from "@/schemas";
import { shortUrlCollection } from "@/storage";
import { createHash, randomBytes } from "crypto";
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

    private hashToBase62(hash: Buffer, length = 7): string {
        let num = BigInt("0x" + hash.toString("hex"));
        let result = "";
        for (let i = 0; i < length; i++) {
            result = BASE62_ALPHABET[Number(num % 62n)] + result;
            num /= 62n;
        }
        return result;
    }

    private objectIdToBase62(objectId: ObjectId): string {
        // Add random salt for non-deterministic hashing
        const salt = randomBytes(2).toString("hex"); // 16-bit random
        const hash = createHash("sha1")
            .update(objectId.toHexString() + salt)
            .digest();

        const code = this.hashToBase62(hash, 7); // 7-char short code
        return code;
    }

    getShortUrl(code: string): string {
        return `${CONFIG.url}/l/${code}`;
    }

    async generateUniqueCode(objectId: ObjectId, maxAttempts = 5): Promise<string> {
        for (let i = 0; i < maxAttempts; i++) {
            const code = this.objectIdToBase62(objectId);
            const exists = await this.codeExists(code);
            if (!exists) return code;
        }
        throw new Error("Failed to generate a unique code after multiple attempts");
    }
}
