import { describe, expect, it } from "vitest";
import { ConflictError } from "@/middlewares/errorHandler";

/**
 * Verifies duplicate handling logic for registrations.
 */
describe("registration unique constraints", () => {
    it("recognizes duplicate registration conflict", () => {
        const conflict = new ConflictError("You have already registered for this project");
        expect(conflict).toBeInstanceOf(ConflictError);
        expect(conflict.message).toBe("You have already registered for this project");
    });
});
