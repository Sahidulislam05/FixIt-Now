"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  Calendar,
  Clock,
  CreditCard,
  FolderTree,
  Home,
  LayoutDashboard,
  LogOut,
  User,
  Users,
  Wrench,
  X,
  type LucideIcon,
} from "lucide-react";

import { useAuth } from "@/hooks/use-auth";
import { DashboardTopbar } from "@/components/layout/dashboard-topbar";
import { BrandMark } from "@/components/shared/brand-mark";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Role } from "@/lib/types";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const NAV: Record<Role, NavItem[]> = {
  ADMIN: [
    { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
    { label: "Users", href: "/dashboard/admin/users", icon: Users },
    { label: "Bookings", href: "/dashboard/admin/bookings", icon: Calendar },
    { label: "Categories", href: "/dashboard/admin/categories", icon: FolderTree },
    { label: "Analytics", href: "/dashboard/admin/analytics", icon: BarChart3 },
    { label: "Profile", href: "/dashboard/admin/profile", icon: User },
  ],
  TECHNICIAN: [
    { label: "Overview", href: "/dashboard/technician", icon: LayoutDashboard },
    { label: "Job requests", href: "/dashboard/technician/bookings", icon: Calendar },
    { label: "My services", href: "/dashboard/technician/services", icon: Wrench },
    { label: "Working hours", href: "/dashboard/technician/availability", icon: Clock },
    { label: "Profile", href: "/dashboard/technician/profile", icon: User },
  ],
  CUSTOMER: [
    { label: "Overview", href: "/dashboard/customer", icon: LayoutDashboard },
    { label: "My bookings", href: "/dashboard/customer/bookings", icon: Calendar },
    { label: "Payments", href: "/dashboard/customer/payments", icon: CreditCard },
    { label: "Profile", href: "/dashboard/customer/profile", icon: User },
  ],
};

function isActive(pathname: string | null, href: string, exact: boolean) {
  if (!pathname) return false;
  return exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const items = user ? NAV[user.role] : [];

  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between border-b px-5">
        <BrandMark />
        <Button variant="ghost" size="icon-sm" className="lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu">
          <X />
        </Button>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-3 rounded-xl border bg-card p-3">
          <Avatar className="size-10">
            <AvatarFallback className="bg-deep text-deep-foreground">{getInitials(user?.name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{user?.name ?? "Loading…"}</p>
            <p className="eyebrow !text-[0.62rem] !text-primary">{user?.role.toLowerCase() ?? ""}</p>
          </div>
        </div>
      </div>

      <nav aria-label="Dashboard" className="flex-1 space-y-1 overflow-y-auto px-3">
        <p className="eyebrow px-3 pt-2 pb-2 !text-[0.62rem]">Menu</p>
        {items.map((item, i) => {
          const active = isActive(pathname, item.href, i === 0);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active ? "text-background" : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {active && (
                <motion.span
                  layoutId="dash-active"
                  className="absolute inset-0 rounded-lg bg-foreground"
                  transition={{ type: "spring", stiffness: 420, damping: 36 }}
                />
              )}
              <item.icon className="relative size-4 shrink-0" />
              <span className="relative">{item.label}</span>
              {active && <span className="relative ml-auto size-1.5 rounded-full bg-primary" />}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t p-3">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Home className="size-4" /> Back to website
        </Link>
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-destructive transition-colors hover:bg-destructive/10"
        >
          <LogOut className="size-4" /> Log out
        </button>
      </div>
      <div className="stripe h-1.5" aria-hidden />
    </div>
  );

  return (
    <div className="flex min-h-screen bg-muted/40">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r bg-sidebar lg:block">{sidebar}</aside>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-foreground/40 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 w-72 border-r bg-sidebar lg:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 38 }}
            >
              {sidebar}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardTopbar onMenuClick={() => setOpen(true)} />
        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto w-full max-w-7xl flex-1 p-4 md:p-8"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
