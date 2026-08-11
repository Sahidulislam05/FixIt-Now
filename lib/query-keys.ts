import type { ServiceQuery } from "@/lib/api/services";
import type { TechnicianQuery } from "@/lib/api/technicians";
import type { AdminUserQuery, AdminBookingQuery } from "@/lib/api/admin";

export const queryKeys = {
  categories: {
    all: ["categories"] as const,
    list: (search?: string) => ["categories", "list", search ?? ""] as const,
    detail: (id: string) => ["categories", "detail", id] as const,
  },

  services: {
    all: ["services"] as const,
    list: (query: ServiceQuery) => ["services", "list", query] as const,
    detail: (id: string) => ["services", "detail", id] as const,
    mine: ["services", "mine"] as const,
  },

  technicians: {
    all: ["technicians"] as const,
    list: (query: TechnicianQuery) => ["technicians", "list", query] as const,
    detail: (id: string) => ["technicians", "detail", id] as const,
    myAvailability: ["technicians", "my-availability"] as const,
  },

  bookings: {
    all: ["bookings"] as const,
    mine: (scope: string) => ["bookings", "mine", scope] as const,
    admin: (query: AdminBookingQuery) => ["bookings", "admin", query] as const,
  },

  users: {
    all: ["users"] as const,
    admin: (query: AdminUserQuery) => ["users", "admin", query] as const,
  },

  payments: {
    mine: ["payments", "mine"] as const,
  },

  me: ["me"] as const,
} as const;
