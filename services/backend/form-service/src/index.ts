import { loadEnv } from "./utils/loadEnv";

loadEnv();

import app from "./app";
import { getAstraLogger } from "astralogger";
import { CONFIG } from "./configs";
import { connectToDatabase } from "./db";

const startServer = async () => {
    try {
        await connectToDatabase();
        getAstraLogger().info("Database connected");

        app.listen(CONFIG.server.port, () => {
            getAstraLogger().info(`${CONFIG.server.name} server running on http://localhost:${CONFIG.server.port}`);
        });
    } catch (error) {
        getAstraLogger().error({ err: error }, "Failed to start server");
        process.exit(1);
    }
};

startServer();