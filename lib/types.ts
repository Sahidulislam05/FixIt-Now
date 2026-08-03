// ============================================================
// FixItNow ব্যাকএন্ডের ঠিক response shape অনুযায়ী টাইপ —
// ৮টা Prisma entity + common API wrapper।
//
// ⚠️ গুরুত্বপূর্ণ: Prisma-র Decimal ফিল্ড (price, totalPrice, amount)
// JSON-এ সবসময় STRING হয়ে সিরিয়ালাইজ হয়, number না। তাই ফর্মে/হিসাবে
// ব্যবহারের আগে Number(service.price) করে নিতে হবে।
// ============================================================

export type Role = "CUSTOMER" | "TECHNICIAN" | "ADMIN";
export type ActiveStatus = "ACTIVE" | "BLOCKED";
export type DayOfWeek =
    | "SATURDAY"
    | "SUNDAY"
    | "MONDAY"
    | "TUESDAY"
    | "WEDNESDAY"
    | "THURSDAY"
    | "FRIDAY";
export type BookingStatus =
    | "REQUESTED"
    | "ACCEPTED"
    | "DECLINED"
    | "PAID"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "CANCELLED";
export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "CANCELLED";

export interface TechnicianProfile {
    id: string;
    bio: string | null;
    experienceYears: number;
    skills: string[];
    avgRating: number;
    totalReviews: number;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export interface TechnicianAvailability {
    id: string;
    dayOfWeek: DayOfWeek;
    startTime: string; // "09:00"
    endTime: string; // "17:00"
    isActive: boolean;
    technicianId: string;
    createdAt: string;
    updatedAt: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    role: Role;
    activeStatus: ActiveStatus;
    createdAt: string;
    updatedAt: string;
    technicianProfile?: TechnicianProfile | null;
    services?: Service[];
    availabilities?: TechnicianAvailability[];
    reviewsAsTechnician?: Review[];
}

export interface Category {
    id: string;
    name: string;
    description: string | null;
    icon: string | null;
    createdAt: string;
    updatedAt: string;
    _count?: { services: number };
}

export interface Service {
    id: string;
    title: string;
    description: string | null;
    price: string; // Decimal → string, দেখো উপরের নোট
    location: string | null;
    isActive: boolean;
    technicianId: string;
    categoryId: string;
    createdAt: string;
    updatedAt: string;
    category?: Category;
    technician?: User;
}

export interface Booking {
    id: string;
    scheduledDate: string; // ISO date string
    address: string;
    status: BookingStatus;
    totalPrice: string; // Decimal → string
    cancelReason: string | null;
    customerId: string;
    technicianId: string;
    serviceId: string;
    createdAt: string;
    updatedAt: string;
    service?: Service;
    customer?: User;
    technician?: User;
    payments?: Payment[];
    review?: Review | null;
}

export interface Payment {
    id: string;
    tranId: string;
    amount: string; // Decimal → string
    provider: "SSLCOMMERZ";
    status: PaymentStatus;
    meta: Record<string, unknown> | null;
    paidAt: string | null;
    bookingId: string;
    createdAt: string;
    updatedAt: string;
    booking?: Booking;
}

export interface Review {
    id: string;
    rating: number;
    comment: string | null;
    bookingId: string;
    customerId: string;
    technicianId: string;
    createdAt: string;
    updatedAt: string;
    customer?: { id: string; name: string };
}

// ---------------- API response envelope ----------------

export interface ApiMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

// proxy.ts এ optimistic role-check এর জন্য JWT decode করতে লাগে
export interface JwtPayload {
    id: string;
    name: string;
    email: string;
    role: Role;
    iat: number;
    exp: number;
}

export interface ApiSuccessResponse<T> {
    success: true;
    statusCode: number;
    message: string;
    data: T;
    meta?: ApiMeta;
}

export interface ApiErrorIssue {
    path: string;
    message: string;
}

export interface ApiErrorResponse {
    success: false;
    message: string;
    errorDetails: {
        statusCode: number;
        name: string;
        issues?: ApiErrorIssue[];
        stack?: string;
    };
}
