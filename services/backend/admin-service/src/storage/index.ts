import { mongodbClient } from "@/db";
import { Account, Session, User } from "better-auth";
import { Member, Organization } from "better-auth/plugins";

const db = mongodbClient.getDb();

// better auth created collections
const accountCollection = db.collection<Account>("account");
const sessionCollection = db.collection<Session>("session");
const userCollection = db.collection<User>("user");
const organizationCollection = db.collection<Organization>("organization");
const memberCollection = db.collection<Member>("member");

export {
    accountCollection,
    sessionCollection,
    userCollection,
    organizationCollection,
    memberCollection,
}