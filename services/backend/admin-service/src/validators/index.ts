import { CreateExpressRequest, CreateExpressResponse, ErrorResponseSchema, ReqSchemaMap } from "@/types";
import z, { ZodObject } from "zod";
import { ChapterNameSchema } from "@astranova/catalogues";

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
            chapter: ChapterNameSchema,
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

export const CreateChapterExecomRequestValidator = defineRequestSchema(
    z.object({
        params: z.object({}),
        body: z.object({
            email: z.email(),
            name: z.string(),
            password: z.string(),
            chapter: ChapterNameSchema,
        }),
        query: z.object({}),
    })
)

export type ICreateChapterExecomRequest = z.infer<typeof CreateChapterExecomRequestValidator>;

export const CreateChapterExecomResponseValidator = defineResponseSchema(
    z.object({
        success: z.literal(true),
        message: z.string(),
    }),
)

export type ICreateChapterExecomResponse = z.infer<typeof CreateChapterExecomResponseValidator>;
export type CreateChapterExecomResponse = CreateExpressResponse<ICreateChapterExecomResponse>;
export type CreateChapterExecomRequest = CreateExpressRequest<ICreateChapterExecomRequest, ICreateChapterExecomResponse>;

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
        url: z.string().optional(),
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

export const ChangePasswordRequestValidator = defineRequestSchema(
    z.object({
        params: z.object({}),
        body: z.object({
            email: z.string(),
            newPassword: z.string(),
        }),
        query: z.object({}),
    })
)

export type IChangePasswordRequest = z.infer<typeof ChangePasswordRequestValidator>;

export const ChangePasswordResponseValidator = defineResponseSchema(
    z.object({
        success: z.literal(true),
        message: z.string(),
    })
)

export type IChangePasswordResponse = z.infer<typeof ChangePasswordResponseValidator>;
export type ChangePasswordResponse = CreateExpressResponse<IChangePasswordResponse>;
export type ChangePasswordRequest = CreateExpressRequest<IChangePasswordRequest, IChangePasswordResponse>;
