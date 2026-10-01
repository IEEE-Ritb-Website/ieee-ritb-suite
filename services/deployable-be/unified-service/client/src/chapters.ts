import type { AxiosInstance } from "axios";
import { CHAPTERS_MOUNT } from "./mounts.js";

export interface Chapter {
    name: string;
    type: string;
    acronym: string;
    shortDescription: string;
    logoUrl: string;
}

export interface GetChaptersParams {
    name?: string;
    acronym?: string;
    type?: string;
}

export interface GetChaptersResponse {
    success: true;
    data: Chapter[];
}

export interface TeamMember {
    name: string;
    image: string | null;
    username: string;
    chapters: {
        name: string;
        acronym: string;
        position: string;
    }[];
    department: string;
    year: string;
    term: string;
}

export interface GetUsersParams {
    limit?: number;
    offset?: number;
    position?: string;
    chapters?: string;
    onlySeniorPositions?: boolean;
    onlyJuniorPositions?: boolean;
    onlyExecoms?: boolean;
}

export interface GetUsersResponse {
    success: true;
    data: TeamMember[];
    message?: string;
}

export class ChaptersClient {
    constructor(private readonly api: AxiosInstance) {}

    async getChapters(params: GetChaptersParams = {}): Promise<GetChaptersResponse> {
        const { data } = await this.api.get<GetChaptersResponse>(`${CHAPTERS_MOUNT}/chapters`, { params });
        return data;
    }

    async getUsers(params: GetUsersParams = {}): Promise<GetUsersResponse> {
        const { data } = await this.api.get<GetUsersResponse>(`${CHAPTERS_MOUNT}/users`, { params });
        return data;
    }
}
