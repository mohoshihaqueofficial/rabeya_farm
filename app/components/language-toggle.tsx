"use client";

import { useEffect, useState } from "react";
import { languageChangeEvent, languageStorageKey, type Language } from "@/data/i18n";
import { applyWebsiteLanguage } from "./language-provider";

export default function LanguageToggle({ compact = false }: { compact?: boolean }) {
  const [language, setLanguage] = useState<Language>("bn");
  useEffect(() => {
    const saved: Language = window.localStorage.getItem(languageStorageKey) === "en" ? "en" : "bn";
    const timer = window.setTimeout(() => setLanguage(saved), 0);
    const sync = (event: Event) => setLanguage((event as CustomEvent<Language>).detail);
    window.addEventListener(languageChangeEvent, sync); return () => { window.clearTimeout(timer); window.removeEventListener(languageChangeEvent, sync); };
  }, []);
  function toggle() { const next: Language = language === "bn" ? "en" : "bn"; applyWebsiteLanguage(next); setLanguage(next); window.dispatchEvent(new CustomEvent(languageChangeEvent, { detail: next })); }
  return <button type="button" data-no-translate className={`language-toggle ${compact ? "compact" : ""}`} onClick={toggle} aria-label={language === "bn" ? "Switch website to English" : "ওয়েবসাইট বাংলায় দেখুন"}><span>{language === "bn" ? "EN" : "বাং"}</span><b>{language === "bn" ? "English" : "বাংলা"}</b></button>;
}

