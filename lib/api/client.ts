"use client";

import { toast } from "sonner";
import { clearAuthTokens, getAccessToken } from "../cookies";
import type { ApiErrorIssue } from "../types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL && process.env.NODE_ENV !== "production") {
  // শুধু dev-এ warning — build ভাঙবে না, কিন্তু ভুলে .env.local বসাতে ভুলে গেলে সাথে সাথে ধরা পড়বে
  console.warn("⚠️ NEXT_PUBLIC_API_URL সেট করা নেই — .env.local চেক করো");
}

export class ApiError extends Error {
  statusCode: number;
  issues?: ApiErrorIssue[];

  constructor(message: string, statusCode: number, issues?: ApiErrorIssue[]) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.issues = issues;
  }
}

export type QueryValue = string | number | boolean | undefined;

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  query?: Record<string, QueryValue>;
  /** default true — token থাকলে Authorization header এ বসবে */
  auth?: boolean;
}

let sessionExpiredHandled = false;

function handleSessionExpired() {
  if (typeof window === "undefined") return;
  if (sessionExpiredHandled) return;

  const path = window.location.pathname;
  // লগইন/রেজিস্টার পেজে থাকলে redirect লুপের দরকার নেই
  if (path === "/login" || path === "/register") return;

  sessionExpiredHandled = true;
  clearAuthTokens();
  toast.error("Your session has expired. Please log in again.");

  const redirectTo = encodeURIComponent(path);
  window.location.href = `/login?sessionExpired=true&redirectTo=${redirectTo}`;
}

function buildUrl(path: string, query?: Record<string, QueryValue>) {
  const url = new URL(path, API_BASE_URL);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    });
  }

  return url.toString();
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = "GET", body, query, auth = true } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  let tokenAttached = false;
  if (auth) {
    const token = getAccessToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
      tokenAttached = true;
    }
  }

  let response: Response;

  try {
    response = await fetch(buildUrl(path, query), {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });
  } catch {
    // নেটওয়ার্ক-লেভেল ব্যর্থতা (সার্ভার ডাউন, DNS, ইত্যাদি) — HTTP status ই নেই
    throw new ApiError(
      "Network error. Please check your internet connection and try again.",
      0,
    );
  }

  const json = await response.json().catch(() => null);

  if (!response.ok) {
    const message: string =
      json?.message || "Something went wrong. Please try again.";
    const issues: ApiErrorIssue[] | undefined = json?.errorDetails?.issues;

    // টোকেন পাঠানোর পরও 401 মানে সেশন এক্সপায়ার্ড/ইনভ্যালিড — auto-logout করাই ভালো UX।
    // টোকেন ছাড়া 401 (যেমন public endpoint accidentally protected) এ redirect করা হয় না।
    if (response.status === 401 && tokenAttached) {
      handleSessionExpired();
    }

    throw new ApiError(message, response.status, issues);
  }

  return json as T;
}
