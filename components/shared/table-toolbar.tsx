"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StatusOption {
  value: string;
  label: string;
}

interface TableToolbarProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  statusValue?: string;
  onStatusChange?: (value: string) => void;
  statusOptions?: StatusOption[];
  statusPlaceholder?: string;
}

// ============================================================
// Admin/Technician/Customer — সব dashboard table-এই এক ধরনের
// "সার্চ বক্স + স্ট্যাটাস ফিল্টার" UI দরকার। এক জায়গায় বানিয়ে
// রাখলে প্রতিটা পেজে কপি-পেস্ট করা লাগছে না, চেহারাও কনসিস্টেন্ট থাকছে।
// ============================================================
export function TableToolbar({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  statusValue,
  onStatusChange,
  statusOptions,
  statusPlaceholder = "Filter by status",
}: TableToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-4">
      {onSearchChange && (
        <div className="relative flex-1 sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
      )}

      {onStatusChange && statusOptions && (
        <Select value={statusValue} onValueChange={onStatusChange}>
          <SelectTrigger className="w-full sm:w-[190px]">
            <SelectValue placeholder={statusPlaceholder} />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
