"use client";

import { RotateCcw, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex justify-center py-16">
      <div className="w-full max-w-md animate-rise rounded-xl border bg-card p-8 text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-destructive/10 text-destructive">
          <TriangleAlert className="size-6" />
        </span>
        <h2 className="mt-5 text-2xl font-semibold">Couldn&apos;t load this page</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong while fetching your data. It&apos;s usually temporary.
        </p>
        <Button onClick={reset} className="mt-6">
          <RotateCcw /> Try again
        </Button>
      </div>
    </div>
  );
}
