"use client";

import { useEffect, useState } from "react";

// Reads an admin-saved list from localStorage. Anything that isn't a list of objects
// (corrupted JSON, wrong shape, null) is ignored so the built-in list is used instead.
export function readStoredList<T>(storageKey: string): T[] | null {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(storageKey) ?? "null");
    return Array.isArray(parsed) ? parsed.filter((item): item is T => !!item && typeof item === "object") : null;
  } catch { return null; }
}

// Renders the built-in list first (matches the server), then swaps in the admin-saved list if valid.
export function useStoredList<T>(storageKey: string, initial: T[]) {
  const [items, setItems] = useState(initial);
  useEffect(() => {
    const timer = window.setTimeout(() => { const saved = readStoredList<T>(storageKey); if (saved) setItems(saved); }, 0);
    return () => window.clearTimeout(timer);
  }, [storageKey]);
  return items;
}
