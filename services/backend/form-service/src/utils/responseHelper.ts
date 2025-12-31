import { SuccessResponse, ErrorResponse } from "@/types";

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

// Error response helper
export const errorResponse = (
    type: "validation" | "not_found" | "unauthorized" | "forbidden" | "fatal",
    message: string,
    details?: any
): ErrorResponse => {
    return {
        success: false,
        error: {
            type,
            message,
            ...(details && { details }),
        },
    };
};
