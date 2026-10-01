import type { AxiosInstance } from "axios";
import { ADMIN_MOUNT } from "./mounts.js";

export interface SignInPayload {
    email: string;
    password: string;
}

export interface AuthUser {
    id: string;
    email: string;
    name: string;
    emailVerified: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface SignInResponse {
    success: true;
    message: string;
    redirect: boolean;
    url?: string;
    token: string;
    user: AuthUser;
}

export interface CreateChapterAdminPayload {
    email: string;
    name: string;
    password: string;
    chapter: string;
}

export interface CreateExecomPayload {
    email: string;
    name: string;
    password: string;
}

export interface ChangePasswordPayload {
    email: string;
    newPassword: string;
}

export interface CreateChapterPayload {
    name: string;
    logo: string;
    chapterType: string;
    shortDescription: string;
    faculty?: string;
    facultyImage?: string;
}

export interface MessageResponse {
    success: true;
    message: string;
}

export interface SessionResponse {
    user: AuthUser & Record<string, unknown>;
    session: Record<string, unknown>;
}

export class AdminClient {
    constructor(private readonly api: AxiosInstance) {}

    async me(): Promise<SessionResponse | null> {
        const { data } = await this.api.get<SessionResponse | null>(`${ADMIN_MOUNT}/auth/me`);
        return data;
    }

    async signIn(payload: SignInPayload): Promise<SignInResponse> {
        const { data } = await this.api.post<SignInResponse>(`${ADMIN_MOUNT}/auth/sign-in`, payload);
        return data;
    }

    async createChapterAdmin(payload: CreateChapterAdminPayload): Promise<MessageResponse> {
        const { data } = await this.api.post<MessageResponse>(`${ADMIN_MOUNT}/auth/create-chapter-admin`, payload);
        return data;
    }

    async createExecom(payload: CreateExecomPayload): Promise<MessageResponse> {
        const { data } = await this.api.post<MessageResponse>(`${ADMIN_MOUNT}/auth/create-execom`, payload);
        return data;
    }

    async changePassword(payload: ChangePasswordPayload): Promise<MessageResponse> {
        const { data } = await this.api.post<MessageResponse>(`${ADMIN_MOUNT}/auth/change-password`, payload);
        return data;
    }

    async createChapter(payload: CreateChapterPayload): Promise<MessageResponse> {
        const { data } = await this.api.post<MessageResponse>(`${ADMIN_MOUNT}/create-new-chapter`, payload);
        return data;
    }
}
