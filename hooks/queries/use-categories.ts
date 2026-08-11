"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllCategories } from "@/lib/api/categories";
import { queryKeys } from "@/lib/query-keys";

export function useCategories(searchTerm?: string) {
  return useQuery({
    queryKey: queryKeys.categories.list(searchTerm),
    queryFn: async () => {
      const res = await getAllCategories(searchTerm);
      return res.data.categories;
    },
    staleTime: 5 * 60 * 1000,
  });
}
