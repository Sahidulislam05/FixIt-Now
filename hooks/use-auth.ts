"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  login as loginApi,
  registerUser as registerApi,
  type LoginPayload,
  type RegisterPayload,
} from "@/lib/api/auth";
import { getMyProfile } from "@/lib/api/users";
import { clearAuthTokens, getAccessToken, setAuthTokens } from "@/lib/cookies";
import { useAuthStore } from "@/lib/store/auth-store";
import type { Role } from "@/lib/types";

// role অনুযায়ী কোন dashboard-এ পাঠাবে
function dashboardPathForRole(role: Role) {
  if (role === "ADMIN") return "/dashboard/admin";
  if (role === "TECHNICIAN") return "/dashboard/technician";
  return "/dashboard/customer";
}

export function useCurrentUser() {
  const setUser = useAuthStore((s) => s.setUser);
  const hasToken = !!getAccessToken();

  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await getMyProfile();
      setUser(res.data.profile);
      return res.data.profile;
    },
    enabled: hasToken,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: (payload: LoginPayload) => loginApi(payload),
    onSuccess: async (res) => {
      setAuthTokens(res.data.accessToken, res.data.refreshToken);

      const me = await getMyProfile();
      setUser(me.data.profile);
      queryClient.setQueryData(["me"], me.data.profile);

      router.push(dashboardPathForRole(me.data.profile.role));
    },
  });
}

export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: RegisterPayload) => registerApi(payload),
    onSuccess: () => {
      router.push("/login?registered=true");
    },
  });
}

export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();

  return {
    user,
    logout,
    isAuthenticated: !!user,
  };
}

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);

  return () => {
    clearAuthTokens();
    setUser(null);
    queryClient.clear();
    router.push("/login");
  };
}
