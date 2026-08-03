"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SimplePaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function SimplePagination({
  page,
  totalPages,
  onPageChange,
  className,
}: SimplePaginationProps) {
  if (totalPages <= 1) return null;

  const pageNumbers = getPageWindow(page, totalPages);

  return (
    <nav
      aria-label="Pagination"
      className={`flex items-center justify-center gap-1.5 pt-2 ${className || ""}`}
    >
      <Button
        variant="outline"
        size="sm"
        className="gap-1"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Previous</span>
      </Button>

      <div className="flex items-center gap-1">
        {pageNumbers.map((p, idx) =>
          p === "..." ? (
            <span
              key={`ellipsis-${idx}`}
              className="px-2 text-sm text-muted-foreground"
            >
              …
            </span>
          ) : (
            <Button
              key={p}
              size="sm"
              variant={p === page ? "outline" : "ghost"}
              className="h-8 w-8 p-0"
              aria-current={p === page ? "page" : undefined}
              onClick={() => onPageChange(p)}
            >
              {p}
            </Button>
          ),
        )}
      </div>

      <Button
        variant="outline"
        size="sm"
        className="gap-1"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  );
}

function getPageWindow(current: number, total: number): (number | "...")[] {
  const delta = 1;
  const range: (number | "...")[] = [];
  const rangeStart = Math.max(2, current - delta);
  const rangeEnd = Math.min(total - 1, current + delta);

  range.push(1);
  if (rangeStart > 2) range.push("...");
  for (let i = rangeStart; i <= rangeEnd; i++) range.push(i);
  if (rangeEnd < total - 1) range.push("...");
  if (total > 1) range.push(total);

  return range;
}
