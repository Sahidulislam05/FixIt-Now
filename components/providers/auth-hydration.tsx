"use client";

import { useEffect } from "react";
import { useCurrentUser } from "@/hooks/use-auth";
import { useAuthStore } from "@/lib/store/auth-store";
import { getAccessToken } from "@/lib/cookies";

// টোকেন cookie তে না থাকলে useCurrentUser এর query চলবেই না (enabled: false),
// তাই isLoading কে সরাসরি false করে দেওয়া হচ্ছে — নাহলে চিরকাল "loading" আটকে থাকত
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
