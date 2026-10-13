import { ValidationError } from "@/middlewares/errorHandler";

// Supabase Storage bucket holding applicant proposal documents and the
// per-file ceiling (15 MB). Mirrored in the frontend upload flow.
export const PROPOSAL_DOCS_BUCKET = "proposal-docs";
export const MAX_PROPOSAL_DOC_BYTES = 15 * 1024 * 1024;

type RegistrationGuardProject = {
    applicationDeadline?: Date | string;
    eligibility?: {
        allowedYears?: number[];
    } | null;
};

// Canonical email form so duplicate checks and unique indexes cannot be
// bypassed with case variants (e.g. Asha@x.edu vs asha@x.edu).
export const normalizeEmail = (email: string): string => email.trim().toLowerCase();

// Pure eligibility check (no database access) shared by the controller and
// unit tests. Throws ValidationError on the first failing rule.
//
// NOTE: `requireIEEEMembership` is intentionally NOT enforced here — there
// is no IEEE membership data source to verify against yet. Wiring one is a
// follow-up; failing open loudly (documented) beats a fake check.
export const assertRegistrationEligibility = (
    project: RegistrationGuardProject,
    participantYear?: number,
): void => {
    if (project.applicationDeadline) {
        const deadline = new Date(project.applicationDeadline).getTime();
        if (!Number.isNaN(deadline) && Date.now() > deadline) {
            throw new ValidationError("Applications have closed for this project");
        }
    }

    const allowedYears = project.eligibility?.allowedYears;
    if (
        allowedYears &&
        allowedYears.length > 0 &&
        participantYear !== undefined &&
        !allowedYears.includes(participantYear)
    ) {
        throw new ValidationError(
            `This project is only open to year(s): ${allowedYears.join(", ")}`,
        );
    }
}

// Verifies an attached proposal document URL genuinely points at a file in
// our own Supabase Storage bucket — otherwise anyone could submit an
// arbitrary link as a "proposal". Type must match the file extension.
export const assertProposalDocUrl = (
    doc: { url: string; type: string },
    supabaseUrl: string,
): void => {
    let expectedHost = "";
    try {
        expectedHost = new URL(supabaseUrl).hostname;
    } catch {
        throw new ValidationError("Proposal uploads are not configured");
    }
    if (!expectedHost) {
        throw new ValidationError("Proposal uploads are not configured");
    }

    let parsed: URL;
    try {
        parsed = new URL(doc.url);
    } catch {
        throw new ValidationError("Invalid proposal document URL");
    }

    const expectedPrefix = `/storage/v1/object/public/${PROPOSAL_DOCS_BUCKET}/`;
    const pathname = parsed.pathname.toLowerCase();
    if (
        parsed.protocol !== "https:" ||
        parsed.hostname.toLowerCase() !== expectedHost.toLowerCase() ||
        !parsed.pathname.startsWith(expectedPrefix)
    ) {
        throw new ValidationError("Proposal document must be uploaded to the program bucket");
    }

    const extension = pathname.endsWith(".pdf")
        ? "pdf"
        : pathname.endsWith(".docx")
          ? "docx"
          : undefined;
    if (!extension || extension !== doc.type.toLowerCase()) {
        throw new ValidationError("Proposal document must be a PDF or DOCX file");
    }
};
