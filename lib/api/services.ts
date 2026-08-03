import { apiRequest, type QueryValue } from "./client";
import type { ApiSuccessResponse, Service } from "../types";

export interface ServiceQuery {
    searchTerm?: string;
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
    location?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    [key: string]: QueryValue;
}

export function getAllServices(query: ServiceQuery = {}) {
    return apiRequest<ApiSuccessResponse<Service[]>>("/api/services", {
        query,
        auth: false,
    });
}

export function getMyServices() {
    return apiRequest<ApiSuccessResponse<{ services: Service[] }>>("/api/services/my-services");
}

export function getServiceById(id: string) {
    return apiRequest<ApiSuccessResponse<{ service: Service }>>(`/api/services/${id}`, {
        auth: false,
    });
}

export interface CreateServicePayload {
    categoryId: string;
    title: string;
    description?: string;
    price: number;
    location?: string;
}

export function createService(payload: CreateServicePayload) {
    return apiRequest<ApiSuccessResponse<{ service: Service }>>("/api/services", {
        method: "POST",
        body: payload,
    });
}

export function updateMyService(id: string, payload: Partial<CreateServicePayload & { isActive: boolean }>) {
    return apiRequest<ApiSuccessResponse<{ updatedService: Service }>>(`/api/services/${id}`, {
        method: "PATCH",
        body: payload,
    });
}

export function deleteMyService(id: string) {
    return apiRequest<ApiSuccessResponse<null>>(`/api/services/${id}`, {
        method: "DELETE",
    });
}
