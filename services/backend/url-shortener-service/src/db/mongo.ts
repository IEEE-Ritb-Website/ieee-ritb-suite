import { MongoClient, Db, Collection } from "mongodb";
import { env } from "../configs/env";

let client: MongoClient | null = null;

export async function getDb(): Promise<Db> {
    if (!client) {
        client = new MongoClient(env.MONGO_URI, { ignoreUndefined: true });
        await client.connect();
    }
    return client.db(env.DB_NAME);
}

export interface UrlDoc {
    _id?: unknown;
    code: string;
    long_url: string;
    created_at: Date;
    expires_at: Date | null;
}

export interface CounterDoc {
    _id: string;
    seq: number;
}

export async function getCollections(): Promise<{
    urls: Collection<UrlDoc>;
    counters: Collection<CounterDoc>;
}> {
    const db = await getDb();
    const urls = db.collection<UrlDoc>("urls");
    const counters = db.collection<CounterDoc>("counters");

    await urls.createIndex({ code: 1 }, { unique: true });
    await urls.createIndex(
        { expires_at: 1 },
        {
            expireAfterSeconds: 0,
            partialFilterExpression: { expires_at: { $type: "date" } },
        }
    );

    return { urls, counters };
}

export async function nextSeq(name = "url_code"): Promise<number> {
    const { counters } = await getCollections();
    const doc = await counters.findOneAndUpdate(
        { _id: name },
        { $inc: { seq: 1 } },
        { upsert: true, returnDocument: "after" }
    );
    return doc.value?.seq ?? 1;
}


