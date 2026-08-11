"use client";

import { LayoutDashboard, ShieldCheck, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";

// ============================================================
// ⚠️ ডেভেলপারের জন্য নোট: এই ইমেইল/পাসওয়ার্ডগুলো প্লেসহোল্ডার।
// তোমার ডেটাবেজে যে ডেমো/সিড ইউজারগুলো আছে (customer/technician/admin),
// তাদের প্রকৃত ইমেইল-পাসওয়ার্ড দিয়ে নিচের অ্যারেটা আপডেট করে নাও।
// বাটনে ক্লিক করলে সরাসরি লগইন ফর্ম ফিল-আপ + সাবমিট হয়ে যাবে।
// ============================================================
export const DEMO_ACCOUNTS = [
  {
    role: "Customer",
    email: "customer@fixitnow.com",
    password: "customer123",
    icon: LayoutDashboard,
  },
  {
    role: "Technician",
    email: "technician@fixitnow.com",
    password: "technician123",
    icon: Wrench,
  },
  {
    role: "Admin",
    email: "admin@fixitnow.com",
    password: "Admin@123456",
    icon: ShieldCheck,
  },
] as const;

interface DemoLoginButtonsProps {
  onSelect: (email: string, password: string) => void;
  disabled?: boolean;
}

export function DemoLoginButtons({
  onSelect,
  disabled,
}: DemoLoginButtonsProps) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-muted-foreground text-center">
        Quick demo access
      </p>
      <div className="grid grid-cols-3 gap-2">
        {DEMO_ACCOUNTS.map((acc) => (
          <Button
            key={acc.role}
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled}
            className="flex-col h-auto py-2 gap-1 text-[11px]"
            onClick={() => onSelect(acc.email, acc.password)}
          >
            <acc.icon className="h-3.5 w-3.5" />
            {acc.role}
          </Button>
        ))}
      </div>
    </div>
  );
}
