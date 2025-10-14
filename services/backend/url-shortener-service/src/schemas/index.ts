import { z } from "zod";

export const ShortUrlSchema = z.object({
  // TODO: 
  long_url: z.string().url(),
  short_url: z.string().url(),
  created_at: z.string().optional(),
  expires_at: z.string().optional(),
});

export type IShortUrl = z.infer<typeof ShortUrlSchema>;
