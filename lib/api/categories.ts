import { apiRequest } from "./client";
import type { ApiSuccessResponse, Category } from "../types";

export function getAllCategories(searchTerm?: string) {
    return apiRequest<ApiSuccessResponse<{ categories: Category[] }>>("/api/categories", {
        query: { searchTerm },
        auth: false,
    });
}

export function getCategoryById(id: string) {
    return apiRequest<ApiSuccessResponse<{ category: Category }>>(`/api/categories/${id}`, {
        auth: false,
    });
}

export interface CreateCategoryPayload {
    name: string;
    description?: string;
    icon?: string;
}

export function createCategory(payload: CreateCategoryPayload) {
    return apiRequest<ApiSuccessResponse<{ category: Category }>>("/api/categories", {
        method: "POST",
        body: payload,
    });
}

export function updateCategory(id: string, payload: Partial<CreateCategoryPayload>) {
    return apiRequest<ApiSuccessResponse<{ updatedCategory: Category }>>(`/api/categories/${id}`, {
        method: "PATCH",
        body: payload,
    });
}
