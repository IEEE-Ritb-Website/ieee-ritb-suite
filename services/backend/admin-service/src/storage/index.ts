import { mongodbClient } from "@/db";
import { Account, Session, User } from "better-auth";

const db = mongodbClient.getDb();

// better auth created collections
const accountCollection = db.collection<Account>("account");
const sessionCollection = db.collection<Session>("session");
const userCollection = db.collection<User>("user");

export {
    accountCollection,
    sessionCollection,
    userCollection,
}