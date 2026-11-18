"use client";

import Link from "next/link";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusScreen } from "@/components/shared/status-screen";

export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <StatusScreen
      code="500"
      title="Something came loose"
      description={
        <>
          An unexpected error stopped this page from loading. Try again — if it keeps happening,{" "}
          <Link href="/contact" className="underline underline-offset-4">
            let us know
          </Link>
          .
          {process.env.NODE_ENV !== "production" && (
            <code className="mt-4 block rounded-md bg-muted p-3 text-left font-mono text-xs text-destructive">
              {error.message}
            </code>
          )}
        </>
      }
      actions={
        <>
          <Button onClick={reset}>
            <RotateCcw /> Try again
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Back home</Link>
          </Button>
        </>
      }
    />
  );
}
