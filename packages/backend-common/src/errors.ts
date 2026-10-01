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
