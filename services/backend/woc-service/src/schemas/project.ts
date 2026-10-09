import { z } from "zod";


export const StipendDetailsSchema = z.object({
    type: z.enum(["fixed", "range", "performance", "unpaid"]).default("unpaid"),
    amount: z.number().nonnegative().optional(),
    minAmount: z.number().nonnegative().optional(),
    maxAmount: z.number().nonnegative().optional(),
    currency: z.string().default("INR"),
    notes: z.string().optional(),
});

export const SkillSchema = z.object({
    name: z.string().min(1),
    level: z.enum(["beginner", "intermediate", "advanced"]).optional(),
});

export const DeliverableSchema = z.object({
    title: z.string().min(3),
    description: z.string().optional(),
});

export const MentorSchema = z.object({
    name: z.string().min(2),
    email: z.string().email().optional(),
    profileUrl: z.string().url().optional(),
});

export const DurationSchema = z.object({
    value: z.number().int().positive(),
    unit: z.enum(["days", "weeks", "months"]),
});

export const EligibilitySchema = z.object({
    description: z.string().optional(),
    allowedYears: z.array(z.number().int().min(1).max(4)).optional(),
    requireIEEEMembership: z.boolean().default(false),
});

export const ProjectSchema = z.object({
    title: z.string().min(3),
    slug: z.string().min(3),
    shortDesc: z.string().min(10).max(300),
    longDesc: z.string().min(20),

    stipendDetails: StipendDetailsSchema.optional(),
    skills: z.array(SkillSchema).min(1),
    deliverables: z.array(DeliverableSchema).default([]),
    mentor: MentorSchema.optional(),
    duration: DurationSchema.optional(),
    difficulty: z.enum(["beginner", "intermediate", "advanced"]).optional(),
    eligibility: EligibilitySchema.optional(),
    applicationDeadline: z.coerce.date().optional(),

    organizationId: z.string().min(1),

    status: z.enum(["draft", "published", "closed"]).default("draft"),
    tags: z.array(z.string()).default([]),


    createdAt: z.date().default(() => new Date()),
    updatedAt: z.date().default(() => new Date()),
});


export type IStipendDetails = z.infer<typeof StipendDetailsSchema>;
export type ISkill = z.infer<typeof SkillSchema>;
export type IDeliverable = z.infer<typeof DeliverableSchema>;
export type IMentor = z.infer<typeof MentorSchema>;
export type IDuration = z.infer<typeof DurationSchema>;
export type IEligibility = z.infer<typeof EligibilitySchema>;
export type IProject = z.infer<typeof ProjectSchema> & {
    _id?: string | any;
};
