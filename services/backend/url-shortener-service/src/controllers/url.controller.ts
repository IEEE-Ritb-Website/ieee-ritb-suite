import { Request, Response } from "express";
import { env } from "../configs/env";
import { getCollections, nextSeq } from "../db/mongo";
import { toBase62 } from "../utils/base62";
import { shortenBody, normalizeUrl } from "../validators/url";

export async function createShortUrl(req: Request, res: Response) {
    const parsed = shortenBody.safeParse(req.body ?? {});
    if (!parsed.success) {
        return res.status(400).json({ error: "invalid_body", issues: parsed.error.issues });
    }

    const { long_url, ttl_seconds, custom_alias } = parsed.data;
    const normalized = normalizeUrl(long_url);
    if (!normalized) return res.status(400).json({ error: "invalid_url" });

    const { urls } = await getCollections();

    if (custom_alias) {
        const exists = await urls.findOne({ code: custom_alias }, { projection: { _id: 1 } });
        if (exists) return res.status(409).json({ error: "alias_taken" });

        await urls.insertOne({
            code: custom_alias,
            long_url: normalized,
            created_at: new Date(),
            expires_at: ttl_seconds ? new Date(Date.now() + ttl_seconds * 1000) : null,
        });

        return res.json({ code: custom_alias, short_url: `${env.BASE_URL}/${custom_alias}` });
    }

    const seq = await nextSeq();
    const code = toBase62(seq);

    await urls.insertOne({
        code,
        long_url: normalized,
        created_at: new Date(),
        expires_at: ttl_seconds ? new Date(Date.now() + ttl_seconds * 1000) : null,
    });

    return res.json({ code, short_url: `${env.BASE_URL}/${code}` });
}

export async function redirectByCode(req: Request, res: Response) {
    const code = req.params.code;
    const { urls } = await getCollections();

    const doc = await urls.findOne({ code }, { projection: { long_url: 1 } });
    if (!doc) return res.status(404).send("Not found");

    return res.redirect(302, doc.long_url);
}


