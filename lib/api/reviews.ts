import { apiRequest } from "./client";
import type { ApiSuccessResponse, Review } from "../types";

export interface CreateReviewPayload {
    bookingId: string;
    rating: number;
    comment?: string;
}

export function createReview(payload: CreateReviewPayload) {
    return apiRequest<ApiSuccessResponse<{ review: Review }>>("/api/reviews", {
        method: "POST",
        body: payload,
    });
}

export interface PublicReview {
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    customerName: string;
    technician: { id: string; name: string };
    booking: { service: { title: string; category: { name: string } } };
}

export function getRecentReviews(limit = 6) {
    return apiRequest<ApiSuccessResponse<{ reviews: PublicReview[] }>>("/api/reviews/recent", {
        query: { limit },
        auth: false,
    });
}
