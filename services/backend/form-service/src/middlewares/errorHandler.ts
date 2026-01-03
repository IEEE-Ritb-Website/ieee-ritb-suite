import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { ErrorResponse } from "@/types";

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

export class UnauthorizedError extends Error {
    constructor(message: string = "Unauthorized access") {
        super(message);
        this.name = "UnauthorizedError";
    }
}

export class ForbiddenError extends Error {
    constructor(message: string = "Forbidden") {
        super(message);
        this.name = "ForbiddenError";
    }
}

export class ConflictError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ConflictError";
    }
}

export const errorHandler = (
    err: unknown,
    req: Request,
    res: Response,
    _next: NextFunction
) => {
    console.error("[Error]", {
        name: err instanceof Error ? err.name : "Unknown",
        message: err instanceof Error ? err.message : String(err),
        path: req.path,
        method: req.method,
    });

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

    if (err instanceof NotFoundError) {
        const errorResponse: ErrorResponse = {
            success: false,
            error: {
                type: "not_found",
                message: err.message,
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

    // Handle MongoDB duplicate key errors
    if (
        err instanceof Error &&
        err.name === "MongoServerError" &&
        "code" in err &&
        (err as { code: number }).code === 11000
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
