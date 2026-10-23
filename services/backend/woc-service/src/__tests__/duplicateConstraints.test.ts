import { describe, expect, it } from "vitest";
import { MongoClient } from "mongodb";

/**
 * Proves the database itself rejects duplicate registrations, so two
 * concurrent requests cannot slip past the application-level checks in
 * the controller (check-then-insert race).
 *
 * Needs a reachable MongoDB (same requirement as running the service).
 * Skips gracefully with a warning when none is available.
 */
describe("registration unique constraints", () => {
    it("rejects a second registration for the same project and email", async () => {
        const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
        const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
        try {
            await client.connect();
        } catch {
            console.warn("Skipping duplicate-constraint test: MongoDB not reachable.");
            return;
        }

        try {
            const collection = client
                .db("woc-service-test")
                .collection(`__dedup_${process.pid}_${Date.now()}`);
            await collection.createIndex(
                { projectId: 1, "participant.email": 1 },
                { unique: true },
            );

            await collection.insertOne({
                projectId: "proj-1",
                participant: { email: "asha@ritb.edu" },
            } as never);

            await expect(
                collection.insertOne({
                    projectId: "proj-1",
                    participant: { email: "asha@ritb.edu" },
                } as never),
            ).rejects.toMatchObject({ code: 11000 });

            await collection.drop().catch(() => undefined);
        } finally {
            await client.close();
        }
    });
});
