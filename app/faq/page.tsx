import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/app/components/site-footer";
import SiteHeader from "@/app/components/site-header";
import FaqList from "@/app/components/faq-list";
import "../refund-policy/refund-policy.css";
import "./faq.css";

export const metadata: Metadata = {
  title: "সাধারণ জিজ্ঞাসা (FAQ) | রাবেয়া ফার্ম",
  description: "গরু বুকিং, পেমেন্ট, ডেলিভারি ও স্বাস্থ্য পরীক্ষা নিয়ে রাবেয়া ফার্মের সাধারণ প্রশ্ন ও উত্তর।",
};

export default function FaqPage() {
  return <main className="refund-policy-page faq-page">
    <SiteHeader active="about"/>
    <section className="policy-hero">
      <div className="shell">
        <nav className="policy-breadcrumb" aria-label="Breadcrumb"><Link href="/">হোম</Link><span>/</span><span aria-current="page">জিজ্ঞাসা</span></nav>
        <p className="policy-kicker">সাধারণ জিজ্ঞাসা</p>
        <h1>কিছু জানতে চান?</h1>
        <p className="policy-lead">গরু বুকিং, পেমেন্ট, ডেলিভারি ও স্বাস্থ্য নিয়ে ক্রেতাদের সাধারণ প্রশ্নগুলোর উত্তর এক জায়গায়।</p>
      </div>
    </section>
    <div className="shell faq-page-layout">
      <section aria-label="প্রশ্ন ও উত্তর"><FaqList/></section>
      <aside className="faq-help"><strong>উত্তর পাননি?</strong><span>আমাদের টিমের সঙ্গে সরাসরি কথা বলুন—প্রতিদিন সকাল ৮টা থেকে রাত ১০টা।</span><a href="tel:01712345678" className="button">০১৭১২–৩৪৫৬৭৮</a><Link href="/contact">যোগাযোগ পেজ →</Link></aside>
    </div>
    <SiteFooter/>
  </main>;
}
