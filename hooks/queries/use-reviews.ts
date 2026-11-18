"use client";

import { useQuery } from "@tanstack/react-query";
import { getRecentReviews } from "@/lib/api/reviews";
import { queryKeys } from "@/lib/query-keys";

export function useRecentReviews(limit = 6) {
  return useQuery({
    queryKey: queryKeys.reviews.recent(limit),
    queryFn: async () => (await getRecentReviews(limit)).data.reviews,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}
