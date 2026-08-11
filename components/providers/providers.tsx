"use client";

import { QueryProvider } from "./query-provider";
import { AuthHydration } from "./auth-hydration";
import { ThemeProvider } from "./theme-provider";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <QueryProvider>
        <AuthHydration />
        {children}
        <Toaster position="top-center" richColors />
      </QueryProvider>
    </ThemeProvider>
  );
}
