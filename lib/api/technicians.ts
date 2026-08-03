import { apiRequest, type QueryValue } from "./client";
import type { ApiSuccessResponse, DayOfWeek, TechnicianAvailability, TechnicianProfile, User } from "../types";

export interface TechnicianQuery {
    searchTerm?: string;
    categoryId?: string;
    minRating?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    [key: string]: QueryValue;
}

export function getAllTechnicians(query: TechnicianQuery = {}) {
    return apiRequest<ApiSuccessResponse<User[]>>("/api/technicians", {
        query,
        auth: false,
    });
}

export function getTechnicianById(id: string) {
    return apiRequest<ApiSuccessResponse<{ technician: User }>>(`/api/technicians/${id}`, {
        auth: false,
    });
}

export interface UpdateTechnicianProfilePayload {
    bio?: string;
    experienceYears?: number;
    skills?: string[];
}

export function updateMyTechnicianProfile(payload: UpdateTechnicianProfilePayload) {
    return apiRequest<ApiSuccessResponse<{ updatedProfile: TechnicianProfile }>>("/api/technician/profile", {
        method: "PUT",
        body: payload,
    });
}

export interface AvailabilitySlotInput {
    dayOfWeek: DayOfWeek;
    startTime: string;
    endTime: string;
    isActive?: boolean;
}

export function setMyAvailability(slots: AvailabilitySlotInput[]) {
    return apiRequest<ApiSuccessResponse<{ availabilities: TechnicianAvailability[] }>>(
        "/api/technician/availability",
        {
            method: "PUT",
            body: { slots },
        }
    );
}

export function getMyAvailability() {
    return apiRequest<ApiSuccessResponse<{ availabilities: TechnicianAvailability[] }>>(
        "/api/technician/availability"
    );
}
