"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Icon } from "./icons";
import LanguageToggle from "@/app/components/language-toggle";

const mainItems = [
  { href: "/admin", label: "ড্যাশবোর্ড", icon: "grid" as const },
  { href: "/admin/cows", label: "গরুর তালিকা", icon: "cow" as const, badge: "১২" },
  { href: "/admin/partners", label: "MoU পার্টনার", icon: "handshake" as const },
];
const soonItems = [
  { label: "অর্ডার", icon: "cart" as const, badge: "৮" },
  { label: "ক্রেতা", icon: "users" as const },
  { label: "রিপোর্ট", icon: "chart" as const },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  return <div className="admin-app">
    <button className={`admin-scrim ${open ? "is-open" : ""}`} aria-label="মেনু বন্ধ করুন" onClick={() => setOpen(false)} />
    <aside className={`admin-sidebar ${open ? "is-open" : ""}`}>
      <div className="admin-brand">
        <Link href="/" aria-label="রাবেয়া ফার্ম হোম"><Image src="/Home/Logo/RF_Logo.png" width={138} height={45} alt="Rabeya Farm" priority /></Link>
        <button className="sidebar-close" onClick={() => setOpen(false)} aria-label="মেনু বন্ধ করুন"><Icon name="close" /></button>
      </div>
      <div className="admin-workspace"><span>RF</span><div><b>রাবেয়া ফার্ম</b><small>অ্যাডমিন ওয়ার্কস্পেস</small></div><Icon name="chevron" size={15}/></div>
      <nav className="admin-nav" aria-label="অ্যাডমিন নেভিগেশন">
        <p>ম্যানেজমেন্ট</p>
        {mainItems.map(item => { const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href); return <Link key={item.href} href={item.href} className={active ? "active" : ""} onClick={() => setOpen(false)}><Icon name={item.icon}/><span>{item.label}</span>{item.badge && <b>{item.badge}</b>}</Link>; })}
        {soonItems.map(item => <button key={item.label} type="button" title="শীঘ্রই আসছে"><Icon name={item.icon}/><span>{item.label}</span>{item.badge && <b>{item.badge}</b>}<small>শীঘ্রই</small></button>)}
        <p>সিস্টেম</p>
        <button type="button" title="শীঘ্রই আসছে"><Icon name="settings"/><span>সেটিংস</span><small>শীঘ্রই</small></button>
      </nav>
      <div className="admin-help"><span><Icon name="shield"/></span><b>সাহায্য প্রয়োজন?</b><p>অ্যাডমিন গাইড ও সাপোর্ট দেখুন</p><button>সাপোর্ট সেন্টার</button></div>
      <Link href="/" className="admin-signout"><Icon name="logout"/><span>ওয়েবসাইটে ফিরুন</span></Link>
    </aside>
    <div className="admin-main">
      <header className="admin-topbar">
        <button className="admin-menu-button" onClick={() => setOpen(true)} aria-label="মেনু খুলুন"><Icon name="menu"/></button>
        <label className="topbar-search"><Icon name="search"/><input type="search" placeholder="গরু, অর্ডার বা ক্রেতা খুঁজুন..."/><kbd>⌘ K</kbd></label>
        <div className="topbar-actions"><LanguageToggle compact/><button aria-label="নোটিফিকেশন"><Icon name="bell"/><i>3</i></button><span className="topbar-line"/><div className="admin-user"><span>RA</span><div><b>রাবেয়া অ্যাডমিন</b><small>Super Admin</small></div><Icon name="chevron" size={14}/></div></div>
      </header>
      {children}
    </div>
  </div>;
}

