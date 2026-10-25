"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Icon } from "./icons";
import LanguageToggle from "@/app/components/language-toggle";
import { logoutAdmin } from "@/app/admin-login/actions";
import IdleLogout from "./idle-logout";

const mainItems = [
  { href: "/admin", label: "ড্যাশবোর্ড", icon: "grid" as const },
  { href: "/admin/cows", label: "গরুর তালিকা", icon: "cow" as const, badge: "১২" },
  { href: "/admin/orders", label: "অর্ডার", icon: "cart" as const },
  { href: "/admin/blogs", label: "ব্লগ", icon: "edit" as const },
];
// হোমপেজ group: everything editable on the public homepage.
const homepageItems = [
  { href: "/admin/homepage/slider", label: "স্লাইডার ছবি", icon: "image" as const },
  { href: "/admin/homepage/reviews", label: "ক্রেতা রিভিউ", icon: "users" as const },
  { href: "/admin/partners", label: "MoU পার্টনার", icon: "handshake" as const },
  { href: "/admin/homepage/advisors", label: "Advisor Panel", icon: "shield" as const },
  { href: "/admin/homepage/faq", label: "FAQ · জিজ্ঞাসা", icon: "chart" as const },
];
export type ShellAdmin = { name: string; username: string; role: "owner" | "editor" };

export default function AdminShell({ children, admin, pendingOrders = 0 }: { children: React.ReactNode; admin: ShellAdmin; pendingOrders?: number }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const homepageActive = homepageItems.some(item => pathname.startsWith(item.href));
  const [homepageOpen, setHomepageOpen] = useState(homepageActive);
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
        {mainItems.map(item => { const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href); return <Link key={item.href} href={item.href} className={active ? "active" : ""} onClick={() => setOpen(false)}><Icon name={item.icon}/><span>{item.label}</span>{item.href === "/admin/orders" ? pendingOrders > 0 && <b className="pending-badge" title="যাচাই বাকি">{new Intl.NumberFormat("bn-BD").format(pendingOrders)}</b> : item.badge && <b>{item.badge}</b>}</Link>; })}
        <button type="button" className={`nav-group ${homepageActive ? "active" : ""} ${homepageOpen ? "is-open" : ""}`} aria-expanded={homepageOpen} aria-controls="homepage-nav" onClick={() => setHomepageOpen(!homepageOpen)}><Icon name="home"/><span>হোমপেজ</span><Icon name="chevron" size={14}/></button>
        {homepageOpen && <div id="homepage-nav" className="nav-subitems">{homepageItems.map(item => <Link key={item.href} href={item.href} className={pathname.startsWith(item.href) ? "active" : ""} aria-current={pathname.startsWith(item.href) ? "page" : undefined} onClick={() => setOpen(false)}><span>{item.label}</span></Link>)}</div>}
        <p>সিস্টেম</p>
        {admin.role === "owner" && <Link href="/admin/users" className={pathname.startsWith("/admin/users") ? "active" : ""} onClick={() => setOpen(false)}><Icon name="users"/><span>ইউজার</span></Link>}
        <button type="button" title="শীঘ্রই আসছে"><Icon name="settings"/><span>সেটিংস</span><small>শীঘ্রই</small></button>
      </nav>
      <div className="admin-help"><span><Icon name="shield"/></span><b>সাহায্য প্রয়োজন?</b><p>অ্যাডমিন গাইড ও সাপোর্ট দেখুন</p><button>সাপোর্ট সেন্টার</button></div>
      <Link href="/" className="admin-signout"><Icon name="logout"/><span>ওয়েবসাইটে ফিরুন</span></Link>
    </aside>
    <div className="admin-main">
      <header className="admin-topbar">
        <button className="admin-menu-button" onClick={() => setOpen(true)} aria-label="মেনু খুলুন"><Icon name="menu"/></button>
        <label className="topbar-search"><Icon name="search"/><input type="search" placeholder="গরু, অর্ডার বা ক্রেতা খুঁজুন..."/><kbd>⌘ K</kbd></label>
        <div className="topbar-actions"><LanguageToggle compact/><button aria-label="নোটিফিকেশন"><Icon name="bell"/><i>3</i></button><span className="topbar-line"/><div className="admin-user"><span>{Array.from(admin.name || admin.username)[0]?.toUpperCase()}</span><div><b>{admin.name}</b><small>@{admin.username} · {admin.role === "owner" ? "Owner" : "Editor"}</small></div><Icon name="chevron" size={14}/></div><form action={logoutAdmin}><button type="submit" className="admin-logout" title="লগআউট"><Icon name="logout"/><span>লগআউট</span></button></form></div>
      </header>
      {children}
    </div>
    <IdleLogout/>
  </div>;
}

