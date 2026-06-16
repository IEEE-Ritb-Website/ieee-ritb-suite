import { AxiosInstance } from "axios";
import { API } from "./api";
import * as T from "./types";

export const createShortUrl =
  (api: AxiosInstance) =>
  async (
    payload?: T.CreateShortUrlRequest,
  ): Promise<T.CreateShortUrlResponse> => {
    const response = await api.post<T.CreateShortUrlResponse>(
      "/api/shorten-url",
      payload?.body,
      { params: payload?.query },
    );
    return response.data;
  };

export const createCommonAppServiceAPIClient = (baseURL: string) => {
  const api = API(baseURL);

  return {
    createShortUrl: createShortUrl(api),
  };
};

export * from "./types";
