import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = 'ieee-ritb';

let db: Db | null = null;

export const connectToDatabase = async () => {
    if (db) return db;
    const client = new MongoClient(uri);
    await client.connect();
    db = client.db(dbName);
    console.log('Connected to MongoDB');
    return db;
};

export const getDb = () => {
    if (!db) {
        throw new Error('Database not initialized');
    }
    return db;
};
