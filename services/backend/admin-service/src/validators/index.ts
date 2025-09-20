import { CreateExpressRequest, CreateExpressResponse, ErrorResponseSchema, ReqSchemaMap } from "@/types";
import z, { boolean, success, ZodObject } from "zod";
import { ChapterNames } from "@astranova/catalogues";

function defineRequestSchema<T extends ReqSchemaMap>(schema: T): T {
    return schema;
}

function defineResponseSchema<TSuccess extends ZodObject<any>>(successSchema: TSuccess) {
    return z.discriminatedUnion("success", [
        successSchema,
        ErrorResponseSchema,
    ])
}

export const CreateChapterAdminRequestValidator = defineRequestSchema(
    z.object({
        params: z.object({}),
        body: z.object({
            email: z.email(),
            name: z.string(),
            password: z.string(),
            chapter: z.enum(ChapterNames),
        }),
        query: z.object({}),
    })
)

export type ICreateChapterAdminRequest = z.infer<typeof CreateChapterAdminRequestValidator>;

export const CreateChapterAdminResponseValidator = defineResponseSchema(
    z.object({
        success: z.literal(true),
        message: z.string(),
    }),
)

export type ICreateChapterAdminResponse = z.infer<typeof CreateChapterAdminResponseValidator>;
export type CreateChapterAdminResponse = CreateExpressResponse<ICreateChapterAdminResponse>;
export type CreateChapterAdminRequest = CreateExpressRequest<ICreateChapterAdminRequest, ICreateChapterAdminResponse>;

export const SignInRequestValidator = defineRequestSchema(
    z.object({
        params: z.object({}),
        body: z.object({
            email: z.string(),
            password: z.string(),
        }),
        query: z.object({}),
    })
)

export type ISignInRequest = z.infer<typeof SignInRequestValidator>;

export const SignInResponseValidator = defineResponseSchema(
    z.object({
        success: z.literal(true),
        message: z.string(),
        redirect: z.boolean(),
        token: z.string(),
        user: z.object({
            id: z.string(),
            email: z.string(),
            name: z.string(),
            emailVerified: z.boolean(),
            createdAt: z.date(),
            updatedAt: z.date(),
        }),
    })
)

export type ISignInResponse = z.infer<typeof SignInResponseValidator>;
export type SignInResponse = CreateExpressResponse<ISignInResponse>;
export type SignInRequest = CreateExpressRequest<ISignInRequest, ISignInResponse>;
