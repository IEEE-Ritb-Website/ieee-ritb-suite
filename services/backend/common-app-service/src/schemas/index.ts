import { BASE62_ALPHABET } from "@/utils/urlShortener";
import { z } from "zod";

export const ShortUrlSchema = z.object({
  code: z.string().min(4).max(8).refine((val) => val.split("").every((ch) => BASE62_ALPHABET.includes(ch)), {
    message: "Code must be 4-8 characters long and only contain Base62 characters (0-9, A-Z, a-z)",
  }),
  long_url: z.url(),
  ttl_seconds: z.number().positive().nullable(),
  created_at: z.date(),
  expires_at: z.date().nullable(),
});

export type IShortUrl = z.infer<typeof ShortUrlSchema>;
