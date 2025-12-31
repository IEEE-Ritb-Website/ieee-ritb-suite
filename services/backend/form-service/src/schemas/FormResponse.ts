import { z } from "zod";


export const FormResponseSchema = z.object({

    eventId: z.string(),
    eventTitle: z.string(),
    eventSlug: z.string(),


    registrationType: z.enum(["individual", "team"]),


    formData: z.record(z.string(), z.any()),


    submittedAt: z.date().default(() => new Date()),
    ipAddress: z.string().optional(),
    userAgent: z.string().optional(),


    status: z.enum(["pending", "approved", "rejected", "waitlisted"]).default("pending"),


    approvalStatus: z.object({
        approvedAt: z.date().optional(),
        approvedBy: z.string().optional(),
        rejectionReason: z.string().optional(),
    }).optional(),


    contactEmail: z.string().email(),
    contactName: z.string(),
    contactPhone: z.string().optional(),


    teamInfo: z.object({
        teamName: z.string(),
        teamSize: z.number().int().positive(),
        teamMembers: z.array(z.any()).optional(),
    }).optional(),


    createdAt: z.date().default(() => new Date()),
    updatedAt: z.date().default(() => new Date()),
});


export type IFormResponse = z.infer<typeof FormResponseSchema> & {
    _id?: string | any;
};
