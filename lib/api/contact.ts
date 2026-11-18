import { apiRequest } from "./client";
import type { ApiSuccessResponse } from "../types";

export interface ContactMessagePayload {
    name: string;
    email: string;
    subject: string;
    message: string;
}

export function sendContactMessage(payload: ContactMessagePayload) {
    return apiRequest<ApiSuccessResponse<{ id: string; createdAt: string }>>("/api/contact", {
        method: "POST",
        body: payload,
        auth: false,
    });
}
