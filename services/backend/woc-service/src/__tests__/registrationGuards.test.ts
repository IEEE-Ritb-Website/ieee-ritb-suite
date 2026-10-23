import { describe, expect, it } from "vitest";
import { ValidationError } from "@/middlewares/errorHandler";
import {
    assertProposalDocUrl,
    assertRegistrationEligibility,
    normalizeEmail,
} from "@/utils/registrationGuards";

const SUPABASE_URL = "https://lqnhygklbztsnmmpzqvr.supabase.co";
const goodPdf =
    "https://lqnhygklbztsnmmpzqvr.supabase.co/storage/v1/object/public/proposal-docs/proposals/abc/file.pdf";

describe("normalizeEmail", () => {
    it("lowercases and trims so case variants cannot bypass duplicates", () => {
        expect(normalizeEmail(" Asha@RITB.EDU ")).toBe("asha@ritb.edu");
        expect(normalizeEmail("mentor+WOC@College.edu")).toBe("mentor+woc@college.edu");
    });
});

describe("assertRegistrationEligibility", () => {
    const openProject = {
        applicationDeadline: new Date(Date.now() + 86400000),
        eligibility: { allowedYears: [2, 3] },
    };

    it("passes for eligible registrations", () => {
        expect(() => assertRegistrationEligibility(openProject, 2)).not.toThrow();
        expect(() => assertRegistrationEligibility(openProject, undefined)).not.toThrow();
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
            assertRegistrationEligibility({}, 1),
        ).not.toThrow();
    });
});

describe("assertProposalDocUrl", () => {
    it("accepts matching bucket URLs with matching types", () => {
        expect(() =>
            assertProposalDocUrl({ url: goodPdf, type: "pdf" }, SUPABASE_URL),
        ).not.toThrow();
        expect(() =>
            assertProposalDocUrl(
                {
                    url: "https://lqnhygklbztsnmmpzqvr.supabase.co/storage/v1/object/public/proposal-docs/x/y.docx?token=abc",
                    type: "docx",
                },
                SUPABASE_URL,
            ),
        ).not.toThrow();
    });

    it("rejects foreign hosts, wrong buckets, and type mismatches", () => {
        expect(() =>
            assertProposalDocUrl({ url: "https://evil.example/f.pdf", type: "pdf" }, SUPABASE_URL),
        ).toThrowError("must be uploaded to the program bucket");
        expect(() =>
            assertProposalDocUrl(
                {
                    url: "https://lqnhygklbztsnmmpzqvr.supabase.co/storage/v1/object/public/other-bucket/f.pdf",
                    type: "pdf",
                },
                SUPABASE_URL,
            ),
        ).toThrowError("must be uploaded to the program bucket");
        expect(() =>
            assertProposalDocUrl(
                {
                    url: "https://lqnhygklbztsnmmpzqvr.supabase.co/storage/v1/object/public/proposal-docs/f.docx",
                    type: "pdf",
                },
                SUPABASE_URL,
            ),
        ).toThrowError("must be a PDF or DOCX file");
        expect(() =>
            assertProposalDocUrl(
                {
                    url: "https://lqnhygklbztsnmmpzqvr.supabase.co/storage/v1/object/public/proposal-docs/f.txt",
                    type: "pdf",
                },
                SUPABASE_URL,
            ),
        ).toThrowError("must be a PDF or DOCX file");
    });

    it("rejects malformed URLs and unconfigured storage", () => {
        expect(() =>
            assertProposalDocUrl({ url: "not-a-url", type: "pdf" }, SUPABASE_URL),
        ).toThrowError(ValidationError);
        expect(() => assertProposalDocUrl({ url: goodPdf, type: "pdf" }, "")).toThrowError(
            "Proposal uploads are not configured",
        );
    });
});
