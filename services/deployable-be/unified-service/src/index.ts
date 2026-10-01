import { loadEnv, normalizeMongoEnv } from "@astranova/backend-common";
loadEnv();
normalizeMongoEnv();

// Imports below must stay after loadEnv: requiring a linked service builds its
// MongoDB client from process.env, and form-service falls back to localhost
// when MONGODB_URI is still unset at import time.
import app from "./app";
import { connectToDatabase } from "form-service/db";
import { getAstraLogger } from "astralogger";

const PORT = Number(process.env.PORT) || 3000;

async function start() {
    try {
        await connectToDatabase();
    } catch (error) {
        getAstraLogger().error(`unified-service: form database unavailable, /api/forms will 500: ${error}`);
    }
    app.listen(PORT, () => {
        getAstraLogger().info(`unified-service running on http://localhost:${PORT}`);
    });
}

start();
