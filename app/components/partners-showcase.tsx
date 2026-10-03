"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { activePartners, partnerStorageKey, type Partner } from "@/data/partners";

export default function PartnersShowcase() {
  const [items, setItems] = useState<Partner[]>(activePartners);
  const [selected, setSelected] = useState<Partner | null>(null);
  const [rotation, setRotation] = useState<{ current: number; previous: number | null }>({ current: 0, previous: null });

  useEffect(() => {
    const saved = window.localStorage.getItem(partnerStorageKey);
    if (!saved) return;
    const timer = window.setTimeout(() => {
      try {
        const parsed = JSON.parse(saved) as Partner[];
        setItems(parsed.filter(item => item.active).sort((a, b) => a.sortOrder - b.sortOrder));
      } catch {}
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const sidePool = items.slice(1);
  useEffect(() => {
    if (sidePool.length < 2) return;
    const timer = window.setInterval(() => setRotation(state => ({ current: (state.current + 1) % sidePool.length, previous: state.current })), 2000);
    return () => window.clearInterval(timer);
  }, [sidePool.length]);

  const galleryButton = (partner: Partner, className: string, key: string, hidden = false) => <button type="button" className={`mou-gallery-card ${className}`} key={key} onClick={() => setSelected(partner)} aria-label={`${partner.name}-এর MoU স্বাক্ষরের ছবি বড় করে দেখুন`} aria-hidden={hidden || undefined} tabIndex={hidden ? -1 : undefined}>
    <Image src={partner.agreementPhoto} alt={`${partner.name}-এর সঙ্গে MoU স্বাক্ষর`} fill sizes="(max-width: 700px) 92vw, (max-width: 1000px) 50vw, 32vw" unoptimized={partner.agreementPhoto.startsWith("data:")}/><span aria-hidden="true">↗</span>
  </button>;

  return <section className="partners-section" aria-labelledby="partners-title">
    <div className="shell mou-section-head"><div className="partners-heading"><p><i/> একসঙ্গে এগিয়ে চলা</p><h2 id="partners-title">বিশ্বাস থেকে <em>অংশীদারিত্ব</em></h2><span>দেশের কৃষি ও প্রাণিসম্পদ খাতে টেকসই পরিবর্তন আনতে যেসব প্রতিষ্ঠানের সঙ্গে আমাদের আনুষ্ঠানিক সমঝোতা।</span></div><div className="mou-count"><strong>{new Intl.NumberFormat("bn-BD").format(items.length)}</strong><div><b>সক্রিয় MoU</b><span>এবং এগিয়ে চলা</span></div></div></div>
    <div className="shell mou-gallery-grid">
      {items[0] && <button type="button" className="mou-gallery-card featured" onClick={() => setSelected(items[0])} aria-label={`${items[0].name}-এর MoU স্বাক্ষরের ছবি বড় করে দেখুন`}><Image src={items[0].agreementPhoto} alt={`${items[0].name}-এর সঙ্গে MoU স্বাক্ষর`} fill sizes="(max-width: 700px) 92vw, (max-width: 1000px) 100vw, 64vw" unoptimized={items[0].agreementPhoto.startsWith("data:")}/><span aria-hidden="true">↗</span></button>}
      {sidePool.length > 0 && <div className="mou-side-rotator">{Array.from({ length: Math.min(2, sidePool.length) }, (_, slot) => {
        const current = sidePool[(rotation.current + slot) % sidePool.length];
        const previous = rotation.previous === null ? null : sidePool[(rotation.previous + slot) % sidePool.length];
        const direction = slot === 0 ? "up" : "down";
        return <div className={`mou-side-slot slot-${direction}`} key={slot}>{previous && previous.id !== current.id && galleryButton(previous, `outgoing-${direction}`, `${previous.id}-${rotation.current}-old`, true)}{galleryButton(current, `incoming-${direction}`, `${current.id}-${rotation.current}-new`)}</div>;
      })}</div>}
    </div>
    <div className="shell mou-footnote"><span>Rabeya Farm</span><i/><p>দীর্ঘমেয়াদি সহযোগিতা · জ্ঞান বিনিময় · টেকসই অগ্রগতি</p></div>
    {selected && <div className="mou-lightbox" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setSelected(null); }}><section role="dialog" aria-modal="true" aria-label="MoU ছবির বড় preview"><button type="button" onClick={() => setSelected(null)} aria-label="ছবি বন্ধ করুন">×</button><div><Image src={selected.agreementPhoto} alt={`${selected.name}-এর সঙ্গে MoU স্বাক্ষর`} fill sizes="94vw" unoptimized={selected.agreementPhoto.startsWith("data:")}/></div></section></div>}
  </section>;
}

