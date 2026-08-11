"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import {
  getAllTechnicians,
  getTechnicianById,
  type TechnicianQuery,
} from "@/lib/api/technicians";
import { queryKeys } from "@/lib/query-keys";

export function useTechnicians(query: TechnicianQuery = {}) {
  return useQuery({
    queryKey: queryKeys.technicians.list(query),
    queryFn: async () => {
      const res = await getAllTechnicians(query);
      return { technicians: res.data, meta: res.meta };
    },
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
  });
}

export function useTechnician(id: string) {
  return useQuery({
    queryKey: queryKeys.technicians.detail(id),
    queryFn: async () => {
      const res = await getTechnicianById(id);
      return res.data.technician;
    },
    enabled: !!id,
  });
}
