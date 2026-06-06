import dotenv from "dotenv";
import path from "path";
import fs from "fs";

export function loadEnv() {
    if (process.env.NODE_ENV === "production") {
        // In production, rely on real env vars (no .env file)
        return;
    }
    const localEnvPath = path.resolve(process.cwd(), "../../../.env.local");
    if (fs.existsSync(localEnvPath)) {
        dotenv.config({ path: localEnvPath });
        return;
    }
    const rootEnv = path.resolve(process.cwd(), "../../../.env");
    dotenv.config({ path: rootEnv });
}
