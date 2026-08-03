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
    // ⚠️ নোট: ব্যাকএন্ডের এই route এখন req.cookies.refreshToken পড়ে (httpOnly cookie,
    // ব্যাকএন্ডের নিজের ডোমেইনে সেট হয়)। যেহেতু আমরা cross-origin Bearer-token
    // architecture ব্যবহার করছি (credentials: "include" পাঠাচ্ছি না), এই cookie
    // ব্যাকএন্ড পর্যন্ত পৌঁছাবে না — এই ফাংশনটা এখনো কাজ করবে না।
    // পরে (auto-refresh-on-401 বসানোর সময়) ব্যাকএন্ডে ছোট একটা আপডেট লাগবে —
    // refreshToken cookie-র পাশাপাশি request body থেকেও নেওয়ার সাপোর্ট যোগ করা।
    // আপাতত accessToken এর মেয়াদ ১ দিন বলে re-login-ই যথেষ্ট।
    return apiRequest<ApiSuccessResponse<{ accessToken: string }>>("/api/auth/refresh-token", {
        method: "POST",
        auth: false,
    });
}
