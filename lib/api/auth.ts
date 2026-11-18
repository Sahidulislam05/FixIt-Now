import { apiRequest } from "./client";
import type { ApiSuccessResponse, Role, User } from "../types";

export interface LoginPayload {
    email: string;
    password: string;
}

export interface LoginResponseData {
    accessToken: string;
    refreshToken: string;
}

export function login(payload: LoginPayload) {
    return apiRequest<ApiSuccessResponse<LoginResponseData>>("/api/auth/login", {
        method: "POST",
        body: payload,
        auth: false,
    });
}

export interface RegisterPayload {
    name: string;
    email: string;
    password: string;
    phone?: string;
    role?: Extract<Role, "CUSTOMER" | "TECHNICIAN">;
}

export function registerUser(payload: RegisterPayload) {
    return apiRequest<ApiSuccessResponse<{ user: User }>>("/api/users/register", {
        method: "POST",
        body: payload,
        auth: false,
    });
}

export function refreshAccessToken() {
    return apiRequest<ApiSuccessResponse<{ accessToken: string }>>("/api/auth/refresh-token", {
        method: "POST",
        auth: false,
    });
}
