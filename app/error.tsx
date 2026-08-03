"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertOctagon, RotateCcw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // প্রোডাকশনে চাইলে এখানে Sentry/LogRocket ইত্যাদিতে পাঠানো যায়
    console.error("Unhandled UI error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="h-20 w-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
          <AlertOctagon className="h-10 w-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Something went wrong</h1>
          <p className="text-sm text-muted-foreground">
            An unexpected error occurred while loading this page. You can try
            again, or head back to the homepage.
          </p>
          {process.env.NODE_ENV !== "production" && (
            <p className="text-xs font-mono text-left bg-muted rounded-md p-3 text-red-600 overflow-x-auto">
              {error.message}
            </p>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <Button onClick={() => reset()} className="w-full sm:w-auto gap-2">
            <RotateCcw className="h-4 w-4" /> Try Again
          </Button>
          <Link href="/">
            <Button variant="outline" className="w-full sm:w-auto gap-2">
              <Home className="h-4 w-4" /> Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
