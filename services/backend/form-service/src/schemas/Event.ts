import { z } from "zod";


export const PhysicalVenueSchema = z.object({
    name: z.string(),
    address: z.string(),
    city: z.string(),
    state: z.string(),
    pincode: z.string(),
    mapLink: z.string().url().optional(),
    capacity: z.number().int().positive().optional(),
});

export const VirtualVenueSchema = z.object({
    platform: z.string(),
    link: z.string().url().optional(),
    meetingId: z.string().optional(),
});

export const VenueSchema = z.object({
    type: z.enum(["physical", "virtual", "hybrid"]),
    physical: PhysicalVenueSchema.optional(),
    virtual: VirtualVenueSchema.optional(),
});


export const TeamConfigSchema = z.object({
    minSize: z.number().int().positive(),
    maxSize: z.number().int().positive(),
    allowMixedInstitutions: z.boolean().default(true),
    requireTeamName: z.boolean().default(true),
});


export const RegistrationConfigSchema = z.object({
    type: z.enum(["individual", "team", "both"]),
    team: TeamConfigSchema.optional(),
    maxParticipants: z.number().int().positive().optional(),
    maxTeams: z.number().int().positive().optional(),
    allowedDepartments: z.array(z.string()).optional(),
    allowedYears: z.array(z.number().int().min(1).max(4)).optional(),
    requireIEEEMembership: z.boolean().default(false),
    allowExternalParticipants: z.boolean().default(true),
    requireApproval: z.boolean().default(false),
    autoApprove: z.boolean().default(true),
});


export const AdditionalQuestionSchema = z.object({
    question: z.string(),
    type: z.enum(["text", "textarea", "select", "multiselect", "file"]),
    required: z.boolean(),
    options: z.array(z.string()).optional(),
});

export const DefaultFieldsSchema = z.object({
    collectPhone: z.boolean().default(true),
    collectDepartment: z.boolean().default(false),
    collectYear: z.boolean().default(false),
    collectUSN: z.boolean().default(false),
    collectInstitution: z.boolean().default(false),
    collectResume: z.boolean().default(false),
    collectIdCard: z.boolean().default(false),
    additionalQuestions: z.array(AdditionalQuestionSchema).optional(),
});

export const FormConfigSchema = z.object({
    useCustomForm: z.boolean(),
    formId: z.string().optional(),
    defaultFields: DefaultFieldsSchema.optional(),
});


export const MediaSchema = z.object({
    banner: z.string().url(),
    thumbnail: z.string().url(),
    gallery: z.array(z.string().url()).optional(),
    videoUrl: z.string().url().optional(),
});


export const ContactSchema = z.object({
    name: z.string(),
    role: z.string(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
});


export const StatsSchema = z.object({
    totalRegistrations: z.number().int().nonnegative().default(0),
    totalTeams: z.number().int().nonnegative().default(0),
    viewCount: z.number().int().nonnegative().default(0),
});


export const SettingsSchema = z.object({
    allowWaitlist: z.boolean().default(false),
    certificateTemplate: z.string().optional(),
    requireCheckIn: z.boolean().default(false),
});


export const EventSchema = z.object({
    title: z.string().min(3),
    slug: z.string().min(3),
    description: z.string(),
    shortDescription: z.string(),


    organizationId: z.string(),
    organizationType: z.enum(["chapter", "student-branch", "society"]),


    eventType: z.enum([
        "seminar",
        "workshop",
        "competition",
        "hackathon",
        "conference",
        "webinar",
        "social",
        "other",
    ]),
    category: z.array(z.string()),
    tags: z.array(z.string()),


    startDate: z.date(),
    endDate: z.date(),
    registrationOpenDate: z.date(),
    registrationCloseDate: z.date(),
    timezone: z.string().default("Asia/Kolkata"),


    venue: VenueSchema,


    registrationConfig: RegistrationConfigSchema,
    formConfig: FormConfigSchema,


    media: MediaSchema,


    contacts: z.array(ContactSchema),


    status: z.enum(["draft", "published", "ongoing", "completed", "cancelled"]),
    visibility: z.enum(["public", "private", "organization-only"]),


    createdByEmail: z.string().email(),
    createdAt: z.date().default(() => new Date()),
    updatedAt: z.date().default(() => new Date()),
    publishedAt: z.date().optional(),


    stats: StatsSchema.optional().default({
        totalRegistrations: 0,
        totalTeams: 0,
        viewCount: 0,
    }),


    settings: SettingsSchema.optional().default({
        allowWaitlist: false,
        requireCheckIn: false,
    }),
});


export type IPhysicalVenue = z.infer<typeof PhysicalVenueSchema>;
export type IVirtualVenue = z.infer<typeof VirtualVenueSchema>;
export type IVenue = z.infer<typeof VenueSchema>;
export type ITeamConfig = z.infer<typeof TeamConfigSchema>;
export type IRegistrationConfig = z.infer<typeof RegistrationConfigSchema>;
export type IAdditionalQuestion = z.infer<typeof AdditionalQuestionSchema>;
export type IDefaultFields = z.infer<typeof DefaultFieldsSchema>;
export type IFormConfig = z.infer<typeof FormConfigSchema>;
export type IMedia = z.infer<typeof MediaSchema>;
export type IContact = z.infer<typeof ContactSchema>;
export type IStats = z.infer<typeof StatsSchema>;
export type ISettings = z.infer<typeof SettingsSchema>;
export type IEvent = z.infer<typeof EventSchema> & {
    _id?: string | any;
};
