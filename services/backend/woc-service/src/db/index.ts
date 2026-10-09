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

// Uniqueness is enforced by the database itself so concurrent requests
// cannot slip past the application-level duplicate checks in controllers.
// Runs at boot; fails fast on conflicting pre-existing data.
export const ensureIndexes = async () => {
    const database = getDb();
    await database.collection("organizations").createIndex({ name: 1 }, { unique: true });
    await database.collection("projects").createIndex({ slug: 1 }, { unique: true });
    await database.collection("registrations").createIndex(
        { projectId: 1, "participant.email": 1 },
        { unique: true },
    );
    await database.collection("registrations").createIndex(
        { projectId: 1, userId: 1 },
        { unique: true },
    );
    getAstraLogger().info('Database indexes ensured');
};
