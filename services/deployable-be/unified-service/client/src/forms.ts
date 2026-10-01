import type { AxiosInstance } from "axios";
import { FORMS_MOUNT } from "./mounts.js";

export type EventRecord = Record<string, unknown> & {
    title: string;
    slug: string;
};

export interface ListEventsParams {
    status?: string;
    eventType?: string;
    page?: number;
    limit?: number;
}

export interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface FormsDataResponse<T> {
    success: true;
    data: T;
    message?: string;
}

export interface FormField {
    name: string;
    type: string;
    label: string;
    required: boolean;
    placeholder?: string;
    options?: string[];
}

export interface FormModel {
    eventId: string;
    eventTitle: string;
    eventSlug: string;
    registrationType: string;
    fields: FormField[];
    status: {
        isPublished: boolean;
        isRegistrationOpen: boolean;
        eventStatus: string;
    };
}

export class FormsClient {
    constructor(private readonly api: AxiosInstance) {}

    async ping(): Promise<{ message: string; timestamp: string }> {
        const { data } = await this.api.get(`${FORMS_MOUNT}/ping`);
        return data;
    }

    async listEvents(params: ListEventsParams = {}): Promise<FormsDataResponse<{ events: EventRecord[]; pagination: Pagination }>> {
        const { data } = await this.api.get(`${FORMS_MOUNT}/events`, { params });
        return data;
    }

    async getEventById(eventId: string): Promise<FormsDataResponse<EventRecord>> {
        const { data } = await this.api.get(`${FORMS_MOUNT}/events/${eventId}`);
        return data;
    }

    async getEventBySlug(slug: string): Promise<FormsDataResponse<EventRecord>> {
        const { data } = await this.api.get(`${FORMS_MOUNT}/events/slug/${slug}`);
        return data;
    }

    async getFormModelByEventId(eventId: string): Promise<FormsDataResponse<FormModel>> {
        const { data } = await this.api.get(`${FORMS_MOUNT}/events/${eventId}/form-model`);
        return data;
    }

    async getFormModelBySlug(slug: string): Promise<FormsDataResponse<FormModel>> {
        const { data } = await this.api.get(`${FORMS_MOUNT}/events/slug/${slug}/form-model`);
        return data;
    }

    async submit(eventId: string, payload: Record<string, unknown>): Promise<FormsDataResponse<Record<string, unknown>>> {
        const { data } = await this.api.post(`${FORMS_MOUNT}/events/${eventId}/submit`, payload);
        return data;
    }
}
