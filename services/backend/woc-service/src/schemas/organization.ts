import { z } from "zod";


export const OrganizationSchema = z.object({
    name: z.string().min(2),
    imageUrl: z.string().url().optional(),
    tagline: z.string().optional(),


    createdAt: z.date().default(() => new Date()),
    updatedAt: z.date().default(() => new Date()),
});


export type IOrganization = z.infer<typeof OrganizationSchema> & {
    _id?: string | any;
};
