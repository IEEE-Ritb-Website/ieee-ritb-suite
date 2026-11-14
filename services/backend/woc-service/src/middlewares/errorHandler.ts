import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { ErrorResponse } from "@/types";
import { getAstraLogger } from "astralogger";

// Custom error classes
export class ValidationError extends Error {
    constructor(message: string, public details?: unknown) {
        super(message);
        this.name = "ValidationError";
    }
}

export class NotFoundError extends Error {
    constructor(resource: string) {
        super(`${resource} not found`);
        this.name = "NotFoundError";
    }
}

export class ConflictError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ConflictError";
    }
}

export class ForbiddenError extends Error {
    constructor(message: string = "Forbidden") {
        super(message);
        this.name = "ForbiddenError";
    }
}

export class UnauthorizedError extends Error {
    constructor(message: string = "Unauthorized access") {
        super(message);
        this.name = "UnauthorizedError";
    }
}

export const errorHandler = (
    err: unknown,
    req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _next: NextFunction
) => {
    getAstraLogger().error({ err }, `[Error] path=${req.path} method=${req.method}`);

    if (err instanceof ZodError) {
        const errorResponse: ErrorResponse = {
            success: false,
            error: {
                type: "validation",
                message: "Validation failed",
                details: err.issues,
            },
        };
        return res.status(400).json(errorResponse);
    }
    if (err instanceof ValidationError) {
        const errorResponse: ErrorResponse = {
            success: false,
            error: {
                type: "validation",
                message: err.message,
                details: err.details,
            },
        };
        return res.status(400).json(errorResponse);
    }

    if (err instanceof NotFoundError || (err instanceof Error && err.message.includes("invalid input syntax for type uuid"))) {
        const errorResponse: ErrorResponse = {
            success: false,
            error: {
                type: "not_found",
                message: err.message.includes("invalid input syntax for type uuid") ? "Resource not found" : err.message,
            },
        };
        return res.status(404).json(errorResponse);
    }

    if (err instanceof UnauthorizedError) {
        const errorResponse: ErrorResponse = {
            success: false,
            error: {
                type: "unauthorized",
                message: err.message,
            },
        };
        return res.status(401).json(errorResponse);
    }

    // Handle forbidden errors
    if (err instanceof ForbiddenError) {
        const errorResponse: ErrorResponse = {
            success: false,
            error: {
                type: "forbidden",
                message: err.message,
            },
        };
        return res.status(403).json(errorResponse);
    }

    // Handle conflict errors (e.g., duplicate entries)
    if (err instanceof ConflictError) {
        const errorResponse: ErrorResponse = {
            success: false,
            error: {
                type: "validation",
                message: err.message,
            },
        };
        return res.status(409).json(errorResponse);
    }

    // Handle database duplicate key errors (e.g. Postgres 23505)
    if (
        err instanceof Error &&
        (("code" in err && ((err as { code: unknown }).code === "23505" || (err as { code: unknown }).code === 11000)) ||
         err.message.includes("unique constraint") ||
         err.message.includes("duplicate key"))
    ) {
        const errorResponse: ErrorResponse = {
            success: false,
            error: {
                type: "validation",
                message: "Duplicate entry. This record already exists.",
            },
        };
        return res.status(409).json(errorResponse);
    }

    // Handle malformed JSON bodies (thrown by body-parser before routing).
    // Without this branch they surface as misleading 500 fatal errors.
    if (
        err instanceof SyntaxError &&
        "status" in err &&
        (err as { status?: number }).status === 400 &&
        "body" in err
    ) {
        const errorResponse: ErrorResponse = {
            success: false,
            error: {
                type: "validation",
                message: "Invalid JSON body",
            },
        };
        return res.status(400).json(errorResponse);
    }

    // Default fatal error
    const errorResponse: ErrorResponse = {
        success: false,
        error: {
            type: "fatal",
            message: "An unexpected error occurred. Please try again later.",
        },
    };
    return res.status(500).json(errorResponse);
};
