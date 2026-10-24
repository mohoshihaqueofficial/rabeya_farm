"use client";

import { useSyncExternalStore } from "react";

const storageKey = "rabeya-booked-cows";
const changeEvent = "rabeya-booked-cows-change";

function readBookedCows(): string {
  try { return localStorage.getItem(storageKey) ?? "[]"; } catch { return "[]"; }
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(changeEvent, onChange);
  return () => { window.removeEventListener("storage", onChange); window.removeEventListener(changeEvent, onChange); };
}

export function markCowBooked(cowId: string) {
  const booked: string[] = JSON.parse(readBookedCows());
  if (booked.includes(cowId)) return;
  try { localStorage.setItem(storageKey, JSON.stringify([...booked, cowId])); } catch {}
  window.dispatchEvent(new Event(changeEvent));
}

/** True when a payment for this cow was already submitted from this browser. */
export function useIsCowBooked(cowId: string) {
  const booked = useSyncExternalStore(subscribe, readBookedCows, () => "[]");
  return (JSON.parse(booked) as string[]).includes(cowId);
}
