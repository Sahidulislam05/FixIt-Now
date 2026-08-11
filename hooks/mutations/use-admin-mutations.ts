"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateUserStatus } from "@/lib/api/admin";
import { queryKeys } from "@/lib/query-keys";
import { ApiError } from "@/lib/api/client";
import type { ActiveStatus } from "@/lib/types";

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      activeStatus,
    }: {
      userId: string;
      activeStatus: ActiveStatus;
    }) => updateUserStatus(userId, activeStatus),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      toast.success(
        variables.activeStatus === "BLOCKED"
          ? "User banned successfully"
          : "User unbanned successfully",
      );
    },
    onError: (err) => {
      toast.error(
        err instanceof ApiError ? err.message : "Failed to update user status",
      );
    },
  });
}
