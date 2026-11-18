"use client";

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
