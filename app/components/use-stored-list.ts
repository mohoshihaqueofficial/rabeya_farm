"use client";

import { useEffect, useState } from "react";

// Renders the built-in list first (matches the server), then swaps in the admin-saved list if any.
export function useStoredList<T>(storageKey: string, initial: T[]) {
  const [items, setItems] = useState(initial);
  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved = window.localStorage.getItem(storageKey);
        if (saved) setItems(JSON.parse(saved));
      } catch {}
    }, 0);
    return () => window.clearTimeout(timer);
  }, [storageKey]);
  return items;
}
