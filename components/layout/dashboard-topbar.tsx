"use client";

import Link from "next/link";
import { Home, LogOut, Menu, User } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { dashboardPathForRole, getInitials } from "@/lib/format";

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function DashboardTopbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { user, logout } = useAuth();
  const today = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-4 border-b bg-background/85 px-4 backdrop-blur-md md:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick} aria-label="Open menu">
          <Menu />
        </Button>
        <div className="min-w-0">
          <p className="truncate font-display text-lg leading-tight font-semibold">
            {greeting()}, {user?.name?.split(" ")[0] ?? "there"}
          </p>
          <p className="eyebrow hidden !text-[0.62rem] sm:block">{today}</p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="rounded-full ring-offset-2 transition-shadow focus-visible:ring-2 focus-visible:ring-ring" aria-label="Account menu">
              <Avatar className="size-9">
                <AvatarFallback className="bg-deep text-xs text-deep-foreground">{getInitials(user?.name)}</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-60" align="end">
            <DropdownMenuLabel className="font-normal">
              <p className="truncate text-sm font-semibold">{user?.name}</p>
              <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`${dashboardPathForRole(user?.role)}/profile`}>
                <User /> My profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/">
                <Home /> Back to website
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={logout}>
              <LogOut /> Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
