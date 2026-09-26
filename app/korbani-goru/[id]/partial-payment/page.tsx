import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/app/components/site-header";
import SiteFooter from "@/app/components/site-footer";
import { bnNumber, catalogue } from "@/data/cattle";
import PaymentForm from "./payment-form";
import "./payment.css";

const bookingAmount = 20000;

export function generateStaticParams() { return catalogue.map(cow => ({ id: cow.id })); }

export async function generateMetadata({ params }: PageProps<"/korbani-goru/[id]/partial-payment">): Promise<Metadata> {
  const { id } = await params;
  const cow = catalogue.find(item => item.id === id);
  return { title: cow ? `${cow.name} · আংশিক পেমেন্ট | রাবেয়া ফার্ম` : "গরু পাওয়া যায়নি" };
}

const faqs = [
  ["কিভাবে টাকা পাঠাবো?", "বাম পাশে দেওয়া ব্যাংক হিসাবে আংশিক বুকিংয়ের টাকা পাঠিয়ে ট্রানজেকশন তথ্য ও রসিদ জমা দিন।"],
  ["কোন ব্যাংকে টাকা পাঠাতে হবে?", "ব্যাংক তথ্য অংশে উল্লেখ করা হিসাবে পাঠান। টাকা পাঠানোর আগে ফোনে হিসাবটি নিশ্চিত করে নিন।"],
  ["টাকা পাঠানোর পর কত সময়ের মধ্যে বুকিং কনফার্ম হবে?", "তথ্য যাচাইয়ের পর আমাদের টিম ফোন বা SMS-এর মাধ্যমে বুকিংয়ের অবস্থা জানাবে।"],
  ["মোবাইল ব্যাংকিং কেন প্রয়োজন নয়?", "এই পেজটি বর্তমানে ব্যাংক ট্রান্সফারের তথ্য সংগ্রহের জন্য তৈরি।"],
  ["ভুল তথ্য দিলে কী হবে?", "যাচাই সম্ভব না হলে বুকিং নিশ্চিত হবে না। সঠিক তথ্য দিয়ে আবার যোগাযোগ করুন।"],
  ["বুকিং কনফার্ম হয়েছে কিনা কিভাবে জানবো?", "আমাদের টিম আপনার দেওয়া মোবাইল নম্বরে ফোন বা SMS করবে।"],
];

export default async function PartialPaymentPage({ params }: PageProps<"/korbani-goru/[id]/partial-payment">) {
  const { id } = await params;
  const cow = catalogue.find(item => item.id === id);
  if (!cow) notFound();

  return <main className="partial-payment-page">
    <SiteHeader active="cattle"/>
    <div className="shell payment-content">
      <nav className="payment-breadcrumb" aria-label="Breadcrumb"><Link href="/">হোম</Link><span>/</span><Link href="/korbani-goru">কোরবানির গরু</Link><span>/</span><Link href={`/korbani-goru/${cow.id}`}>বুকিং</Link><span>/</span><span aria-current="page">চেকআউট</span></nav>

      <div className="payment-layout">
        <aside className="payment-sidebar">
          <section className="payment-card booking-summary">
            <h2>বুকিং সারাংশ</h2>
            <div className="summary-cow"><div className="summary-image"><Image src={cow.image} alt={cow.name} fill sizes="96px" style={{ objectPosition: cow.position }}/></div><div><h3>{cow.name}</h3><b>আইডি: {cow.id}</b><p>ওজন (প্রায়): {bnNumber(cow.weight)} কেজি</p><strong>৳ {bnNumber(cow.price)}</strong></div></div>
            <dl><div><dt>বুকিং ধরন</dt><dd>আংশিক বুকিং</dd></div><div><dt>বুকিং টাকা</dt><dd>৳ {bnNumber(bookingAmount)}</dd></div><div><dt>পরিশোধযোগ্য টাকা</dt><dd>৳ {bnNumber(bookingAmount)}</dd></div></dl>
          </section>

          <section className="payment-card bank-card"><h2>ব্যাংক তথ্য</h2><dl><div><dt>ব্যাংকের নাম</dt><dd>সোনালী ব্যাংক লিমিটেড</dd></div><div><dt>শাখা</dt><dd>চরমুগুরিয়া, ময়মনসিংহ</dd></div><div><dt>একাউন্ট নম্বর</dt><dd>1234567890123</dd></div><div><dt>একাউন্ট নাম</dt><dd>Rabeya Farm</dd></div></dl><p>ডেমো ব্যাংক তথ্য—প্রকাশের আগে সঠিক হিসাব দিয়ে প্রতিস্থাপন করুন।</p></section>

          <section className="payment-card payment-instructions"><h2>গুরুত্বপূর্ণ নির্দেশনা</h2><ul><li>উপরে উল্লেখিত ব্যাংক একাউন্টে টাকা পাঠান।</li><li>টাকা পাঠানোর পর ট্রানজেকশন আইডি ও রসিদ আপলোড করুন।</li><li>তথ্য যাচাইয়ের পর বুকিং নিশ্চিত করে SMS পাঠানো হবে।</li><li>বুকিং কনফার্ম না হলে গরুটি রিজার্ভ হবে না।</li></ul></section>
        </aside>

        <section className="payment-main-card"><h1>পেমেন্ট সম্পন্ন করুন</h1><PaymentForm amount={bookingAmount} cowId={cow.id}/></section>
      </div>

      <section className="payment-faq"><h2>সচরাচর জিজ্ঞাসা (FAQ)</h2><div>{faqs.map(([question, answer]) => <details key={question}><summary>{question}<span>⌄</span></summary><p>{answer}</p></details>)}</div></section>
    </div>

    <SiteFooter/>
  </main>;
}
