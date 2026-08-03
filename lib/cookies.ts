"use client";

// ============================================================
// js-cookie ব্যবহার করে ব্রাউজারে token সেভ হয় — এই একই cookie
// proxy.ts (Edge runtime) থেকেও request.cookies দিয়ে পড়া যায়,
// কারণ দুটোই একই ফ্রন্টএন্ড ডোমেইনের cookie। ব্যাকএন্ডে (আলাদা
// ডোমেইন) এই token Authorization: Bearer header হিসেবে পাঠানো
// হয় — cross-origin httpOnly cookie-র জটিলতা এড়ানোর জন্য।
// ============================================================
import Cookies from "js-cookie";

export const ACCESS_TOKEN_KEY = "fixitnow_access_token";
export const REFRESH_TOKEN_KEY = "fixitnow_refresh_token";

const isProd = process.env.NODE_ENV === "production";

export function getAccessToken(): string | undefined {
    return Cookies.get(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | undefined {
    return Cookies.get(REFRESH_TOKEN_KEY);
}

export function setAuthTokens(accessToken: string, refreshToken: string) {
    // এসাইনমেন্টের JWT_ACCESS_EXPIRES_IN=1d / JWT_REFRESH_EXPIRES_IN=7d এর সাথে মিলিয়ে
    Cookies.set(ACCESS_TOKEN_KEY, accessToken, {
        expires: 1,
        sameSite: "lax",
        secure: isProd,
    });
    Cookies.set(REFRESH_TOKEN_KEY, refreshToken, {
        expires: 7,
        sameSite: "lax",
        secure: isProd,
    });
}

export function clearAuthTokens() {
    Cookies.remove(ACCESS_TOKEN_KEY);
    Cookies.remove(REFRESH_TOKEN_KEY);
}
