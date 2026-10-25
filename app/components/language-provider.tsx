"use client";

import { useEffect } from "react";
import { languageChangeEvent, languageStorageKey, translateToEnglish, type Language } from "@/data/i18n";

const originalText = new WeakMap<Text, string>();
const originalAttributes = new WeakMap<Element, Map<string, string>>();
const translatedAttributes = ["placeholder", "title", "aria-label"];
let currentLanguage: Language = "bn";
let translatedOnce = false;
let activeObserver: MutationObserver | null = null;
const observerOptions: MutationObserverInit = { subtree: true, childList: true, characterData: true };

// Parts of the page stream in and are hydrated by React later (Suspense / loading.tsx). Changing their
// text before React has claimed them causes a hydration mismatch, so those nodes are skipped and retried.
// React marks the DOM nodes it owns with an internal "__reactFiber$…" key.
function isHydrated(element: Element) {
  for (const key in element) if (key.startsWith("__reactFiber$")) return true;
  return false;
}
let pendingNodes = 0;

function shouldSkip(node: Node) {
  const parent = node.parentElement;
  return !parent || Boolean(parent.closest("script,style,noscript,textarea,[data-no-translate]"));
}

function walk(root: ParentNode, language: Language) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();
  while (node) {
    const text = node as Text;
    if (!shouldSkip(text)) {
      if (language === "en" && !isHydrated(text.parentElement!)) { if (/[অ-৿]/.test(text.data)) pendingNodes++; }
      else if (language === "en") {
        if (/[অ-৿]/.test(text.data)) { originalText.set(text, text.data); text.data = translateToEnglish(text.data); }
      } else {
        const source = originalText.get(text); if (source !== undefined) text.data = source;
      }
    }
    node = walker.nextNode();
  }
  const elements = root instanceof Element ? [root, ...root.querySelectorAll("*")] : [...root.querySelectorAll("*")];
  for (const element of elements) for (const attribute of translatedAttributes) {
    if (element.closest("[data-no-translate]")) continue;
    const current = element.getAttribute(attribute); if (!current) continue;
    if (language === "en" && /[অ-৿]/.test(current) && !isHydrated(element)) { pendingNodes++; continue; }
    if (language === "en" && /[অ-৿]/.test(current)) {
      const saved = originalAttributes.get(element) ?? new Map<string, string>(); saved.set(attribute, current); originalAttributes.set(element, saved); element.setAttribute(attribute, translateToEnglish(current));
    } else if (language === "bn") { const source = originalAttributes.get(element)?.get(attribute); if (source) element.setAttribute(attribute, source); }
  }
}

export function applyWebsiteLanguage(language: Language) {
  if (typeof window === "undefined" || !document.body) return;
  currentLanguage = language;
  window.localStorage.setItem(languageStorageKey, language);
  document.documentElement.lang = language;
  document.documentElement.dataset.language = language;
  if (language === "bn" && !translatedOnce) return;
  activeObserver?.disconnect();
  pendingNodes = 0;
  walk(document.body, language);
  translatedOnce = language === "en";
  activeObserver?.takeRecords();
  activeObserver?.observe(document.body, observerOptions);
  if (language === "en" && pendingNodes > 0) retryPending();
}

// Re-scan while some Bangla text still waits for hydration (stops after ~5 s, e.g. for nodes React never owns).
let retryTimer = 0;
function retryPending(attempt = 0) {
  window.clearTimeout(retryTimer);
  if (attempt >= 20) return;
  retryTimer = window.setTimeout(() => {
    if (currentLanguage !== "en") return;
    activeObserver?.disconnect();
    pendingNodes = 0;
    walk(document.body, "en");
    activeObserver?.takeRecords();
    activeObserver?.observe(document.body, observerOptions);
    if (pendingNodes > 0) retryPending(attempt + 1);
  }, 250);
}

export default function LanguageProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const saved: Language = window.localStorage.getItem(languageStorageKey) === "en" ? "en" : "bn";
    applyWebsiteLanguage(saved);
    const observer = new MutationObserver(mutations => {
      if (currentLanguage !== "en") return;
      observer.disconnect();
      const roots = new Set<ParentNode>();
      for (const mutation of mutations) {
        if (mutation.type === "characterData" && mutation.target.parentNode) roots.add(mutation.target.parentNode);
        else for (const node of mutation.addedNodes) {
          if (node instanceof Element) roots.add(node);
          else if (node instanceof Text && node.parentNode) roots.add(node.parentNode);
        }
      }
      pendingNodes = 0;
      for (const root of roots) walk(root, "en");
      observer.takeRecords();
      observer.observe(document.body, observerOptions);
      if (pendingNodes > 0) retryPending();
    });
    activeObserver = observer;
    observer.observe(document.body, observerOptions);
    const onChange = (event: Event) => { const next = (event as CustomEvent<Language>).detail; if (next !== currentLanguage) applyWebsiteLanguage(next); };
    window.addEventListener(languageChangeEvent, onChange);
    return () => { observer.disconnect(); if (activeObserver === observer) activeObserver = null; window.removeEventListener(languageChangeEvent, onChange); };
  }, []);
  return <>{children}</>;
}

