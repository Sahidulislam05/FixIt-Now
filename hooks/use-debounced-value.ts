"use client";

import { useEffect, useState } from "react";

/**
 * একটা value কে debounce করে — user টাইপ করা থামানোর delayMs পরেই আসল value
 * আপডেট হয়। সার্চ ইনপুটে ব্যবহার করলে প্রতিটা কি-স্ট্রোকে API কল হওয়া বন্ধ হয়,
 * ফলে backend-এ অপ্রয়োজনীয় লোড কমে এবং UI দ্রুত মনে হয়।
 */
export function useDebouncedValue<T>(value: T, delayMs = 400): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
