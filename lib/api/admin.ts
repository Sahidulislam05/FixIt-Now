import { apiRequest, type QueryValue } from "./client";
import type {
  ActiveStatus,
  ApiSuccessResponse,
  Booking,
  Category,
  Role,
  User,
} from "../types";

export interface AdminUserQuery {
  searchTerm?: string;
  role?: Role;
  activeStatus?: ActiveStatus;
  page?: number;
  limit?: number;
  [key: string]: QueryValue;
}

export function getAllUsers(query: AdminUserQuery = {}) {
  return apiRequest<ApiSuccessResponse<User[]>>("/api/admin/users", { query });
}

export function updateUserStatus(userId: string, activeStatus: ActiveStatus) {
  return apiRequest<ApiSuccessResponse<{ updatedUser: User }>>(
    `/api/admin/users/${userId}`,
    {
      method: "PATCH",
      body: { activeStatus },
    },
  );
}

export interface AdminBookingQuery {
  status?: string;
  page?: number;
  limit?: number;
  [key: string]: QueryValue;
}

export function getAllBookings(query: AdminBookingQuery = {}) {
  return apiRequest<ApiSuccessResponse<Booking[]>>("/api/admin/bookings", {
    query,
  });
}

// থিন alias — একই categoryService, শুধু /api/admin/categories path
export function getAllCategoriesAdmin() {
  return apiRequest<ApiSuccessResponse<{ categories: Category[] }>>(
    "/api/admin/categories",
  );
}

export function createCategoryAdmin(payload: {
  name: string;
  description?: string;
  icon?: string;
}) {
  return apiRequest<ApiSuccessResponse<{ category: Category }>>(
    "/api/admin/categories",
    {
      method: "POST",
      body: payload,
    },
  );
}

export function updateCategoryAdmin(
  id: string,
  payload: { name?: string; description?: string; icon?: string },
) {
  return apiRequest<ApiSuccessResponse<{ updatedCategory: Category }>>(
    `/api/admin/categories/${id}`,
    {
      method: "PATCH",
      body: payload,
    },
  );
}
