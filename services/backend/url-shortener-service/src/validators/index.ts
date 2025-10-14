import { CreateExpressRequest, CreateExpressResponse, ErrorResponseSchema, ReqSchemaMap } from "@/types";
import z, { ZodObject } from "zod";

function defineRequestSchema<T extends ReqSchemaMap>(schema: T): T {
    return schema;
}

function defineResponseSchema<TSuccess extends ZodObject<any>>(successSchema: TSuccess) {
    return z.discriminatedUnion("success", [
        successSchema,
        ErrorResponseSchema,
    ])
}

export const CreateShortUrlRequestValidator = defineRequestSchema(
    z.object({
        params: z.object({}),
        body: z.object({
            // TODO: 
            long_url: z.url(),
        }),
        query: z.object({}),
    })
)

export type ICreateShortUrlRequest = z.infer<typeof CreateShortUrlRequestValidator>;

export const CreateShortUrlResponseValidator = defineResponseSchema(
    z.object({
        success: z.literal(true),
        data: z.object({
            // TODO:
            shortUrl: z.url(),
        }),
        message: z.string(),
    }),
)

export type ICreateShortUrlResponse = z.infer<typeof CreateShortUrlResponseValidator>;
export type CreateShortUrlResponse = CreateExpressResponse<ICreateShortUrlResponse>;
export type CreateShortUrlRequest = CreateExpressRequest<ICreateShortUrlRequest, ICreateShortUrlResponse>;