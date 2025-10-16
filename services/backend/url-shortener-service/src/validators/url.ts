import { z } from "zod";

export const shortenBody = z.object({
    long_url: z.string().min(1, "long_url is required"),
    ttl_seconds: z.number().int().positive().optional(),
    custom_alias: z.string().regex(/^[0-9a-zA-Z_-]{3,32}$/).optional(),
});

export type ShortenBody = z.infer<typeof shortenBody>;

export function normalizeUrl(input: string): string | null {
    try {
        const u = new URL(input);
        if (u.protocol !== "http:" && u.protocol !== "https:") return null;
        u.hash = "";
        u.host = u.host.toLowerCase();
        return u.toString();
    } catch {
        return null;
    }
}


