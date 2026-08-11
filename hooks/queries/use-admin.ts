"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getAllBookings,
  getAllUsers,
  type AdminBookingQuery,
  type AdminUserQuery,
} from "@/lib/api/admin";
import { queryKeys } from "@/lib/query-keys";

export function useAdminBookings(query: AdminBookingQuery = {}) {
  return useQuery({
    queryKey: queryKeys.bookings.admin(query),
    queryFn: async () => {
      const res = await getAllBookings(query);
      return { bookings: res.data, meta: res.meta };
    },
    staleTime: 60 * 1000,
  });
}

export function useAdminUsers(query: AdminUserQuery = {}) {
  return useQuery({
    queryKey: queryKeys.users.admin(query),
    queryFn: async () => {
      const res = await getAllUsers(query);
      return { users: res.data, meta: res.meta };
    },
    staleTime: 60 * 1000,
  });
}
