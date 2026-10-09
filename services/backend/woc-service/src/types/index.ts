import { z } from "zod";
import type { UserRole } from "@/utils/roles";

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
    supabase: {
        url: string;
        anonKey: string;
    };
};

// Authenticated user attached by requireAuth middleware.
// Role is resolved from verified Supabase app_metadata at auth time.
export type AuthUser = {
    id: string;
    email?: string;
    role: UserRole;
};

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Express {
        interface Request {
            user?: AuthUser;
        }
    }
}

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
