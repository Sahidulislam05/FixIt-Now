import type { Role } from "@/lib/types";

const takaFormatter = new Intl.NumberFormat("en-BD", {
  maximumFractionDigits: 0,
});

/** "1800" → "৳1,800" */
export function formatTaka(value: string | number | null | undefined): string {
  const amount = Number(value ?? 0);
  return `৳${takaFormatter.format(Number.isFinite(amount) ? amount : 0)}`;
}

/** "Rahim Uddin" → "RU" */
export function getInitials(name?: string | null): string {
  if (!name) return "U";
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/** Rating label that never invents a score for technicians without reviews. */
export function formatRating(avg?: number | null, total?: number | null): string {
  if (!total || !avg) return "New";
  return avg.toFixed(1);
}

export function dashboardPathForRole(role?: Role | null): string {
  if (role === "ADMIN") return "/dashboard/admin";
  if (role === "TECHNICIAN") return "/dashboard/technician";
  return "/dashboard/customer";
}
