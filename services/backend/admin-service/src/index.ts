import dotenv from "dotenv";

dotenv.config({ path: "../../../.env.local" });

import app from "./app";
import { getAstraLogger } from "astralogger";

getAstraLogger().debug(process.env.NODE_ENV)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    getAstraLogger().info(`🚀 Server running on http://localhost:${PORT}`);
});
