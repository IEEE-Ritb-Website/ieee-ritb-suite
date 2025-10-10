import { loadEnv } from "./utils/loadEnv";

loadEnv();

import app from "./app";
import { getAstraLogger } from "astralogger";
import { CONFIG } from "./configs";

app.listen(CONFIG.server.port, () => {
    getAstraLogger().info(`${CONFIG.server.name} server running on http://localhost:${CONFIG.server.port}`);
});
