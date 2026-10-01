import dotenv from "dotenv";
import path from "path";

export function loadEnv() {
    if (process.env.NODE_ENV === "production") {
        return;
    }
    const rootEnv = path.resolve(process.cwd(), "../../../.env");
    dotenv.config({ path: rootEnv });
}

export function normalizeMongoEnv() {
    if (!process.env.MONGODB_URI && process.env.MONGODB_URL) {
        process.env.MONGODB_URI = process.env.MONGODB_URL;
    }
}
