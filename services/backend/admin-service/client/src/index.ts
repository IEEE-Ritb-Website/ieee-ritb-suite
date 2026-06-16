import { AxiosInstance } from "axios";
import { API } from "./api";
import * as T from "./types";

export const changePassword =
  (api: AxiosInstance) =>
  async (
    payload?: T.ChangePasswordRequest,
  ): Promise<T.ChangePasswordResponse> => {
    const response = await api.post<T.ChangePasswordResponse>(
      "/auth/change-password",
      payload?.body,
      { params: payload?.query },
    );
    return response.data;
  };

export const createChapter =
  (api: AxiosInstance) =>
  async (
    payload?: T.CreateChapterRequest,
  ): Promise<T.CreateChapterResponse> => {
    const response = await api.post<T.CreateChapterResponse>(
      "/create-new-chapter",
      payload?.body,
      { params: payload?.query },
    );
    return response.data;
  };

export const createChapterAdmin =
  (api: AxiosInstance) =>
  async (
    payload?: T.CreateChapterAdminRequest,
  ): Promise<T.CreateChapterAdminResponse> => {
    const response = await api.post<T.CreateChapterAdminResponse>(
      "/auth/create-chapter-admin",
      payload?.body,
      { params: payload?.query },
    );
    return response.data;
  };

export const createChapterExecom =
  (api: AxiosInstance) =>
  async (
    payload?: T.CreateChapterExecomRequest,
  ): Promise<T.CreateChapterExecomResponse> => {
    const response = await api.post<T.CreateChapterExecomResponse>(
      "/auth/create-execom",
      payload?.body,
      { params: payload?.query },
    );
    return response.data;
  };

export const getAuthMe = (api: AxiosInstance) => async (): Promise<any> => {
  const response = await api.get<any>("/auth/me");
  return response.data;
};

export const signIn =
  (api: AxiosInstance) =>
  async (payload?: T.SignInRequest): Promise<T.SignInResponse> => {
    const response = await api.post<T.SignInResponse>(
      "/auth/sign-in",
      payload?.body,
      { params: payload?.query },
    );
    return response.data;
  };

export const createClient = (baseURL: string) => {
  const api = API(baseURL);

  return {
    changePassword: changePassword(api),
    createChapter: createChapter(api),
    createChapterAdmin: createChapterAdmin(api),
    createChapterExecom: createChapterExecom(api),
    getAuthMe: getAuthMe(api),
    signIn: signIn(api),
  };
};

export * from "./types";
