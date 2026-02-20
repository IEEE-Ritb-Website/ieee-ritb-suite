import { AxiosInstance } from "axios";
import { CreateShortUrlRequest, CreateShortUrlResponse } from "./types";

export type CreateShortUrlPayload = CreateShortUrlRequest;

export const createShortUrl =
  (api: AxiosInstance) =>
  async (
    payload: CreateShortUrlPayload
  ): Promise<CreateShortUrlResponse> => {
    const response = await api.post<CreateShortUrlResponse>(
      "/api/shorten-url",
      payload
    );

    return response.data;
  };
