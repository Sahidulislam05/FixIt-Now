"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createService,
  deleteMyService,
  getAllServices,
  getServiceById,
  updateMyService,
} from "@/lib/api/services";
import { toast } from "sonner";

export interface ServiceInput {
  title: string;
  description: string;
  price: number;
  categoryId: string;
  location: string;
  image?: string;
}

// Data Fetching Hook
export function useServices(params?: Record<string, string | number>) {
  return useQuery({
    queryKey: ["services", params],
    queryFn: () => getAllServices(params),
    staleTime: 1000 * 60 * 5, // 5 minutes fresh cache
  });
}

// Single Service Fetching
export function useServiceDetails(id: string) {
  return useQuery({
    queryKey: ["service", id],
    queryFn: () => getServiceById(id),
    enabled: !!id,
  });
}

// Mutations with Automatic UI Revalidation
export function useServiceMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: ServiceInput) => createService(data),
    onSuccess: () => {
      toast.success("Service created successfully!");
      // Automatic UI Revalidation
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create service.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ServiceInput> }) =>
      updateMyService(id, data),
    onSuccess: (_, variables) => {
      toast.success("Service updated successfully!");
      // Revalidate both list and specific details cache
      queryClient.invalidateQueries({ queryKey: ["services"] });
      queryClient.invalidateQueries({ queryKey: ["service", variables.id] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update service.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteMyService(id),
    onSuccess: () => {
      toast.success("Service deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete service.");
    },
  });

  return {
    createService: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateService: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteService: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
