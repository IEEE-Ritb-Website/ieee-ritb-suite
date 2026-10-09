import { describe, expect, it } from "vitest";
import { ValidationError } from "@/middlewares/errorHandler";
import {
    assertRegistrationEligibility,
    normalizeEmail,
} from "@/utils/registrationGuards";

describe("normalizeEmail", () => {
    it("lowercases and trims so case variants cannot bypass duplicates", () => {
        expect(normalizeEmail(" Asha@RITB.EDU ")).toBe("asha@ritb.edu");
        expect(normalizeEmail("mentor+WOC@College.edu")).toBe("mentor+woc@college.edu");
    });
});

describe("assertRegistrationEligibility", () => {
    const openProject = {
        status: "published",
        applicationDeadline: new Date(Date.now() + 86400000),
        eligibility: { allowedYears: [2, 3] },
    };

    it("passes for eligible registrations", () => {
        expect(() => assertRegistrationEligibility(openProject, 2)).not.toThrow();
        expect(() => assertRegistrationEligibility(openProject, undefined)).not.toThrow();
    });

    it("rejects unpublished projects", () => {
        expect(() =>
            assertRegistrationEligibility({ ...openProject, status: "draft" }, 2),
        ).toThrowError(ValidationError);
        expect(() =>
            assertRegistrationEligibility({ ...openProject, status: "draft" }, 2),
        ).toThrowError("Project is not published");
    });

    it("rejects past deadlines", () => {
        expect(() =>
            assertRegistrationEligibility(
                { ...openProject, applicationDeadline: new Date(Date.now() - 1000) },
                2,
            ),
        ).toThrowError("Applications have closed for this project");
    });

    it("rejects years outside the allowed list", () => {
        expect(() => assertRegistrationEligibility(openProject, 1)).toThrowError(
            "This project is only open to year(s): 2, 3",
        );
    });

    it("passes when the project lists no year restriction", () => {
        expect(() =>
            assertRegistrationEligibility({ status: "published" }, 1),
        ).not.toThrow();
    });
});
