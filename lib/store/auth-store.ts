"use client";

import { create } from "zustand";
import type { User } from "@/lib/types";

// ============================================================
// এই store শুধু currently-fetched user profile in-memory cache করে —
// এটাই persist হয় না (localStorage এ না) ইচ্ছাকৃতভাবে, কারণ আসল
// source-of-truth হলো JWT cookie (lib/cookies.ts)। App load হলে
// AuthHydration কম্পোনেন্ট /api/users/me কল করে এই store populate করে,
// তাই user সবসময় ফ্রেশ থাকে (যেমন: admin ban করলে সাথে সাথে প্রতিফলিত হবে,
// stale localStorage ডেটার সমস্যা হবে না)।
// ============================================================
interface AuthState {
    user: User | null;
    isLoading: boolean;
    setUser: (user: User | null) => void;
    setLoading: (isLoading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isLoading: true, // client-এ mount হওয়ার পর AuthHydration ঠিক করে দেয়
    setUser: (user) => set({ user, isLoading: false }),
    setLoading: (isLoading) => set({ isLoading }),
}));
