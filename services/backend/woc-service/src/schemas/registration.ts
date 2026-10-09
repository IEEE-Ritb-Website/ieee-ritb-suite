import { z } from "zod";


export const ParticipantSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().optional(),
    usn: z.string().optional(),
    department: z.string().optional(),
    year: z.number().int().min(1).max(4).optional(),
    institution: z.string().optional(),
});

export const ProposalSchema = z.object({
    statement: z.string().min(20),
    githubUrl: z.string().url().optional(),
    portfolioUrl: z.string().url().optional(),
});

export const RegistrationSchema = z.object({
    projectId: z.string().min(1),
    projectTitle: z.string(),
    projectSlug: z.string(),

    participant: ParticipantSchema,
    proposal: ProposalSchema,


    status: z.enum(["pending", "approved", "rejected", "waitlisted"]).default("pending"),


    submittedAt: z.date().default(() => new Date()),
    ipAddress: z.string().optional(),
    userAgent: z.string().optional(),


    createdAt: z.date().default(() => new Date()),
    updatedAt: z.date().default(() => new Date()),
});


export type IParticipant = z.infer<typeof ParticipantSchema>;
export type IProposal = z.infer<typeof ProposalSchema>;
export type IRegistration = z.infer<typeof RegistrationSchema> & {
    _id?: string | any;
};
