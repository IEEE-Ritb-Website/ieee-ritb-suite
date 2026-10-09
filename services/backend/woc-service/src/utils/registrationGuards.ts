import { ValidationError } from "@/middlewares/errorHandler";

type RegistrationGuardProject = {
    status: string;
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
    if (project.status !== "published") {
        throw new ValidationError("Project is not published");
    }

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
};
