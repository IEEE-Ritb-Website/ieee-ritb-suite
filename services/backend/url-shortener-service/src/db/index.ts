import { CONFIG } from "@/configs";
import { getAstraLogger } from "astralogger";
import { MongoClient } from "mongodb";

class MongoDBClient {
    private url: string;
    private dbName: string;
    private client: MongoClient;

    constructor() {
        this.url = process.env.MONGODB_URL!;
        this.dbName = CONFIG.database.name;
        this.client = new MongoClient(this.url);
    }

    async init() {
        getAstraLogger().trace("Connecting to mongodb...");
        try {
            await this.client.connect();
            getAstraLogger().info("Connected to mongodb");
        } catch (error) {
            getAstraLogger().fatal(`dbError: could not connect to mongodb`)
        }
    }

    getDb() {
        return this.client.db(this.dbName);
    }

    getCollection(collectionName: string) {
        return this.getDb().collection(collectionName);
    }

    startSession() {
        return this.client.startSession();
    }

    close() {
        this.client.close();
    }
}

export const mongodbClient = new MongoDBClient;