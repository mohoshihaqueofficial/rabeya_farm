"use client";

import { useEffect, useRef, useState } from "react";
import { logoutAdminIdle, refreshAdminSession } from "@/app/admin-login/actions";
import { adminIdleMinutes } from "@/lib/admin-session";

const idleMs = adminIdleMinutes * 60 * 1000;
const warnMs = 2 * 60 * 1000;          // show the warning 2 minutes before logout
const refreshEveryMs = 60 * 1000;      // extend the server session at most once a minute while active, so it stays ≈ idleMs
const activityKey = "rabeya-admin-last-activity"; // shared by all open admin tabs
const activityEvents = ["mousemove", "mousedown", "keydown", "scroll", "touchstart", "wheel"] as const;

function lastActivity() {
  try { return Number(window.localStorage.getItem(activityKey)) || Date.now(); } catch { return Date.now(); }
}

// Logs the admin out after 30 minutes without mouse/keyboard/touch activity in any admin tab.
export default function IdleLogout() {
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const lastRefresh = useRef(0);
  const loggingOut = useRef(false);

  useEffect(() => {
    let lastWrite = 0;
    function markActive() {
      const now = Date.now();
      if (now - lastWrite < 1000) return; // throttle storage writes
      lastWrite = now;
      try { window.localStorage.setItem(activityKey, String(now)); } catch {}
      if (now - lastRefresh.current > refreshEveryMs) {
        lastRefresh.current = now;
        refreshAdminSession().then(ok => { if (!ok) logout(); }).catch(() => {});
      }
    }
    function logout() {
      if (loggingOut.current) return;
      loggingOut.current = true;
      logoutAdminIdle();
    }
    function tick() {
      const idle = Date.now() - lastActivity();
      if (idle >= idleMs) { logout(); return; }
      setSecondsLeft(idle >= idleMs - warnMs ? Math.ceil((idleMs - idle) / 1000) : null);
    }

    markActive();
    activityEvents.forEach(name => window.addEventListener(name, markActive, { passive: true }));
    const timer = window.setInterval(tick, 1000);
    return () => { activityEvents.forEach(name => window.removeEventListener(name, markActive)); window.clearInterval(timer); };
  }, []);

  if (secondsLeft === null) return null;
  const minutes = Math.floor(secondsLeft / 60), seconds = String(secondsLeft % 60).padStart(2, "0");
  return <div className="idle-dialog-backdrop" role="presentation">
    <section className="idle-dialog" role="alertdialog" aria-modal="true" aria-labelledby="idle-title" aria-describedby="idle-text">
      <h2 id="idle-title">আপনি কি এখনো আছেন?</h2>
      <p id="idle-text">অনেকক্ষণ কোনো কাজ হয়নি। নিরাপত্তার জন্য কিছুক্ষণ পর স্বয়ংক্রিয়ভাবে লগআউট হয়ে যাবে।</p>
      <strong aria-live="polite">{minutes}:{seconds}</strong>
      <div><button type="button" className="admin-secondary" onClick={() => logoutAdminIdle()}>এখনই লগআউট</button><button type="button" className="admin-primary" autoFocus onClick={() => { lastRefresh.current = 0; window.dispatchEvent(new Event("keydown")); }}>চালিয়ে যান</button></div>
    </section>
  </div>;
}
