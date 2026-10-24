"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { adminStatus, adminStatusLabels, colorLabels, saveAdminCow, type AdminCow } from "@/data/admin-cattle";
import { bnNumber } from "@/data/cattle";
import { Icon } from "../components/icons";
import { useAdminCattle } from "../components/use-admin-cattle";

type SortKey = "weight" | "price";

export default function CattleManagementPage() {
  const adminCattle = useAdminCattle();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | "draft">("all");
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" } | null>(null);
  // Click cycles: ascending → descending → original order.
  function toggleSort(key: SortKey) { setSort(current => current?.key !== key ? { key, dir: "asc" } : current.dir === "asc" ? { key, dir: "desc" } : null); }
  const rows = useMemo(() => {
    const filtered = adminCattle.filter(cow => (status === "all" || adminStatus(cow) === status) && `${cow.id} ${cow.name}`.toLocaleLowerCase().includes(query.toLocaleLowerCase().trim()));
    return sort ? [...filtered].sort((a, b) => (a[sort.key] - b[sort.key]) * (sort.dir === "asc" ? 1 : -1)) : filtered;
  }, [adminCattle, query, status, sort]);
  const [toast, setToast] = useState<{ text: string; tone: "success" | "error"; key: number } | null>(null);
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  function notify(text: string, tone: "success" | "error" = "success") { setToast(current => ({ text, tone, key: (current?.key ?? 0) + 1 })); }

  // Active = shown on the website; Inactive = draft (hidden). Saving refreshes the list via useAdminCattle.
  function setActive(cow: AdminCow, active: boolean) {
    try { saveAdminCow({ ...cow, draft: !active }); }
    catch { notify("সংরক্ষণ করা যায়নি · ব্রাউজারের জায়গা পূর্ণ", "error"); return; }
    notify(active ? `${cow.id} Active · ওয়েবসাইটে দেখা যাবে` : `${cow.id} Inactive · ওয়েবসাইটে লুকানো`);
  }

  return <main className="admin-page">
    <div className="admin-page-heading"><div><p className="admin-breadcrumb"><Link href="/admin">ড্যাশবোর্ড</Link><span>/</span> গরুর তালিকা</p><h1>গরুর তালিকা</h1><p>খামারের সব গরুর তথ্য, অবস্থা এবং মূল্য পরিচালনা করুন।</p></div><Link href="/admin/cows/new" className="admin-primary"><Icon name="plus"/> নতুন গরু যোগ করুন</Link></div>
    <section className="admin-card cattle-manager">
      <div className="manager-toolbar"><label><Icon name="search"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="আইডি, নাম বা জাত দিয়ে খুঁজুন"/></label><div className="filter-tabs">{(["all","draft"] as const).map(item => <button key={item} className={status === item ? "active" : ""} onClick={()=>setStatus(item)}>{item === "all" ? "সব" : adminStatusLabels[item]}{item === "all" && <span>{adminCattle.length}</span>}</button>)}</div></div>
      <div className="admin-table-wrap"><table><thead><tr><th>গরু</th><th>রঙ</th>{([["weight","ওজন"],["price","বিক্রয় মূল্য"]] as const).map(([key,label])=><th key={key} aria-sort={sort?.key===key ? (sort.dir==="asc"?"ascending":"descending") : "none"}><button type="button" className={`sort-header ${sort?.key===key?"active":""}`} onClick={()=>toggleSort(key)}>{label}<span aria-hidden="true">{sort?.key===key ? (sort.dir==="asc"?"↑":"↓") : "↕"}</span></button></th>)}<th>অবস্থা</th><th>ওয়েবসাইটে</th><th/></tr></thead><tbody>{rows.map(cow => <tr key={cow.id}><td><Link href={`/admin/cows/${cow.id}`} className="cow-table-id"><span><Image src={cow.image} alt="" fill sizes="52px" unoptimized={cow.image.startsWith("data:")} style={{objectPosition:cow.position}}/></span><div><b>{cow.name}</b><small>{cow.id}{cow.featured && <em className="featured-badge">★ হোমপেজ</em>}</small></div></Link></td><td>{colorLabels[cow.color]}</td><td>{bnNumber(cow.weight)} কেজি</td><td><b>৳ {bnNumber(cow.price)}</b></td><td><span className={`status-pill ${adminStatus(cow)}`}><i/>{adminStatusLabels[adminStatus(cow)]}</span></td><td><label className="row-toggle" title={cow.draft ? "Inactive · ওয়েবসাইটে দেখা যাবে না" : "Active · ওয়েবসাইটে দেখা যাচ্ছে"}><input type="checkbox" checked={!cow.draft} onChange={e=>setActive(cow, e.target.checked)} aria-label={`${cow.id} ওয়েবসাইটে ${cow.draft ? "দেখান" : "লুকান"}`}/><span/><b>{cow.draft ? "Inactive" : "Active"}</b></label></td><td><Link className="table-action" href={`/admin/cows/${cow.id}`} aria-label={`${cow.id} সম্পাদনা করুন`}><Icon name="edit" size={16}/></Link></td></tr>)}</tbody></table>{rows.length === 0 && <div className="empty-state"><Icon name="search" size={28}/><b>কোনো গরু পাওয়া যায়নি</b><p>অন্য শব্দ বা filter দিয়ে চেষ্টা করুন।</p></div>}</div>
      <footer className="table-footer"><span>{rows.length}টির মধ্যে {rows.length}টি দেখানো হচ্ছে</span><div><button disabled>‹</button><button className="active">১</button><button>২</button><button>৩</button><button>›</button></div></footer>
    </section>
    {toast && <div key={toast.key} className={`admin-toast ${toast.tone}`} role={toast.tone === "error" ? "alert" : "status"}><span>{toast.tone === "success" ? <Icon name="check" size={15}/> : "!"}</span><p>{toast.text}</p><button type="button" onClick={()=>setToast(null)} aria-label="বন্ধ করুন">×</button></div>}
  </main>;
}

