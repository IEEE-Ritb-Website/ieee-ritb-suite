import { ApiResponse } from "@/types";

export class ResponseCreator<T extends Record<string, any>> {
    constructor(private readonly defaultType: string) { }

    ok(data: T): ApiResponse<T> {
        return { status: 200, success: true, data };
    }

    created(data: T): ApiResponse<T> {
        return { status: 201, success: true, data };
    }

    noContent(): ApiResponse<T> {
        return { status: 204, success: true };
    }

    badRequest(message = "Bad Request", details?: { path: string, message: string }[]): ApiResponse<T> {
        return {
            status: 400,
            success: false,
            error: { type: "validation", message, details }
        };
    }

    unauthorized(message = "Unauthorized action"): ApiResponse<T> {
        return {
            status: 401,
            success: false,
            error: { type: "unauthorized", message }
        };
    }

    forbidden(message = "Forbidden"): ApiResponse<T> {
        return {
            status: 403,
            success: false,
            error: { type: "forbidden", message }
        };
    }

    notFound(message = "Not Found"): ApiResponse<T> {
        return {
            status: 404,
            success: false,
            error: { type: "not_found", message }
        };
    }

    fatal(message = "Internal Server Error", details?: any): ApiResponse<T> {
        return {
            status: 500,
            success: false,
            error: { type: "fatal", message, details }
        };
    }
}
