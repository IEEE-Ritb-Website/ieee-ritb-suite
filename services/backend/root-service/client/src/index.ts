import { AxiosInstance } from "axios";
import { API } from "./api";
import * as T from "./types";

export const getChapters =
  (api: AxiosInstance) =>
  async (payload?: T.GetChaptersRequest): Promise<T.GetChaptersResponse> => {
    const response = await api.get<T.GetChaptersResponse>("/chapters", {
      params: payload?.query,
    });
    return response.data;
  };

export const getUsers =
  (api: AxiosInstance) =>
  async (payload?: T.GetUsersRequest): Promise<T.GetUsersResponse> => {
    const response = await api.get<T.GetUsersResponse>("/users", {
      params: payload?.query,
    });
    return response.data;
  };

export const createClient = (baseURL: string) => {
  const api = API(baseURL);

  return {
    getChapters: getChapters(api),
    getUsers: getUsers(api),
  };
};

export * from "./types";
