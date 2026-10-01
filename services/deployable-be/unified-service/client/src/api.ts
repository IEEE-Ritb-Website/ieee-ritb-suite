import axios, { type AxiosInstance } from "axios";

export const createApi = (baseURL: string): AxiosInstance => {
    return axios.create({
        baseURL,
        timeout: 10000,
        headers: {
            "Content-Type": "application/json",
        },
    });
};
