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
        params: z.object({}).optional().default({}),
        body: ShortUrlSchema.pick({
            long_url: true,
            ttl_seconds: true,
        }).extend({
            code: ShortUrlSchema.shape.code.optional(),
        }),
        query: z.object({}).optional().default({}),
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

export const GetShortUrlRequestValidator = defineRequestSchema(
    z.object({
        params: ShortUrlSchema.pick({
            code: true,
        }),
        body: z.object({}).optional().default({}),
        query: z.object({}).optional().default({}),
    })
)

export const GetShortUrlResponseValidator = defineResponseSchema(
    z.object({
        success: z.literal(true),
        _redirect: z.url(),
    }),
)

export type IGetShortUrlRequest = z.infer<typeof GetShortUrlRequestValidator>;
export type IGetShortUrlResponse = z.infer<typeof GetShortUrlResponseValidator>;
export type GetShortUrlResponse = CreateExpressResponse<IGetShortUrlResponse>;
export type GetShortUrlRequest = CreateExpressRequest<IGetShortUrlRequest, IGetShortUrlResponse>;