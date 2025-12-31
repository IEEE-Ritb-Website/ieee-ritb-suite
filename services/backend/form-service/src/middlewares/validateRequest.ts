import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const validateRequest = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const validated = schema.parse({
                body: req.body,
                params: req.params,
                query: req.query,
            });

            (req as any)._validated = validated;

            next();
        } catch (error) {
            next(error);
        }
    };
};
