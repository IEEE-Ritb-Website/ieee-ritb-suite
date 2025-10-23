import dotenv from "dotenv";
import path from "path";

export function loadEnv() {
    if (process.env.NODE_ENV === "production") {
        // In production, rely on real env vars (no .env file)
        return;
    }
    const rootEnv = path.resolve(process.cwd(), "../../../.env");
    dotenv.config({ path: rootEnv });
}
