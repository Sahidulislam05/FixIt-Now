"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertOctagon, RotateCcw } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="flex items-center justify-center py-16">
      <Card className="max-w-md w-full text-center p-8 border-red-500/30">
        <CardContent className="space-y-4 p-0">
          <div className="h-16 w-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
            <AlertOctagon className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold">Couldn&apos;t load this page</h2>
            <p className="text-sm text-muted-foreground">
              Something went wrong while fetching your data. Please try
              again.
            </p>
          </div>
          <Button onClick={() => reset()} className="gap-2">
            <RotateCcw className="h-4 w-4" /> Try Again..
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
