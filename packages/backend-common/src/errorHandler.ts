import { NextFunction, Request, Response } from "express";

interface ErrorBody {
    success: false;
    error: {
        type: string;
        message: string;
        details?: unknown;
    };
}

export const errorHandler = (
    err: unknown,
    req: Request,
    res: Response,
    _next: NextFunction,
) => {
    // eslint-disable-next-line no-console
    console.error("[Error]", {
        name: err instanceof Error ? err.name : "Unknown",
        message: err instanceof Error ? err.message : String(err),
        path: req.path,
        method: req.method,
    });

    const fail = (status: number, body: ErrorBody) => res.status(status).json(body);

    // Errors cross package boundaries inside unified-service (each linked
    // service ships its own copy of these classes), so match on name.
    const name = err instanceof Error ? err.name : "Unknown";
    const detailsOf = (error: unknown) =>
        Array.isArray((error as { issues?: unknown }).issues)
            ? (error as { issues: unknown }).issues
            : (error as { details?: unknown }).details;

    if (name === "ZodError") {
        return fail(400, {
            success: false,
            error: { type: "validation", message: "Validation failed", details: detailsOf(err) },
        });
    }
    if (name === "ValidationError") {
        return fail(400, {
            success: false,
            error: { type: "validation", message: (err as Error).message, details: detailsOf(err) },
        });
    }
    if (name === "NotFoundError") {
        return fail(404, {
            success: false,
            error: { type: "not_found", message: (err as Error).message },
        });
    }
    if (name === "UnauthorizedError") {
        return fail(401, {
            success: false,
            error: { type: "unauthorized", message: (err as Error).message },
        });
    }
    if (name === "ForbiddenError") {
        return fail(403, {
            success: false,
            error: { type: "forbidden", message: (err as Error).message },
        });
    }
    if (name === "ConflictError") {
        return fail(409, {
            success: false,
            error: { type: "validation", message: (err as Error).message },
        });
    }
    if (err instanceof Error && err.name === "MongoServerError" && "code" in err && (err as { code: number }).code === 11000) {
        return fail(409, {
            success: false,
            error: { type: "validation", message: "Duplicate entry. This record already exists." },
        });
    }

    return fail(500, {
        success: false,
        error: { type: "fatal", message: "An unexpected error occurred. Please try again later." },
    });
};
