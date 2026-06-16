import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { isProduction, getMonorepoRoot } from "astranova-core/node";

export function loadEnv() {
    if (isProduction()) {
        return;
    }
    const root = getMonorepoRoot();
    const localEnvPath = path.join(root, ".env.local");
    if (fs.existsSync(localEnvPath)) {
        dotenv.config({ path: localEnvPath });
        return;
    }
    const rootEnv = path.join(root, ".env");
    dotenv.config({ path: rootEnv });
}
