import { MongoClient, Db } from 'mongodb';
import { getAstraLogger } from "astralogger";
import { CONFIG } from "@/configs";

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';

let db: Db | null = null;

export const connectToDatabase = async () => {
    if (db) return db;
    const client = new MongoClient(uri);
    await client.connect();
    db = client.db(CONFIG.database.name);
    getAstraLogger().info('Connected to MongoDB');
    return db;
};

export const getDb = () => {
    if (!db) {
        throw new Error('Database not initialized');
    }
    return db;
};
