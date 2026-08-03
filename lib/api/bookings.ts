import { apiRequest, type QueryValue } from "./client";
import type { ApiSuccessResponse, Booking, BookingStatus } from "../types";

export interface CreateBookingPayload {
    serviceId: string;
    scheduledDate: string; // ISO string
    address: string;
}

export function createBooking(payload: CreateBookingPayload) {
    return apiRequest<ApiSuccessResponse<{ booking: Booking }>>("/api/bookings", {
        method: "POST",
        body: payload,
    });
}

export interface BookingQuery {
    status?: BookingStatus;
    page?: number;
    limit?: number;
    [key: string]: QueryValue;
}

// কাস্টমারের নিজের বুকিং
export function getMyBookings(query: BookingQuery = {}) {
    return apiRequest<ApiSuccessResponse<Booking[]>>("/api/bookings", { query });
}

export function getBookingById(id: string) {
    return apiRequest<ApiSuccessResponse<{ booking: Booking }>>(`/api/bookings/${id}`);
}

export function cancelBooking(id: string, cancelReason?: string) {
    return apiRequest<ApiSuccessResponse<{ cancelledBooking: Booking }>>(`/api/bookings/${id}/cancel`, {
        method: "PATCH",
        body: { cancelReason },
    });
}

// টেকনিশিয়ানের নিজের বুকিং
export function getTechnicianBookings(query: BookingQuery = {}) {
    return apiRequest<ApiSuccessResponse<Booking[]>>("/api/technician/bookings", { query });
}

// টেকনিশিয়ান manually শুধু এই status গুলোই সেট করতে পারে (PAID বাদে — ওটা payment.service থেকে auto)
export type TechnicianSettableStatus = Extract<
    BookingStatus,
    "ACCEPTED" | "DECLINED" | "IN_PROGRESS" | "COMPLETED"
>;

export function updateBookingStatus(id: string, status: TechnicianSettableStatus) {
    return apiRequest<ApiSuccessResponse<{ updatedBooking: Booking }>>(`/api/technician/bookings/${id}`, {
        method: "PATCH",
        body: { status },
    });
}
