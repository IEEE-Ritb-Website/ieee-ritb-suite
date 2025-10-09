import { z } from "zod";

export const ChapterSchema = z.object({
    name: z.string(),
    acronym: z.string(),
    type: z.enum(["tech", "non-tech"]),
    shortDescription: z.string(),
    imagePath: z.string()
});
export const ChapterResponseSchema = z.array(ChapterSchema);
export type IChapter = z.infer<typeof ChapterSchema>;
