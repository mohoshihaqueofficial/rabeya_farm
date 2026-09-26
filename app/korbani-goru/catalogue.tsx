"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import DualRange from "./dual-range";
import { filterCattle, colorLabels, bnNumber, type CowColor, type CattleFilters } from "@/data/cattle";

type Filters = CattleFilters;
const defaults: Filters = { search: "", minPrice: 50000, maxPrice: 350000, minWeight: 100, maxWeight: 700, colors: [] };
const pageSize = 8;

export default function CattleCatalogue() {
  const [filters, setFilters] = useState<Filters>(defaults);
  const [sort, setSort] = useState("default");
  const [page, setPage] = useState(1);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const resultsTop = useRef<HTMLDivElement>(null);
  const invalidRange = filters.minPrice > filters.maxPrice || filters.minWeight > filters.maxWeight;
  const found = invalidRange ? [] : filterCattle(filters, sort);
  const pageCount = Math.ceil(found.length / pageSize);
  const visible = found.slice((page - 1) * pageSize, page * pageSize);
  function updateFilters(next: Partial<Filters>) { setFilters(current => ({ ...current, ...next })); setPage(1); }
  function reset() { setFilters(defaults); setPage(1); }
  function changePage(next: number) { setPage(next); resultsTop.current?.scrollIntoView({ behavior: "smooth", block: "start" }); }

  return <section className="shell catalogue-layout">
    <aside className="catalogue-filters">
      <button className="mobile-filter-toggle" type="button" aria-expanded={filterOpen} aria-controls="catalogue-filter-form" onClick={() => setFilterOpen(open => !open)}>
        <span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M4 6h16M7 12h10M10 18h4"/></svg> ফিল্টার</span><b>{filterOpen ? "বন্ধ করুন" : "খুলুন"} <i aria-hidden="true">⌄</i></b>
      </button>
      <form id="catalogue-filter-form" className={filterOpen ? "is-open" : undefined} onSubmit={event => event.preventDefault()}>
        <div className="filter-heading filter-heading-reset"><button type="button" onClick={reset}>↻ রিসেট</button></div>
        <label className="filter-search">খুঁজুন<input type="search" value={filters.search} placeholder="গরুর নাম বা আইডি লিখুন…" onChange={event => updateFilters({ search: event.target.value })} /></label>
        <fieldset><legend>দামের পরিসর (৳)</legend>
          <DualRange min={50000} max={350000} step={5000} lower={filters.minPrice} upper={filters.maxPrice} label="দাম" onChange={(minPrice, maxPrice) => updateFilters({ minPrice, maxPrice })} />
          <div className="filter-values"><label>ন্যূনতম দাম<input required type="number" min={0} value={filters.minPrice} onChange={event => updateFilters({ minPrice: Number(event.target.value) })} /></label><label>সর্বোচ্চ দাম<input required type="number" min={0} value={filters.maxPrice} onChange={event => updateFilters({ maxPrice: Number(event.target.value) })} /></label></div>
        </fieldset>
        <fieldset><legend>ওজন (কেজি)</legend>
          <DualRange min={100} max={700} step={10} lower={filters.minWeight} upper={filters.maxWeight} label="ওজন" onChange={(minWeight, maxWeight) => updateFilters({ minWeight, maxWeight })} />
          <div className="filter-values"><label>ন্যূনতম ওজন<input required type="number" min={0} value={filters.minWeight} onChange={event => updateFilters({ minWeight: Number(event.target.value) })} /></label><label>সর্বোচ্চ ওজন<input required type="number" min={0} value={filters.maxWeight} onChange={event => updateFilters({ maxWeight: Number(event.target.value) })} /></label></div>
        </fieldset>
        <fieldset><legend>রঙ</legend><div className="color-options">{(Object.keys(colorLabels) as CowColor[]).map(color => <label key={color}><input type="checkbox" checked={filters.colors.includes(color)} onChange={event => updateFilters({ colors: event.target.checked ? [...filters.colors, color] : filters.colors.filter(item => item !== color) })} /><i className={`color-swatch swatch-${color}`} />{colorLabels[color]}</label>)}</div></fieldset>
        {invalidRange && <p role="alert" className="filter-error">ন্যূনতম মান সর্বোচ্চ মানের চেয়ে বেশি হতে পারবে না।</p>}
      </form>
    </aside>
    <div className="catalogue-results" ref={resultsTop}>
      <div className="catalogue-toolbar"><p aria-live="polite">মোট <strong>{bnNumber(found.length)}</strong> টি গরু পাওয়া গেছে</p><label>সাজানঃ <select value={sort} onChange={event => { setSort(event.target.value); setPage(1); }}><option value="default">ডিফল্ট</option><option value="price-low">দাম: কম থেকে বেশি</option><option value="price-high">দাম: বেশি থেকে কম</option><option value="weight">ওজন: বেশি থেকে কম</option></select></label></div>
      <p className="catalogue-demo">ডেমো সংগ্রহ · ছবি, দাম ও ওজন নমুনা তথ্য; বুকিংয়ের আগে নিশ্চিত করুন।</p>
      <div className="listing-grid">{visible.map(cow => <article className="listing-card" key={cow.id}>
        <div className="listing-photo"><Image src={cow.image} alt={cow.name} fill sizes="(max-width: 580px) 90vw, (max-width: 1100px) 35vw, 22vw" style={{ objectPosition: cow.position }} /><span className="listing-id">{cow.id}</span><button className="favorite-button" type="button" aria-label={`${cow.id} ${favorites.includes(cow.id) ? "পছন্দ থেকে সরান" : "পছন্দে যোগ করুন"}`} aria-pressed={favorites.includes(cow.id)} onClick={() => setFavorites(favorites.includes(cow.id) ? favorites.filter(id => id !== cow.id) : [...favorites, cow.id])}>{favorites.includes(cow.id) ? "♥" : "♡"}</button></div>
        <div className="listing-info"><h2>{cow.name}</h2><p>ওজন: {bnNumber(cow.weight)} কেজি</p><p>রঙ: {colorLabels[cow.color]}</p><strong>৳ {bnNumber(cow.price)}</strong><Link className="listing-details-link" href={`/korbani-goru/${cow.id}`}>বিস্তারিত দেখুন</Link></div>
      </article>)}</div>
      {!found.length && <div className="catalogue-empty"><h2>এই ফিল্টারে কোনো গরু পাওয়া যায়নি</h2><p>দাম, ওজন বা রঙের পরিসর পরিবর্তন করে আবার চেষ্টা করুন।</p><button type="button" className="button button-dark" onClick={reset}>সব গরু দেখুন</button></div>}
      {pageCount > 1 && <nav className="catalogue-pagination" aria-label="গরুর তালিকার পৃষ্ঠা"><button type="button" disabled={page === 1} onClick={() => changePage(page - 1)} aria-label="আগের পৃষ্ঠা">«</button>{Array.from({ length: pageCount }, (_, i) => <button type="button" key={i} aria-current={page === i + 1 ? "page" : undefined} onClick={() => changePage(i + 1)}>{bnNumber(i + 1)}</button>)}<button type="button" disabled={page === pageCount} onClick={() => changePage(page + 1)} aria-label="পরের পৃষ্ঠা">»</button></nav>}
    </div>
  </section>;
}
