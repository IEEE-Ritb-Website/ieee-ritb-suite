import { AxiosInstance } from "axios";
import { API } from "./api";
import * as T from "./types";

export const getEventById =
  (api: AxiosInstance) =>
  async (eventId: string): Promise<any> => {
    const response = await api.get<any>(`/events/${eventId}`);
    return response.data;
  };

export const getEventBySlug =
  (api: AxiosInstance) =>
  async (slug: string): Promise<any> => {
    const response = await api.get<any>(`/events/slug/${slug}`);
    return response.data;
  };

export const getFormModelByEventId =
  (api: AxiosInstance) =>
  async (eventId: string): Promise<any> => {
    const response = await api.get<any>(`/events/${eventId}/form-model`);
    return response.data;
  };

export const getFormModelBySlug =
  (api: AxiosInstance) =>
  async (slug: string): Promise<any> => {
    const response = await api.get<any>(`/events/slug/${slug}/form-model`);
    return response.data;
  };

export const getPing = (api: AxiosInstance) => async (): Promise<any> => {
  const response = await api.get<any>("/ping");
  return response.data;
};

export const listEvents = (api: AxiosInstance) => async (): Promise<any> => {
  const response = await api.get<any>("/events");
  return response.data;
};

export const submitFormResponse =
  (api: AxiosInstance) =>
  async (eventId: string): Promise<any> => {
    const response = await api.post<any>(`/events/${eventId}/submit`);
    return response.data;
  };

export const createClient = (baseURL: string) => {
  const api = API(baseURL);

  return {
    getEventById: getEventById(api),
    getEventBySlug: getEventBySlug(api),
    getFormModelByEventId: getFormModelByEventId(api),
    getFormModelBySlug: getFormModelBySlug(api),
    getPing: getPing(api),
    listEvents: listEvents(api),
    submitFormResponse: submitFormResponse(api),
  };
};

export * from "./types";
