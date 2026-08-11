"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import {
  getAllServices,
  getServiceById,
  getMyServices,
  type ServiceQuery,
} from "@/lib/api/services";
import { queryKeys } from "@/lib/query-keys";

export function useServices(query: ServiceQuery = {}) {
  return useQuery({
    queryKey: queryKeys.services.list(query),
    queryFn: async () => {
      const res = await getAllServices(query);
      return { services: res.data, meta: res.meta };
    },

    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
  });
}

export function useService(id: string) {
  return useQuery({
    queryKey: queryKeys.services.detail(id),
    queryFn: async () => {
      const res = await getServiceById(id);
      return res.data.service;
    },
    enabled: !!id,
  });
}

export function useMyServices() {
  return useQuery({
    queryKey: queryKeys.services.mine,
    queryFn: async () => {
      const res = await getMyServices();
      return res.data.services;
    },
  });
}
