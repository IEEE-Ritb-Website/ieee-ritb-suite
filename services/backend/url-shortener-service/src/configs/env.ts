import * as dotenv from "dotenv";
import path from "path";

// Load root-level .env (project root)
dotenv.config({ path: path.resolve(process.cwd(), "../../../.env") });

export const env = {
    PORT: Number(process.env.PORT || 8080),
    BASE_URL: process.env.BASE_URL || `http://localhost:8080`,
    MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017",
    DB_NAME: process.env.DB_NAME || "ieee_url_shortener",
};


