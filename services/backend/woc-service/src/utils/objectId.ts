import { ValidationError } from "@/middlewares";

/**
 * Validates a resource ID string.
 */
export const validateId = (id: string, resource: string): string => {
    if (!id || typeof id !== "string" || id.trim().length === 0) {
        throw new ValidationError(`Invalid ${resource} ID`);
    }
    return id.trim();
};

export const toObjectId = validateId;
