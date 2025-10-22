import { z } from "zod";

export const ShortUrlSchema = z.object({
  code: z.string().min(4).max(8),
  long_url: z.url(),
  ttl_seconds: z.number().positive().nullable(),
  created_at: z.date(),
  expires_at: z.date().nullable(),
});

export type IShortUrl = z.infer<typeof ShortUrlSchema>;
