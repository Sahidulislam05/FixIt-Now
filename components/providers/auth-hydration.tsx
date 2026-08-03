"use client";

import { useEffect } from "react";
import { useCurrentUser } from "@/hooks/use-auth";
import { useAuthStore } from "@/lib/store/auth-store";
import { getAccessToken } from "@/lib/cookies";

export function AuthHydration() {
  const setLoading = useAuthStore((s) => s.setLoading);

  useEffect(() => {
    if (!getAccessToken()) {
      setLoading(false);
    }
  }, [setLoading]);

  useCurrentUser();

  return null;
}
