"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarCheck,
  LayoutDashboard,
  LogOut,
  Menu,
  User,
  X,
} from "lucide-react";

import { useAuth } from "@/hooks/use-auth";
import { BrandMark } from "@/components/shared/brand-mark";
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
import { cn } from "@/lib/utils";

const PUBLIC_LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/technicians", label: "Technicians" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Journal" },
  { href: "/contact", label: "Contact" },
];

function isActivePath(pathname: string | null, href: string) {
  if (!pathname) return false;
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const dashboardHref = dashboardPathForRole(user?.role);
  const links = isAuthenticated
    ? [...PUBLIC_LINKS, { href: dashboardHref, label: "Dashboard" }]
    : PUBLIC_LINKS;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      id="top"
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-[background-color,border-color,backdrop-filter] duration-300",
        scrolled || open
          ? "border-border bg-background/85 backdrop-blur-md"
          : "border-transparent bg-background",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6">
        <BrandMark />

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {links.map((link) => {
            const active = isActivePath(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {link.label}
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-x-3 -bottom-[13px] h-[3px] rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <ThemeToggle />
          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex items-center gap-2 rounded-full border py-1 pr-3 pl-1 text-sm font-medium transition-colors hover:border-foreground/40"
                  aria-label="Open account menu"
                >
                  <Avatar className="size-8">
                    <AvatarFallback className="bg-deep text-xs text-deep-foreground">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="max-w-[8rem] truncate">{user.name.split(" ")[0]}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-60" align="end">
                <DropdownMenuLabel className="font-normal">
                  <p className="truncate text-sm font-semibold">{user.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                  <p className="eyebrow mt-2 !text-primary">{user.role.toLowerCase()} account</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={dashboardHref}>
                    <LayoutDashboard /> Dashboard
                  </Link>
                </DropdownMenuItem>
                {user.role !== "ADMIN" && (
                  <DropdownMenuItem asChild>
                    <Link href={`${dashboardHref}/bookings`}>
                      <CalendarCheck /> Bookings
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link href={`${dashboardHref}/profile`}>
                    <User /> Profile settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onClick={logout}>
                  <LogOut /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Book a technician</Link>
              </Button>
            </>
          )}
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "calc(100dvh - 4rem)" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-y-auto border-t bg-background lg:hidden"
          >
            <nav aria-label="Mobile" className="flex flex-col px-4 py-6 sm:px-6">
              {links.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i + 0.08 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-baseline justify-between border-b border-dashed py-4 font-display text-2xl",
                      isActivePath(pathname, link.href) ? "text-primary" : "text-foreground",
                    )}
                  >
                    {link.label}
                    <span className="font-mono text-xs text-muted-foreground">
                      0{i + 1}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="space-y-3 px-4 pb-10 sm:px-6">
              {isAuthenticated && user ? (
                <>
                  <div className="flex items-center gap-3 rounded-xl border p-3">
                    <Avatar className="size-10">
                      <AvatarFallback className="bg-deep text-deep-foreground">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{user.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`${dashboardHref}/profile`} onClick={() => setOpen(false)}>
                      <User /> Profile settings
                    </Link>
                  </Button>
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => {
                      setOpen(false);
                      logout();
                    }}
                  >
                    <LogOut /> Log out
                  </Button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" asChild>
                    <Link href="/login" onClick={() => setOpen(false)}>
                      Log in
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link href="/register" onClick={() => setOpen(false)}>
                      Sign up
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
