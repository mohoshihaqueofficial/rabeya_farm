import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/app/components/site-header";
import SiteFooter from "@/app/components/site-footer";
import "./contact.css";

export const metadata: Metadata = {
  title: "যোগাযোগ ও অবস্থান | রাবেয়া ফার্ম",
  description: "রাবেয়া ফার্মের ঢাকা অফিস, খামারের অবস্থান, যোগাযোগের সময় এবং Google Map দেখুন।",
};

function ContactIcon({ name }: { name: "pin" | "phone" | "mail" | "clock" | "map" }) {
  const path = name === "pin" ? <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></> : name === "phone" ? <path d="M6.5 10.8a15.5 15.5 0 0 0 6.7 6.7l2.1-2.2a1 1 0 0 1 1.1-.2c1 .3 2.2.5 3.4.5a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.5 21 3 13.5 3 4.2a1 1 0 0 1 1-1h3.4a1 1 0 0 1 1 1c0 1.2.2 2.3.5 3.4a1 1 0 0 1-.2 1Z"/> : name === "mail" ? <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></> : name === "clock" ? <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></> : <><path d="m9 18-6 3V6l6-3 6 3 6-3v15l-6 3-6-3Z"/><path d="M9 3v15M15 6v15"/></>;
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{path}</svg>;
}

export default function ContactPage() {
  const farmMapUrl = "https://www.google.com/maps?q=23.0122406%2C91.2019366&z=17&output=embed";
  const farmDirectionsUrl = "https://www.google.com/maps/dir/?api=1&destination=23.0122406%2C91.2019366";
  const officeMapUrl = "https://www.google.com/maps?q=25%20Rowshon%20Complex%2C%20Mirpur-13%2C%20Dhaka%2C%20Bangladesh&output=embed";
  const officeDirectionsUrl = "https://www.google.com/maps/search/?api=1&query=25+Rowshon+Complex%2C+Mirpur-13%2C+Dhaka%2C+Bangladesh";

  return <main className="contact-page">
    <SiteHeader active="contact"/>
    <section className="contact-hero"><div className="shell"><p>আমাদের সঙ্গে যোগাযোগ করুন</p><h1>অফিস থেকে খামার—<br/>সব তথ্য এক জায়গায়</h1><span>ভিজিট, গরু দেখা, বুকিং অথবা ডেলিভারি সম্পর্কে জানতে সরাসরি আমাদের টিমের সঙ্গে কথা বলুন।</span></div></section>

    <div className="shell contact-content">
      <nav className="contact-breadcrumb" aria-label="Breadcrumb"><Link href="/">হোম</Link><span>/</span><span aria-current="page">যোগাযোগ</span></nav>

      <section className="location-grid" aria-label="অফিস ও খামারের তথ্য">
        <article className="location-card office-card"><div className="location-card-heading"><span><ContactIcon name="pin"/></span><div><small>প্রধান যোগাযোগ কেন্দ্র</small><h2>ঢাকা অফিস</h2></div></div><address>২৫, Rowshon Complex<br/>মিরপুর–১৩, ঢাকা</address><p className="farm-visit-note">অফিসে আসার আগে ফোনে appointment ও খোলার সময় নিশ্চিত করুন।</p><dl><div><dt><ContactIcon name="phone"/> ফোন</dt><dd><a href="tel:01712345678">০১৭১২–৩৪৫৬৭৮</a></dd></div><div><dt><ContactIcon name="mail"/> ইমেইল</dt><dd><a href="mailto:info@rabeyafarm.com">info@rabeyafarm.com</a></dd></div><div><dt><ContactIcon name="clock"/> অফিস সময়</dt><dd>সকাল ৯টা—রাত ৮টা</dd></div></dl><div className="farm-actions"><a className="contact-action primary" href={officeDirectionsUrl} target="_blank" rel="noopener noreferrer">Google Maps-এ পথ দেখুন</a><a className="contact-action secondary" href="tel:01712345678">ঢাকা অফিসে কল করুন</a></div></article>

        <article className="location-card farm-card"><div className="location-card-heading"><span><ContactIcon name="map"/></span><div><small>নিজস্ব খামার</small><h2>Farm Location</h2></div></div><address>উত্তর মানিকপুর, সেনবাগ থানা<br/>নোয়াখালী, বাংলাদেশ</address><p className="farm-visit-note">গরু দেখার জন্য খামার প্রতিদিন খোলা থাকে। দীর্ঘ পথ থেকে এলে রওনা দেওয়ার আগে সময় ও পথনির্দেশ ফোনে নিশ্চিত করুন।</p><dl><div><dt><ContactIcon name="phone"/> ফোন</dt><dd><a href="tel:01712345678">০১৭১২–৩৪৫৬৭৮</a></dd></div><div><dt><ContactIcon name="clock"/> ভিজিট সময়</dt><dd>সকাল ৮টা—সন্ধ্যা ৬টা</dd></div></dl><div className="farm-actions"><a className="contact-action primary" href={farmDirectionsUrl} target="_blank" rel="noopener noreferrer">Google Maps-এ পথ দেখুন</a><a className="contact-action secondary" href="https://wa.me/8801712345678" target="_blank" rel="noopener noreferrer">WhatsApp করুন</a></div></article>
      </section>

      <section className="contact-map-section"><div className="map-copy"><p>Google Location Map</p><h2>অফিস ও খামারের অবস্থান</h2><span>Map থেকে এলাকা দেখুন অথবা Google Maps খুলে সরাসরি direction নিন।</span></div><div className="maps-grid"><article><h3>Farm Location · নোয়াখালী</h3><div className="map-frame"><iframe src={farmMapUrl} title="Google Map-এ রাবেয়া ফার্মের অবস্থান" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen/><a href={farmDirectionsUrl} target="_blank" rel="noopener noreferrer">বড় map-এ খুলুন ↗</a></div></article><article><h3>ঢাকা অফিস · মিরপুর–১৩</h3><div className="map-frame"><iframe src={officeMapUrl} title="Google Map-এ রাবেয়া ফার্মের ঢাকা অফিস" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen/><a href={officeDirectionsUrl} target="_blank" rel="noopener noreferrer">বড় map-এ খুলুন ↗</a></div></article></div></section>

      <section className="contact-info-strip"><article><ContactIcon name="phone"/><div><small>সরাসরি কল</small><a href="tel:01712345678">০১৭১২–৩৪৫৬৭৮</a></div></article><article><ContactIcon name="mail"/><div><small>ইমেইল করুন</small><a href="mailto:info@rabeyafarm.com">info@rabeyafarm.com</a></div></article><article><ContactIcon name="clock"/><div><small>ফোনে সহায়তা</small><strong>প্রতিদিন সকাল ৮টা—রাত ১০টা</strong></div></article></section>

      <section className="visit-guide"><div><p>ভিজিটের আগে</p><h2>কিছু প্রয়োজনীয় তথ্য</h2></div><ul><li><span>১</span><div><strong>আগে ফোন করুন</strong><p>আপনার পছন্দের গরুটি খামারে আছে কিনা এবং ভিজিটের সময় নিশ্চিত করুন।</p></div></li><li><span>২</span><div><strong>গরুর ID সঙ্গে রাখুন</strong><p>ওয়েবসাইটে দেখা গরুর ID বললে আমাদের টিম দ্রুত সাহায্য করতে পারবে।</p></div></li><li><span>৩</span><div><strong>Google Maps ব্যবহার করুন</strong><p>উত্তর মানিকপুরের খামার অথবা মিরপুর–১৩-এর ঢাকা অফিস বেছে নিয়ে direction নিন।</p></div></li></ul></section>
    </div>

    <SiteFooter/>
  </main>;
}
