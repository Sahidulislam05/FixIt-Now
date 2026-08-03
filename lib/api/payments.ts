import { apiRequest, type QueryValue } from "./client";
import type { ApiSuccessResponse, Payment } from "../types";

export interface InitiatePaymentResponseData {
    gatewayPageURL: string;
    tranId: string;
}

export function createPayment(bookingId: string) {
    return apiRequest<ApiSuccessResponse<InitiatePaymentResponseData>>("/api/payments/create", {
        method: "POST",
        body: { bookingId },
    });
}

export interface PaymentQuery {
    page?: number;
    limit?: number;
    [key: string]: QueryValue;
}

export function getMyPayments(query: PaymentQuery = {}) {
    return apiRequest<ApiSuccessResponse<Payment[]>>("/api/payments", { query });
}

export function getPaymentById(id: string) {
    return apiRequest<ApiSuccessResponse<{ payment: Payment }>>(`/api/payments/${id}`);
}

// NOTE: POST /api/payments/confirm ফ্রন্টএন্ড থেকে কল করা হয় না —
// SSLCommerz সার্ভার নিজে থেকেই এটা কল করে payment সম্পন্ন হওয়ার পর।
