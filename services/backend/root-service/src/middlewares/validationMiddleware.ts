import { ApiResponse, CreateExpressRequest, ErrorResponse, ExtractValidatedData, ReqSchemaMap } from "@/types";
import { ResponseCreator } from "@/utils/responseCreator";
import { getAstraLogger } from "astralogger";
import { NextFunction, Request, Response } from "express";
import { ZodError, ZodType } from "zod";

declare global {
    namespace Express {
        interface Request {
            validatedData?: {
                body?: any;
                query?: any;
                params?: any;
            };
        }
    }
}

export function validationMiddleware<T extends ReqSchemaMap>(schema: T) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const validatedData = await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            req.validatedData = validatedData;
            next();
        } catch (error: unknown) {
            getAstraLogger().trace(`Request validation failed: ${error}`);
            if (error instanceof ZodError) {
                const details = error.issues.map(e => ({
                    path: e.path.join("."),
                    message: e.message,
                }));
                return res.status(400).json({
                    success: false,
                    error: { type: "validation", message: "Validation failed", details }
                });
            }
            next(error);
        }
    };
}

export function withResponseValidation<
    TResponse extends Record<string, any>,
    TReqSchema extends ReqSchemaMap
>(
    responseSchema: ZodType<TResponse>,
    handler: (
        req: CreateExpressRequest<ExtractValidatedData<TReqSchema>, any>,
        res: Response<TResponse | ErrorResponse>,
        responseCreator: ResponseCreator<TResponse>
    ) => Promise<ApiResponse<TResponse>> | ApiResponse<TResponse>
) {
    return async (req: Request, res: Response<TResponse | ErrorResponse>, next: NextFunction) => {
        try {
            const responseCreator = new ResponseCreator<TResponse>(req.route?.path || "unknown");
            const typedReq = req as CreateExpressRequest<ExtractValidatedData<TReqSchema>, any>;

            if (req.validatedData) {
                if (req.validatedData.params) Object.assign(typedReq.params || {}, req.validatedData.params);
                if (req.validatedData.query) Object.assign(typedReq.query || {}, req.validatedData.query);
                if (req.validatedData.body) Object.assign(typedReq.body || {}, req.validatedData.body);
            }

            const result = await handler(typedReq as any, res, responseCreator);

            // If handler already sent response, return early
            if (res.headersSent) return;

            // Check if result is an error response
            if (!("success" in result) || result.success === false) {
                return res.status(result.status).json(result);
            }

            // For success responses, validate data
            const validatedData = responseSchema.parse(result.data);
            return res.status(result.status).json(validatedData);
        } catch (error) {
            getAstraLogger().error(`Response validation failed: ${error}`);
            if (error instanceof ZodError) {
                const details = error.issues.map(e => ({
                    path: e.path.join("."),
                    message: e.message,
                }));
                return res.status(500).json({
                    success: false,
                    error: { type: "validation", message: "Response validation failed", details },
                });
            }
            next(error);
        }
    };
}
