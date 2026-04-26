import { z } from "zod";

// Shared username schema with specific validation
export const usernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(20, "Username must be at most 20 characters")
  .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers and underscores");

export const badgeTypeEnum = z.enum(["hackathon", "gsoc", "open_source", "certification", "award"]);

export const chapterSchema = z.object({
  name: z.string(),
  acronym: z.string(),
  position: z.string().optional().or(z.literal("")),
  start_date: z.string().optional().or(z.literal("")),
  end_date: z.string().optional().or(z.literal("")),
});

export const socialLinkSchema = z.object({
  label: z.string().optional().or(z.literal("")),
  link: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
});

export const achievementSchema = z.object({
  title: z.string().optional().or(z.literal("")),
  badge_type: badgeTypeEnum.optional().default("hackathon"),
  date: z.string().optional().or(z.literal("")),
});

export const projectSchema = z.object({
  title: z.string().optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
  link: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
  tags: z.array(z.string()).default([]),
});

export const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  username: usernameSchema,
  email: z.string().email("Invalid email"),
  image: z.string().optional().or(z.literal("")),
  current_status: z.string().max(100, "Status must be at most 100 characters").optional().or(z.literal("")),
  bio: z.string().max(500, "Bio must be at most 500 characters").optional().or(z.literal("")),
  chapters: z.array(chapterSchema).default([]),
  social_links: z.array(socialLinkSchema).default([]),
  stats: z.record(z.string(), z.string()).default({}),
  achievements: z.array(achievementSchema).default([]),
  projects: z.array(projectSchema).default([]),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
