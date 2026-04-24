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

