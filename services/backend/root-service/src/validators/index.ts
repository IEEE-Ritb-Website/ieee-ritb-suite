import {
  CreateExpressRequest,
  CreateExpressResponse,
  ErrorResponseSchema,
  ReqSchemaMap,
} from "@/types";
import {
  ChapterType,
  OrganizationStructure,
} from "@astranova/catalogues";
import { z, ZodObject } from "zod";

function defineRequestSchema<T extends ReqSchemaMap>(schema: T): T {
  return schema;
}

function defineResponseSchema<TSuccess extends ZodObject<any>>(
  successSchema: TSuccess,
) {
  return z.discriminatedUnion("success", [successSchema, ErrorResponseSchema]);
}

const ChapterTypeValues = Object.values(ChapterType) as [string, ...string[]];

export const GetChaptersRequestValidator = defineRequestSchema(
  z.object({
    params: z.object({}).optional().default({}),
    body: z.object({}).optional().default({}),
    query: z
      .object({
        name: z.string().optional(),
        acronym: z.string().optional(),
        type: z.enum(ChapterTypeValues).optional(),
      })
      .optional()
      .default({}),
  }),
);

export type IGetChaptersRequest = z.infer<typeof GetChaptersRequestValidator>;

export const GetChaptersResponseValidator = defineResponseSchema(
  z.object({
    success: z.literal(true),
    data: z.array(
      z.object({
        name: z.string(),
        type: z.enum(ChapterTypeValues),
        acronym: z.string(),
        shortDescription: z.string(),
        logoUrl: z.string(),
      }),
    ),
  }),
);

export type IGetChaptersResponse = z.infer<typeof GetChaptersResponseValidator>;
export type GetChaptersResponse = CreateExpressResponse<IGetChaptersResponse>;
export type GetChaptersRequest = CreateExpressRequest<
  IGetChaptersRequest,
  IGetChaptersResponse
>;

export const CronRequestValidator = defineRequestSchema(
  z.object({
    params: z.object({}).optional().default({}),
    body: z.object({}).optional().default({}),
    query: z.object({}).optional().default({}),
  }),
);

export const CronResponseValidator = defineResponseSchema(
  z.object({
    success: z.literal(true),
    data: z.object({
      timestamp: z.string(),
      message: z.string(),
    }),
    message: z.string(),
  }),
);

export type ICronRequest = z.infer<typeof CronRequestValidator>;
export type ICronResponse = z.infer<typeof CronResponseValidator>;
export type CronResponse = CreateExpressResponse<ICronResponse>;
export type CronRequest = CreateExpressRequest<ICronRequest, ICronResponse>;

const booleanQuerySchema = z
  .preprocess((val) => {
    if (typeof val === "string") {
      if (val.toLowerCase() === "true") return true;
      if (val.toLowerCase() === "false") return false;
    }
    return val;
  }, z.boolean())
  .optional();

export const GetUsersRequestValidator = defineRequestSchema(
  z.object({
    params: z.object({}).optional().default({}),
    body: z.object({}).optional().default({}),
    query: z
      .object({
        limit: z.coerce.number().int().positive().optional().default(20),
        offset: z.coerce.number().int().nonnegative().optional().default(0),
        position: z.string().optional(),
        chapters: z
          .string()
          .optional()
          .refine(
            (val) => {
              if (!val) return true;
              const items = val.split(",").map((i) => i.trim());
              return items.every(
                (item) =>
                  OrganizationStructure.some(
                    (c) =>
                      c.name.toLowerCase() === item.toLowerCase() ||
                      c.acronym.toLowerCase() === item.toLowerCase(),
                  ),
              );
            },
            {
              message: "Invalid chapter name or acronym in chapters list",
            },
          ),
        onlySeniorPositions: booleanQuerySchema,
        onlyJuniorPositions: booleanQuerySchema,
        onlyExecoms: booleanQuerySchema,
      })
      .optional()
      .default({ limit: 20, offset: 0 }),
  }),
);

export const GetUsersResponseValidator = defineResponseSchema(
  z.object({
    success: z.literal(true),
    data: z.array(
      z.object({
        name: z.string(),
        image: z.string().optional().nullable(),
        username: z.string(),
        chapters: z.array(
          z.object({
            name: z.string(),
            acronym: z.string(),
            position: z.string().optional(),
          }),
        ),
        department: z.string().optional().nullable(),
        year: z.string().optional().nullable(),
        term: z.string().optional().nullable(),
      }),
    ),
    message: z.string().optional(),
  }),
);

export type IGetUsersRequest = z.infer<typeof GetUsersRequestValidator>;
export type IGetUsersResponse = z.infer<typeof GetUsersResponseValidator>;
export type GetUsersResponse = CreateExpressResponse<IGetUsersResponse>;
export type GetUsersRequest = CreateExpressRequest<
  IGetUsersRequest,
  IGetUsersResponse
>;
