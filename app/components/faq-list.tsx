"use client";

import { useRef, useState } from "react";
import { faqs as defaultFaqs, faqStorageKey, maxHomepageFaqs, type Faq } from "@/data/faqs";
import { useStoredList } from "./use-stored-list";

// homepage: the short list on the homepage; otherwise every active FAQ with a search box (/faq).
export default function FaqList({ homepage = false }: { homepage?: boolean }) {
  const all = useStoredList<Faq>(faqStorageKey, defaultFaqs).filter(faq => faq.active && typeof faq.question === "string" && typeof faq.answer === "string");
  const [query, setQuery] = useState("");
  const items = homepage
    ? all.filter(faq => faq.homepage).slice(0, maxHomepageFaqs)
    : all.filter(faq => `${faq.question} ${faq.answer}`.toLocaleLowerCase().includes(query.toLocaleLowerCase().trim()));

  return <>
    {!homepage && <label className="faq-search"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg><input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="প্রশ্ন খুঁজুন…" aria-label="প্রশ্ন খুঁজুন"/></label>}
    <div className="faq-list">{items.map((faq, index) => <FaqItem key={faq.id} faq={faq} defaultOpen={index === 0 && !query}/>)}</div>
    {!homepage && !items.length && <p className="faq-empty">{query ? "এই শব্দে কোনো প্রশ্ন পাওয়া যায়নি। অন্য শব্দ দিয়ে চেষ্টা করুন।" : "এখনো কোনো প্রশ্ন যোগ করা হয়নি।"}</p>}
  </>;
}

const easing = "cubic-bezier(.22,.61,.36,1)";

// <details> opens instantly; this animates the answer's height and fade in both directions.
function FaqItem({ faq, defaultOpen }: { faq: Faq; defaultOpen: boolean }) {
  const details = useRef<HTMLDetailsElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const animation = useRef<Animation | null>(null);

  function toggle(event: React.MouseEvent) {
    const el = details.current, panel = body.current;
    if (!el || !panel || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    event.preventDefault();
    const opening = !el.open || animation.current?.playState === "running" && el.dataset.closing === "true";
    const from = `${panel.offsetHeight}px`;
    animation.current?.cancel();
    if (opening) {
      el.open = true; el.dataset.closing = "false";
      const to = `${panel.scrollHeight}px`;
      animation.current = panel.animate([{ height: from === "0px" ? "0px" : from, opacity: 0 }, { height: to, opacity: 1 }], { duration: 380, easing });
    } else {
      el.dataset.closing = "true";
      animation.current = panel.animate([{ height: from, opacity: 1 }, { height: "0px", opacity: 0 }], { duration: 300, easing });
      animation.current.onfinish = () => { el.open = false; el.dataset.closing = "false"; };
    }
  }

  return <details ref={details} open={defaultOpen}><summary onClick={toggle}>{faq.question}<span>+</span></summary><div ref={body} className="faq-answer"><p>{faq.answer}</p></div></details>;
}
