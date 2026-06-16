export interface CreateShortUrlRequest {
  params?: Record<string, never>;
  query?: Record<string, never>;
  body?: {
    long_url: string;
    ttl_seconds: number | null;
    code?: string;
  };
}

export interface CreateShortUrlResponse {
  success: true;
  data: {
    long_url: string;
    created_at: string;
    expires_at: string | null;
    ttl_seconds: number | null;
    short_url: string;
  };
  message: string;
}
