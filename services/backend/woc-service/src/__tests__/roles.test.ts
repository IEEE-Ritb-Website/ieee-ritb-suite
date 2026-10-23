import { describe, expect, it } from "vitest";
import { getUserRole } from "@/utils/roles";

describe("getUserRole", () => {
    it("returns admin for admin app_metadata", () => {
        expect(getUserRole({ app_metadata: { role: "admin" } })).toBe("admin");
    });

    it("returns mentor for mentor app_metadata", () => {
        expect(getUserRole({ app_metadata: { role: "mentor" } })).toBe("mentor");
    });

    it("returns participant for participant app_metadata", () => {
        expect(getUserRole({ app_metadata: { role: "participant" } })).toBe("participant");
    });

    it("falls back to participant for unknown roles", () => {
        expect(getUserRole({ app_metadata: { role: "superuser" } })).toBe("participant");
        expect(getUserRole({ app_metadata: { role: "" } })).toBe("participant");
        expect(getUserRole({ app_metadata: { role: 42 } })).toBe("participant");
    });

    it("falls back to participant when metadata is missing", () => {
        expect(getUserRole({ app_metadata: null })).toBe("participant");
        expect(getUserRole({})).toBe("participant");
        expect(getUserRole(null)).toBe("participant");
        expect(getUserRole(undefined)).toBe("participant");
    });
});
