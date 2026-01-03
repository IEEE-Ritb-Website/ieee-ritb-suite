import app from "./app";
import dotenv from "dotenv";
import { connectToDatabase } from "./db";

dotenv.config();

const PORT = process.env.PORT || 3001;

const startServer = async () => {
    try {
        await connectToDatabase();
        console.log("Database connected");

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error(" Failed to start server:", error);
        process.exit(1);
    }
};

startServer();