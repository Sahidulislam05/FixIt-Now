"use client";

import { QueryProvider } from "./query-provider";
import { AuthHydration } from "./auth-hydration";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <QueryProvider>
            <AuthHydration />
            {children}
            <Toaster position="top-center" richColors />
        </QueryProvider>
    );
}
