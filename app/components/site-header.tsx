import Image from "next/image";
import Link from "next/link";
import LanguageToggle from "./language-toggle";

function HeaderIcon({ name }: { name: "pin" | "phone" | "menu" | "user" }) {
  return <svg width={name === "menu" ? 25 : 18} height={name === "menu" ? 25 : 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {name === "pin" ? <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></> : name === "menu" ? <path d="M4 7h16M4 12h16M4 17h16"/> : name === "user" ? <><circle cx="12" cy="8" r="4"/><path d="M4.5 21a7.5 7.5 0 0 1 15 0"/></> : <path d="M6.6 10.8a15.5 15.5 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.24c1.1.36 2.28.55 3.45.55a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.55 21 3 13.45 3 4.15a1 1 0 0 1 1-1H7.5a1 1 0 0 1 1 1c0 1.18.2 2.34.56 3.45a1 1 0 0 1-.25 1Z"/>}
  </svg>;
}

export default function SiteHeader({ active }: { active: "home" | "cattle" | "account" | "contact" | "donation" | "blog" | "about" | "policy" }) {
  const links = [
    { href: "/", label: "হোম", current: active === "home" },
    { href: "/korbani-goru", label: "কোরবানির গরু", current: active === "cattle" },
    { href: "/donation", label: "আমাদের ডোনেশন", current: active === "donation" },
    { href: "/blog", label: "ব্লগ", current: active === "blog" },
    { href: "/contact", label: "যোগাযোগ", current: active === "contact" },
  ];
  const navigation = <>
    {links.slice(0, 4).map(link => <Link key={link.href} href={link.href} aria-current={link.current ? "page" : undefined}>{link.label}</Link>)}
    <div className="about-menu">
      <span className="about-menu-trigger" aria-current={active === "about" ? "page" : undefined}>আমাদের সম্পর্কে <span aria-hidden="true" /></span>
      <div className="about-menu-popover">
        <Link href="/about" aria-current={active === "about" ? "page" : undefined}>আমাদের সম্পর্কে</Link>
        <Link href="/#faq">জিজ্ঞাসা</Link>
      </div>
    </div>
    {links.slice(4).map(link => <Link key={link.href} href={link.href} aria-current={link.current ? "page" : undefined}>{link.label}</Link>)}
  </>;
  const mobileNavigation = <>
    {links.slice(0, 4).map(link => <Link key={link.href} href={link.href} aria-current={link.current ? "page" : undefined}>{link.label}</Link>)}
    <span className="mobile-about-label">আমাদের সম্পর্কে</span>
    <Link href="/about" aria-current={active === "about" ? "page" : undefined}>আমাদের সম্পর্কে</Link>
    <Link href="/#faq">জিজ্ঞাসা</Link>
    {links.slice(4).map(link => <Link key={link.href} href={link.href} aria-current={link.current ? "page" : undefined}>{link.label}</Link>)}
  </>;
  return <>
    <div className="topbar"><div className="shell topbar-inner"><span><HeaderIcon name="pin"/> উত্তর মানিকপুর, সেনবাগ, নোয়াখালী</span><span><HeaderIcon name="phone"/> ০১৭১২–৩৪৫৬৭৮ <i>●</i> <a href="https://www.facebook.com/rabeyafarm" target="_blank" rel="noopener noreferrer">Facebook</a> &nbsp; Instagram</span></div></div>
    <header className="nav-wrap site-header"><div className="shell nav-inner">
      <Link href="/" className="brand" aria-label="Rabeya Farm হোম"><Image src="/Home/Logo/RF_Logo.png" alt="রাবেয়া ফার্ম" width={190} height={64} className="brand-logo" style={{ height: "auto" }} preload/></Link>
      <nav aria-label="প্রধান নেভিগেশন">{navigation}</nav>
      <div className="header-actions"><LanguageToggle compact/><div className="auth-actions"><Link href="/account?mode=login" className="nav-login"><HeaderIcon name="user"/> লগইন</Link><Link href="/account?mode=signup" className="nav-signup">সাইন আপ</Link></div></div>
      <details className="mobile-menu"><summary aria-label="মেনু খুলুন"><HeaderIcon name="menu"/></summary><div><LanguageToggle/>{mobileNavigation}<Link href="/account?mode=login" aria-current={active === "account" ? "page" : undefined}>লগইন</Link><Link href="/account?mode=signup">সাইন আপ</Link></div></details>
    </div></header>
  </>;
}
