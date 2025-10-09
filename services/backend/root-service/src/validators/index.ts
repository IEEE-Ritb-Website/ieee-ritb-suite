import { CreateExpressRequest, CreateExpressResponse, ErrorResponseSchema, ReqSchemaMap } from "@/types";
import { z, ZodObject } from "zod";
import { ChapterSchema } from "../schemas/chapterSchema";

// --- HELPER FUNCTIONS ---
function defineRequestSchema<T extends ReqSchemaMap>(schema: T): T {
    return schema;
}

function defineResponseSchema<TSuccess extends ZodObject<any>>(successSchema: TSuccess) {
    return z.discriminatedUnion("success", [
        successSchema,
        ErrorResponseSchema,
    ]);
}

export const ChaptersRequestValidator = defineRequestSchema(
    z.object({
        params: z.object({}),
        body: z.object({}),
        query: z.object({
            chapterName: z.string().min(1, 'Chapter name cannot be empty').optional(),
            acronym: z.string().optional(),
            type: z.string().optional(),
        }),
    })
);

const ChaptersSuccessResponseSchema = z.object({
    success: z.literal(true),
    data: z.array(ChapterSchema), 
});

export const ChaptersResponseValidator = defineResponseSchema(ChaptersSuccessResponseSchema);

export type IChaptersResponse = z.infer<typeof ChaptersResponseValidator>;
export type ChaptersResponse = CreateExpressResponse<IChaptersResponse>;
export type ChaptersRequest = CreateExpressRequest<z.infer<typeof ChaptersRequestValidator>, IChaptersResponse>;
