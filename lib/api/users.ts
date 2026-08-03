import { apiRequest } from "./client";
import type { ApiSuccessResponse, User } from "../types";

export function getMyProfile() {
    return apiRequest<ApiSuccessResponse<{ profile: User }>>("/api/users/me");
}

export interface UpdateProfilePayload {
    name?: string;
    phone?: string;
}

export function updateMyProfile(payload: UpdateProfilePayload) {
    return apiRequest<ApiSuccessResponse<{ updatedProfile: User }>>("/api/users/my-profile", {
        method: "PUT",
        body: payload,
    });
}
