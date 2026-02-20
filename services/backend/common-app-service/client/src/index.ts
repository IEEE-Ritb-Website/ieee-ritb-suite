import { API } from "./api";
import { createShortUrl } from "./shortUrl";

export const createClient = (baseURL: string) => {
  const api = API(baseURL);

  return {
    createShortUrl: createShortUrl(api),
  };
};

export * from "./types";
