import { CreateExpressRequest, CreateExpressResponse, ErrorResponseSchema, ReqSchemaMap } from "@/types";
import { IChapter, ChapterType } from "@astranova/catalogues";
import { z, ZodObject } from "zod";

function defineRequestSchema<T extends ReqSchemaMap>(schema: T): T {
    return schema;
}

function defineResponseSchema<TSuccess extends ZodObject<any>>(successSchema: TSuccess) {
    return z.discriminatedUnion("success", [
        successSchema,
        ErrorResponseSchema,
    ]);
}

const ChapterTypeValues = Object.values(ChapterType) as [string, ...string[]];

export const GetChaptersRequestValidator = defineRequestSchema(
    z.object({
        params: z.object({}).optional().default({}),
        body: z.object({}).optional().default({}),
        query: z.object({
            name: z.string().optional(),
            acronym: z.string().optional(),
            type: z.enum(ChapterTypeValues).optional(),
        }).optional().default({}),
    })
);

export type IGetChaptersRequest = z.infer<typeof GetChaptersRequestValidator>;

export const GetChaptersResponseValidator = defineResponseSchema(
    z.object({
        success: z.literal(true),
        data: z.array(z.custom<IChapter>()),
    })
);

export type IGetChaptersResponse = z.infer<typeof GetChaptersResponseValidator>;
export type GetChaptersResponse = CreateExpressResponse<IGetChaptersResponse>;
export type GetChaptersRequest = CreateExpressRequest<IGetChaptersRequest, IGetChaptersResponse>;
