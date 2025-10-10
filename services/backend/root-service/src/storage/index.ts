import { mongodbClient } from "@/db";

const db = mongodbClient.getDb();

// better auth created collections
// const accountCollection = db.collection<Account>("account");

export {
    // accountCollection,
}