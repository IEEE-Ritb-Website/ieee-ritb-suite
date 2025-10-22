import { ShortUrlSchema } from "@/schemas";
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
        body: ShortUrlSchema.pick({
            long_url: true,
            ttl_seconds: true,
        }).extend({
            code: z.string().optional(),
        }),
        query: z.object({}),
    })
)

export const CreateShortUrlResponseValidator = defineResponseSchema(
    z.object({
        success: z.literal(true),
        data: ShortUrlSchema.pick({
            long_url: true,
            created_at: true,
            expires_at: true,
            ttl_seconds: true,
        }).extend({
            short_url: z.url(),
        }),
        message: z.string(),
    }),
)

export type ICreateShortUrlRequest = z.infer<typeof CreateShortUrlRequestValidator>;
export type ICreateShortUrlResponse = z.infer<typeof CreateShortUrlResponseValidator>;
export type CreateShortUrlResponse = CreateExpressResponse<ICreateShortUrlResponse>;
export type CreateShortUrlRequest = CreateExpressRequest<ICreateShortUrlRequest, ICreateShortUrlResponse>;