import { z } from "zod";

// Configuration type
export type ICONFIG = {
    database: {
        name: string;
    };
    server: {
        port: number;
        name: string;
    };
    cronSecret: string;
};

export const ErrorResponseSchema = z.object({
    success: z.literal(false),
    error: z.object({
        type: z.enum(["validation", "not_found", "unauthorized", "forbidden", "fatal"]),
        message: z.string(),
        details: z.any().optional(),
    }),
});

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;

// Success response interface
export interface SuccessResponse<T> {
    success: true;
    data?: T;
    message?: string;
}
