import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/app/components/site-header";
import SiteFooter from "@/app/components/site-footer";
import { catalogue, colorLabels, availabilityLabels, bnNumber } from "@/data/cattle";
import CowGallery, { ShareCow } from "./gallery";
import "../catalogue.css";
import "./details.css";

export function generateStaticParams() { return catalogue.map(cow => ({ id: cow.id })); }
export async function generateMetadata({ params }: PageProps<"/korbani-goru/[id]">): Promise<Metadata> {
  const { id } = await params;
  const cow = catalogue.find(item => item.id === id);
  return { title: cow ? `${cow.name} · ${cow.id} | রাবেয়া ফার্ম` : "গরু পাওয়া যায়নি" };
}

const faqs = [
  ["গরু বুক করতে কী করতে হবে?", "গরুর আইডি উল্লেখ করে ফোন বা WhatsApp-এ যোগাযোগ করুন। টিম প্রাপ্যতা, সঠিক দাম ও বুকিংয়ের নিয়ম নিশ্চিত করবে।"],
  ["আংশিক বুকিংয়ের ফি ও মেয়াদ কত?", "আংশিক বুকিংয়ের ফি, রিজার্ভের মেয়াদ ও বাকি টাকা পরিশোধের সময় টিমের সঙ্গে কথা বলে নিশ্চিত করুন।"],
  ["বুকিংয়ের টাকা ফেরতযোগ্য কি?", "কোনো টাকা দেওয়ার আগে লিখিত বুকিং ও ফেরত নীতি সংগ্রহ করুন। এই ডেমো page থেকে কোনো payment নেওয়া হয় না।"],
  ["গরু কখন নিতে পারব?", "খামার থেকে সংগ্রহ বা ডেলিভারির সম্ভাব্য তারিখ বুকিংয়ের সময় নির্ধারণ করতে পারবেন।"],
  ["ডেলিভারি সুবিধা আছে কি?", "আপনার ঠিকানার জন্য ডেলিভারি সুবিধা ও পরিবহন খরচ টিমের সঙ্গে নিশ্চিত করুন।"],
  ["গরুর স্বাস্থ্য পরীক্ষার রিপোর্ট কি পাব?", "নির্দিষ্ট গরুর স্বাস্থ্য পরীক্ষা, বয়স ও টিকাদানের তথ্য চাইতে পারেন। যাচাইকৃত তথ্য পাওয়ার পর সিদ্ধান্ত নিন।"],
];

export default async function CowDetailsPage({ params }: PageProps<"/korbani-goru/[id]">) {
  const { id } = await params;
  const cow = catalogue.find(item => item.id === id);
  if (!cow) notFound();
  const whatsapp = (kind: string) => `https://wa.me/8801712345678?text=${encodeURIComponent(`${cow.id} (${cow.name}) সম্পর্কে ${kind} জানতে চাই।`)}`;
  const related = catalogue.filter(item => item.id !== cow.id).sort((a, b) => Number(b.color === cow.color) - Number(a.color === cow.color)).slice(0, 4);
  return <main className="cow-details-page">
    <SiteHeader active="cattle"/>
    <div className="shell details-content">
      <nav className="details-breadcrumb" aria-label="Breadcrumb"><Link href="/">হোম</Link><span>/</span><Link href="/korbani-goru">কোরবানির গরু</Link><span>/</span><span aria-current="page">{cow.name} · {cow.id}</span></nav>
      <div className="details-demo">ডেমো catalogue · দাম, ওজন ও ছবি নমুনা তথ্য। বুকিংয়ের আগে প্রাপ্যতা ও সঠিক তথ্য নিশ্চিত করুন।</div>
      <div className="cow-details-grid">
        <div><CowGallery cow={cow}/><table className="cow-specs"><caption>গরুর বিস্তারিত তথ্য</caption><tbody>
          <tr><th>গরুর আইডি</th><td>{cow.id}</td><th>রঙ</th><td>{colorLabels[cow.color]}</td></tr>
          <tr><th>ধরন</th><td>{cow.name}</td><th>ওজন</th><td>{bnNumber(cow.weight)} কেজি</td></tr>
          <tr><th>বয়স</th><td>নিশ্চিত করা হবে</td><th>লিঙ্গ</th><td>নিশ্চিত করা হবে</td></tr>
          <tr><th>স্বাস্থ্য পরীক্ষা</th><td>তথ্য চাইতে পারেন</td><th>টিকাদান</th><td>যাচাই করা হবে</td></tr>
          <tr><th>উৎপত্তি</th><td>নিজস্ব খামার</td><th>খাবার</th><td>ঘাস ও সুষম খাবার</td></tr>
        </tbody></table></div>
        <section className="cow-details-summary"><div className="details-labels"><span className="details-breed">{cow.name}</span>{cow.availability !== "available" && <span className={`details-availability ${cow.availability}`}>{availabilityLabels[cow.availability]}</span>}</div><h1>{cow.name} <small>— {cow.id}</small></h1>
          <p className="details-price">৳ {bnNumber(cow.price)}</p><div className="details-share-row"><a className="details-outline-button" href={whatsapp("বিস্তারিত তথ্য")} target="_blank" rel="noopener noreferrer">WhatsApp</a><ShareCow title={`${cow.name} · ${cow.id}`}/></div>
          <div className="cow-highlights"><h2>বিশেষ তথ্য</h2><ul><li>নিজস্ব খামারের সংগ্রহ</li><li>বর্তমান ওজন ও দাম জানতে যোগাযোগ করুন</li><li>লাইভ ভিডিও বা খামার ভিজিটের অনুরোধ করুন</li><li>বুকিংয়ের আগে স্বাস্থ্য ও বয়স যাচাই করুন</li></ul></div>
        </section>
        <aside className="booking-panel"><h2>এখনই বুকিং করুন</h2><div className="booking-price-box"><span>মোট মূল্য (ডেমো)</span><strong>৳ {bnNumber(cow.price)}</strong></div><div className="booking-divider">অথবা</div><h3>আংশিক বুকিং <small>(Partial Booking)</small></h3><p>পছন্দের গরুটি রিজার্ভ করতে আংশিক বুকিংয়ের টাকা পাঠিয়ে পেমেন্টের তথ্য জমা দিন।</p><div className="booking-price-box"><span>আংশিক বুকিংয়ের টাকা</span><b>৳ ২০,০০০</b></div><ul><li>গরুর আইডি: {cow.id}</li><li>প্রাপ্যতা নিশ্চিত হওয়ার পর বুকিং করুন</li><li>পেমেন্টের রসিদ বা স্ক্রিনশট সংগ্রহ করুন</li></ul><Link className="button button-dark" href={`/korbani-goru/${cow.id}/partial-payment`}>আংশিক বুকিং করুন</Link><Link className="details-outline-button" href={`/korbani-goru/${cow.id}/full-payment`}>পূর্ণ পেমেন্ট করুন</Link><p className="booking-note">টাকা পাঠানোর আগে ফোনে ব্যাংক তথ্য নিশ্চিত করুন।</p></aside>
      </div>
      <section className="related-cattle"><div className="related-heading"><h2>অনুরূপ গরু</h2><Link href="/korbani-goru">সব গরু দেখুন →</Link></div><div className="listing-grid">{related.map(item => <article className={`listing-card ${item.availability !== "available" ? "is-unavailable" : ""}`} key={item.id}><Link href={`/korbani-goru/${item.id}`} className="listing-photo"><Image src={item.image} alt={item.name} fill sizes="(max-width: 580px) 45vw, 25vw" style={{ objectPosition: item.position }}/>{item.availability !== "available" && <span className={`listing-availability ${item.availability}`}>{availabilityLabels[item.availability]}</span>}<span className="listing-id">{item.id}</span></Link><div className="listing-info"><h2>{item.name}</h2><p>{bnNumber(item.weight)} কেজি · {colorLabels[item.color]}</p><strong>৳ {bnNumber(item.price)}</strong><Link className="listing-details-link" href={`/korbani-goru/${item.id}`}>বিস্তারিত দেখুন</Link></div></article>)}</div></section>
      <section className="details-faq"><h2>সচরাচর জিজ্ঞাসা (FAQ)</h2>{faqs.map(([question, answer]) => <details key={question}><summary>{question}<span>›</span></summary><p>{answer}</p></details>)}</section>
    </div>
    <SiteFooter/>
  </main>;
}
