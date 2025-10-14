import { loadEnv } from "./utils/loadEnv";
loadEnv();

import app from "./app";
import dotenv from "dotenv";
import { CONFIG } from "./configs";
import { getAstraLogger } from "astralogger";

dotenv.config();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    getAstraLogger().info(`${CONFIG.server.name} server running on http://localhost:${CONFIG.server.port}`);
});