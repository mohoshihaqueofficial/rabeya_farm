import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/app/components/site-footer";
import SiteHeader from "@/app/components/site-header";
import "./refund-policy.css";

export const metadata: Metadata = {
  title: "Refund Policy | রাবেয়া ফার্ম",
  description: "রাবেয়া ফার্মের বুকিং, বাতিলকরণ ও টাকা ফেরতের নিয়ম এবং রিফান্ড অনুরোধের প্রক্রিয়া।",
};

const sections = [
  { id: "eligibility", label: "যে ক্ষেত্রে রিফান্ড প্রযোজ্য" },
  { id: "cancellation", label: "বাতিলকরণ ও বুকিং" },
  { id: "delivery", label: "ডেলিভারির পর" },
  { id: "request", label: "রিফান্ডের আবেদন" },
  { id: "timeline", label: "সময়সীমা ও মাধ্যম" },
];

function PolicyIcon({ name }: { name: "check" | "calendar" | "truck" | "file" | "clock" }) {
  const path = name === "check"
    ? <><path d="M20 6 9 17l-5-5"/><path d="M12 22a10 10 0 1 1 9.3-13.7"/></>
    : name === "calendar"
      ? <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></>
      : name === "truck"
        ? <><path d="M10 17h4V5H2v12h3M14 9h4l4 4v4h-3"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="16.5" cy="17.5" r="2.5"/></>
        : name === "file"
          ? <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M8 13h8M8 17h6"/></>
          : <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>;

  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{path}</svg>;
}

export default function RefundPolicyPage() {
  return <main className="refund-policy-page">
    <SiteHeader active="policy"/>

    <section className="policy-hero">
      <div className="shell">
        <nav className="policy-breadcrumb" aria-label="Breadcrumb"><Link href="/">হোম</Link><span>/</span><span aria-current="page">Refund Policy</span></nav>
        <p className="policy-kicker">স্বচ্ছ ও সহজ প্রক্রিয়া</p>
        <h1>Refund Policy</h1>
        <p className="policy-lead">বুকিং বা পেমেন্টের পরে কোনো পরিবর্তন হলে কীভাবে বাতিলকরণ ও টাকা ফেরতের অনুরোধ করবেন—এখানে প্রয়োজনীয় নিয়মগুলো সহজভাবে দেওয়া হলো।</p>
        <span className="policy-updated">সর্বশেষ হালনাগাদ: ৩ অক্টোবর ২০২৬</span>
      </div>
    </section>

    <div className="shell policy-layout">
      <aside className="policy-nav" aria-label="Refund Policy সূচি">
        <p>এই পেজে</p>
        {sections.map((section, index) => <a key={section.id} href={`#${section.id}`}><span>{String(index + 1).padStart(2, "0")}</span>{section.label}</a>)}
        <div className="policy-help"><strong>সহায়তা প্রয়োজন?</strong><span>আমাদের টিমের সঙ্গে সরাসরি কথা বলুন।</span><a href="tel:01712345678">০১৭১২–৩৪৫৬৭৮</a></div>
      </aside>

      <article className="policy-content">
        <div className="policy-notice"><span>i</span><p>কোনো পেমেন্ট করার আগে গরুর প্রাপ্যতা, মূল্য, ব্যাংক তথ্য ও বুকিংয়ের শর্ত ফোনে নিশ্চিত করুন। ওয়েবসাইটের checkout বর্তমানে demo submission হিসেবে ব্যবহৃত হচ্ছে।</p></div>

        <section id="eligibility" className="policy-section">
          <div className="policy-section-heading"><span><PolicyIcon name="check"/></span><div><small>০১</small><h2>যে ক্ষেত্রে রিফান্ড প্রযোজ্য</h2></div></div>
          <p>নিচের কোনো পরিস্থিতি প্রযোজ্য হলে সম্পূর্ণ বা প্রযোজ্য পরিমাণ টাকা ফেরতের অনুরোধ করা যাবে:</p>
          <ul>
            <li>পেমেন্ট যাচাইয়ের আগেই বুকিং নিশ্চিত না হলে।</li>
            <li>রাবেয়া ফার্ম নির্বাচিত গরুটি সরবরাহ করতে না পারলে এবং আপনি বিকল্প গরু নিতে সম্মত না হলে।</li>
            <li>একই অর্ডারের জন্য ভুলবশত একাধিকবার টাকা পাঠানো হলে।</li>
            <li>অর্ডার নিশ্চিত হওয়ার পর গরুর অবস্থা বা সম্মত তথ্যের উল্লেখযোগ্য পরিবর্তন হলে।</li>
          </ul>
        </section>

        <section id="cancellation" className="policy-section">
          <div className="policy-section-heading"><span><PolicyIcon name="calendar"/></span><div><small>০২</small><h2>বাতিলকরণ ও বুকিং</h2></div></div>
          <p>বুকিং নিশ্চিত হওয়ার আগে বাতিল করলে যাচাইকৃত পেমেন্ট সম্পূর্ণ ফেরতযোগ্য। বুকিং নিশ্চিত হওয়ার পরে গরুটি অন্য ক্রেতার জন্য সংরক্ষণ বন্ধ থাকে; তাই গ্রাহকের অনুরোধে বাতিলের ক্ষেত্রে ইতোমধ্যে হওয়া সরাসরি ও প্রমাণযোগ্য খরচ বাদ যেতে পারে। কোনো অর্থ কাটার আগে তার কারণ ও হিসাব আপনাকে জানানো হবে।</p>
          <p>রাবেয়া ফার্ম অর্ডার বাতিল করলে কোনো cancellation fee ছাড়া যাচাইকৃত পরিশোধিত অর্থ ফেরত দেওয়া হবে।</p>
        </section>

        <section id="delivery" className="policy-section">
          <div className="policy-section-heading"><span><PolicyIcon name="truck"/></span><div><small>০৩</small><h2>ডেলিভারির পর রিফান্ড</h2></div></div>
          <p>ডেলিভারির সময় গরু ও সংশ্লিষ্ট তথ্য যাচাই করে গ্রহণ করুন। গ্রহণের পরে শুধু প্রমাণযোগ্যভাবে ভুল গরু সরবরাহ, সম্মত তথ্যের বড় ধরনের অমিল অথবা ডেলিভারির সময় বিদ্যমান গুরুতর সমস্যার ক্ষেত্রে রিফান্ড বা বিকল্পের আবেদন বিবেচনা করা হবে।</p>
          <div className="policy-callout"><strong>জরুরি সময়সীমা</strong><span>এ ধরনের সমস্যা ডেলিভারির ২৪ ঘণ্টার মধ্যে ছবি, ভিডিও ও Order ID-সহ জানাতে হবে।</span></div>
        </section>

        <section id="request" className="policy-section">
          <div className="policy-section-heading"><span><PolicyIcon name="file"/></span><div><small>০৪</small><h2>রিফান্ডের আবেদন কীভাবে করবেন</h2></div></div>
          <p>ফোন অথবা ইমেইলে যোগাযোগ করে নিচের তথ্য দিন:</p>
          <ol>
            <li>Order ID ও গরুর ID</li>
            <li>পেমেন্টের তারিখ, পরিমাণ ও transaction reference</li>
            <li>রিফান্ড চাওয়ার কারণ</li>
            <li>প্রয়োজনে রসিদ, ছবি বা ভিডিও</li>
            <li>যে হিসাবে টাকা ফেরত চান তার প্রয়োজনীয় তথ্য</li>
          </ol>
          <div className="policy-contact-row"><a href="tel:01712345678"><span>ফোন</span><strong>০১৭১২–৩৪৫৬৭৮</strong></a><a href="mailto:info@rabeyafarm.com"><span>ইমেইল</span><strong>info@rabeyafarm.com</strong></a></div>
        </section>

        <section id="timeline" className="policy-section">
          <div className="policy-section-heading"><span><PolicyIcon name="clock"/></span><div><small>০৫</small><h2>রিফান্ডের সময়সীমা ও মাধ্যম</h2></div></div>
          <p>সম্পূর্ণ তথ্য পাওয়ার পরে আবেদন যাচাই করে সিদ্ধান্ত জানানো হবে। অনুমোদিত রিফান্ড সাধারণত ৭–১০ কার্যদিবসের মধ্যে মূল পেমেন্ট মাধ্যম বা পারস্পরিকভাবে সম্মত ব্যাংক হিসাবে পাঠানো হবে। ব্যাংক বা পেমেন্ট সেবার processing time-এর কারণে টাকা হিসাবে দেখা দিতে অতিরিক্ত সময় লাগতে পারে।</p>
          <p>প্রতিটি আবেদন অর্ডারের তথ্য, বুকিংয়ের অবস্থা ও সরবরাহ পরিস্থিতি অনুযায়ী ন্যায্যভাবে পর্যালোচনা করা হবে। এই নীতি প্রযোজ্য ভোক্তা অধিকার বা আইনগত অধিকার সীমিত করে না।</p>
        </section>

        <div className="policy-final-cta"><div><p>আরও কোনো প্রশ্ন আছে?</p><h2>পেমেন্টের আগে আমাদের সঙ্গে কথা বলুন</h2></div><Link href="/contact">যোগাযোগ করুন <span aria-hidden="true">→</span></Link></div>
      </article>
    </div>

    <SiteFooter/>
  </main>;
}
