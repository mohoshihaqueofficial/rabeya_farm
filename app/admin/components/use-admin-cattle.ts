"use client";

import { useEffect, useState } from "react";
import { adminCattle, adminCattleChangeEvent, loadAdminCattle } from "@/data/admin-cattle";

// Starts with built-in data (matches server render), then swaps in saved admin edits and
// keeps them fresh — the page can stay mounted across client navigations, so mount alone isn't enough.
export function useAdminCattle() {
  const [cattle, setCattle] = useState(adminCattle);
  useEffect(() => {
    const refresh = () => setCattle(loadAdminCattle());
    const onVisible = () => { if (document.visibilityState === "visible") refresh(); };
    const timer = window.setTimeout(refresh, 0);
    const events = [adminCattleChangeEvent, "storage", "focus", "pageshow"];
    events.forEach(name => window.addEventListener(name, refresh));
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.clearTimeout(timer);
      events.forEach(name => window.removeEventListener(name, refresh));
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);
  return cattle;
}
