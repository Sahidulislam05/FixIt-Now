"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createService,
  updateMyService,
  deleteMyService,
  type CreateServicePayload,
} from "@/lib/api/services";
import { queryKeys } from "@/lib/query-keys";
import { ApiError } from "@/lib/api/client";

function errorMessage(err: unknown, fallback: string) {
  return err instanceof ApiError ? err.message : fallback;
}

export function useCreateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateServicePayload) => createService(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.services.all });
      toast.success("Service created successfully!");
    },
    onError: (err) => {
      toast.error(errorMessage(err, "Failed to create service"));
    },
  });
}

export function useUpdateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Parameters<typeof updateMyService>[1];
    }) => updateMyService(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.services.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.services.detail(variables.id),
      });
      toast.success("Service updated!");
    },
    onError: (err) => {
      toast.error(errorMessage(err, "Failed to update service"));
    },
  });
}

export function useDeleteService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMyService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.services.all });
      toast.success("Service deleted");
    },
    onError: (err) => {
      toast.error(errorMessage(err, "Failed to delete service"));
    },
  });
}
