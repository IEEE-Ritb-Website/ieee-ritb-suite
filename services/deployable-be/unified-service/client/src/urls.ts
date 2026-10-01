import type { AxiosInstance } from "axios";
import { URLS_MOUNT } from "./mounts.js";

export interface CreateShortUrlRequest {
    long_url: string;
    ttl_seconds: number | null;
    code?: string;
}

export interface CreateShortUrlResponse {
    success: true;
    data: {
        long_url: string;
        created_at: string;
        expires_at: string;
        ttl_seconds: number;
        short_url: string;
    };
    message: string;
}

export class UrlsClient {
    constructor(private readonly api: AxiosInstance) {}

    async createShortUrl(payload: CreateShortUrlRequest): Promise<CreateShortUrlResponse> {
        const { data } = await this.api.post<CreateShortUrlResponse>(`${URLS_MOUNT}/shorten-url`, payload);
        return data;
    }
}
