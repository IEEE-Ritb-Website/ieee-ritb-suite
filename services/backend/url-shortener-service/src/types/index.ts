import { Request, Response } from "express";
import z, { ZodObject, ZodType } from "zod";
import { ZodSchema } from "zod/v3";

export type ICONFIG = {
    database: {
        name: string;
    },
    server: {
        port: number,
        name: string,
    },
}

export type ReqSchemaMap = ZodObject<{
    body: ZodType<any>;
    query: ZodType<any>;
    params: ZodType<any>;
}>;

export type InferSchemaTypes<T extends ReqSchemaMap> = {
    [K in keyof T]: T[K] extends ZodSchema<infer U> ? U : never;
};

export type ExtractValidatedData<T extends ReqSchemaMap> = z.infer<T>;

export type ValidatedRequest<T extends ReqSchemaMap> = Request & { _validated: z.infer<T> };

export const ErrorResponseSchema = z.object({
    success: z.literal(false),
    error: z.object({
        type: z.enum(["validation", "not_found", "unauthorized", "forbidden", "fatal"]),
        message: z.string(),
        details: z.any().optional(),
    }),
});

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;

export interface SuccessResponse<T> {
    success: true;
    data?: T;       // present only in success
    message?: string; // optional message for UX clarity
}

export type ApiResponse<T> = SuccessResponse<T> & { status: number } | ErrorResponse & { status: number };

export type WithResponsePromise<T> = Promise<ApiResponse<T>>;

export type TypedRequest<S extends { params?: any; body?: any; query?: any }> = Request<
    S["params"] extends object ? S["params"] : Record<string, never>,
    any, // response body not enforced here
    S["body"] extends object ? S["body"] : Record<string, never>,
    S["query"] extends object ? S["query"] : Record<string, never>
>;

export type CreateExpressRequest<
    TReq extends z.infer<ReqSchemaMap>,
    TRes,
> = Request<TReq["params"], TRes, TReq["body"], TReq["query"]>;
export type CreateExpressResponse<TRes> = Response<TRes>;
