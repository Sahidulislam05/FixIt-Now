"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import {
  LayoutDashboard,
  Calendar,
  CreditCard,
  User,
  Wrench,
  Clock,
  Users,
  FolderTree,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Home,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Role-based Navigation Links
  const getNavItems = (): NavItem[] => {
    if (!user) return [];

    switch (user.role) {
      case "ADMIN":
        return [
          {
            label: "Overview",
            href: "/dashboard/admin",
            icon: LayoutDashboard,
          },
          {
            label: "User Management",
            href: "/dashboard/admin/users",
            icon: Users,
          },
          {
            label: "Categories",
            href: "/dashboard/admin/categories",
            icon: FolderTree,
          },
          {
            label: "All Bookings",
            href: "/dashboard/admin/bookings",
            icon: Calendar,
          },
          {
            label: "Profile",
            href: "/dashboard/admin/profile",
            icon: User,
          },
        ];

      case "TECHNICIAN":
        return [
          {
            label: "Overview",
            href: "/dashboard/technician",
            icon: LayoutDashboard,
          },
          {
            label: "My Bookings",
            href: "/dashboard/technician/bookings",
            icon: Calendar,
          },
          {
            label: "My Services",
            href: "/dashboard/technician/services",
            icon: Wrench,
          },
          {
            label: "Availability",
            href: "/dashboard/technician/availability",
            icon: Clock,
          },
          {
            label: "Profile Setup",
            href: "/dashboard/technician/profile",
            icon: User,
          },
        ];

      case "CUSTOMER":
      default:
        return [
          {
            label: "Overview",
            href: "/dashboard/customer",
            icon: LayoutDashboard,
          },
          {
            label: "My Bookings",
            href: "/dashboard/customer/bookings",
            icon: Calendar,
          },
          {
            label: "Payment History",
            href: "/dashboard/customer/payments",
            icon: CreditCard,
          },
        ];
    }
  };

  const navItems = getNavItems();

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-background transition-transform duration-200 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex h-16 items-center justify-between border-b px-6">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-lg text-primary"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Wrench className="h-4 w-4" />
            </div>
            <span>FixItNow</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* User Info Box */}
        <div className="border-b p-4">
          <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
            <Avatar className="h-10 w-10 border">
              <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col overflow-hidden">
              <span className="truncate text-sm font-semibold">
                {user?.name || "User"}
              </span>
              <Badge
                variant="outline"
                className="w-max text-[10px] px-1.5 py-0 uppercase"
              >
                {user?.role || "CUSTOMER"}
              </Badge>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="flex-1">{item.label}</span>
                {isActive && <ChevronRight className="h-4 w-4" />}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t p-4 space-y-2">
          <Link href="/">
            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground"
            >
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <Button
            variant="destructive"
            className="w-full justify-start"
            onClick={logout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col">
        {/* Top Header for Mobile */}
        <header className="flex h-16 items-center justify-between border-b bg-background px-4 lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>
          <span className="font-semibold text-sm">Dashboard</span>
          <Avatar className="h-8 w-8">
            <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
          </Avatar>
        </header>

        {/* Page Children */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
