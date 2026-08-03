import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";
import type { JwtPayload, Role } from "@/lib/types";

const ACCESS_TOKEN_KEY = "fixitnow_access_token";

const ROLE_DASHBOARD_PREFIX: Record<Role, string> = {
  CUSTOMER: "/dashboard/customer",
  TECHNICIAN: "/dashboard/technician",
  ADMIN: "/dashboard/admin",
};

const AUTH_PAGES = ["/login", "/register"];

function getValidPayload(request: NextRequest): JwtPayload | null {
  const token = request.cookies.get(ACCESS_TOKEN_KEY)?.value;

  if (!token) return null;

  try {
    const payload = jwtDecode<JwtPayload>(token);

    if (payload.exp * 1000 < Date.now()) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const payload = getValidPayload(request);

  const isDashboardRoute = pathname.startsWith("/dashboard");

  // লগইন ছাড়া dashboard এ ঢোকা যাবে না
  if (isDashboardRoute && !payload) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // লগইন থাকলেও অন্য role এর dashboard এ ঢোকা যাবে না
  if (isDashboardRoute && payload) {
    const allowedPrefix = ROLE_DASHBOARD_PREFIX[payload.role];
    if (!pathname.startsWith(allowedPrefix)) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  // আগে থেকে লগইন করা থাকলে login/register পেজে গেলে নিজের dashboard এ পাঠানো
  if (AUTH_PAGES.includes(pathname) && payload) {
    return NextResponse.redirect(
      new URL(ROLE_DASHBOARD_PREFIX[payload.role], request.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
