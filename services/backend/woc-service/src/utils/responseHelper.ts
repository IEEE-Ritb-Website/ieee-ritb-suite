import { SuccessResponse } from "@/types";

// Success response helper
export const successResponse = <T>(
    data?: T,
    message?: string
): SuccessResponse<T> => {
    return {
        success: true,
        ...(data !== undefined && { data }),
        ...(message && { message }),
    };
};
