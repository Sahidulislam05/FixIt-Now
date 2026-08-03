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
