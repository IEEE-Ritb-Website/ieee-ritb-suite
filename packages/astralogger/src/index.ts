import fs from "fs";
import path from "path";
import pino, { Logger, LoggerOptions } from "pino";

let cachedLogger: Logger | null = null;

function loadConfig(): LoggerOptions {
    const configPath = path.resolve(process.cwd(), "astralogger.json");
    if (fs.existsSync(configPath)) {
        try {
            const raw = fs.readFileSync(configPath, "utf-8");
            const config = JSON.parse(raw);
            return config;
        } catch (err) {
            console.warn("[AstraLogger] Failed to parse astralogger.json. Falling back to default config.");
            return {};
        }
    }
    console.warn("[AstraLogger] astralogger.json not found. Using default logger settings.");
    return {};
}

export function getAstraLogger(): Logger {
    if (!cachedLogger) {
        const config = loadConfig();
        cachedLogger = pino(config);
    }
    return cachedLogger;
}
