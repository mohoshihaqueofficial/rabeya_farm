import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/app/components/site-header";
import SiteFooter from "@/app/components/site-footer";
import { bnNumber, catalogue } from "@/data/cattle";
import PaymentForm from "../partial-payment/payment-form";
import "../partial-payment/payment.css";

export function generateStaticParams() { return catalogue.map(cow => ({ id: cow.id })); }

export async function generateMetadata({ params }: PageProps<"/korbani-goru/[id]/full-payment">): Promise<Metadata> {
  const { id } = await params;
  const cow = catalogue.find(item => item.id === id);
  return { title: cow ? `${cow.name} · পূর্ণ পেমেন্ট | রাবেয়া ফার্ম` : "গরু পাওয়া যায়নি" };
}

const faqs = [
  ["সম্পূর্ণ টাকা মিটিয়ে পর কখন অর্ডার কনফার্ম হবে?", "ট্রানজেকশন যাচাইয়ের পর আমাদের টিম ফোন বা SMS-এর মাধ্যমে অর্ডার নিশ্চিত করবে।"],
  ["টাকা পাঠানোর পর কিভাবে জানাবো?", "এই পেজে ট্রানজেকশন তথ্য ও পেমেন্টের রসিদ জমা দিন।"],
  ["ডেলিভারি কত দিনের মধ্যে দেওয়া হবে?", "আপনার ঠিকানা ও নির্বাচিত তারিখ অনুযায়ী টিম ডেলিভারির সময় নিশ্চিত করবে।"],
  ["কোন কোন মাধ্যমে টাকা পাঠাতে পারি?", "ব্যাংক তথ্য অংশে দেওয়া হিসাবে টাকা পাঠাতে পারবেন। পাঠানোর আগে ফোনে হিসাবটি নিশ্চিত করুন।"],
  ["ডেলিভারি চার্জ কত?", "বর্তমানে ডেলিভারি চার্জ শূন্য দেখানো হয়েছে; চূড়ান্ত চার্জ টিমের সঙ্গে নিশ্চিত করুন।"],
  ["টাকা ফেরত পাওয়া যাবে কি?", "টাকা পাঠানোর আগে লিখিত refund ও cancellation policy সংগ্রহ করে সম্মতি দিন।"],
];

export default async function FullPaymentPage({ params }: PageProps<"/korbani-goru/[id]/full-payment">) {
  const { id } = await params;
  const cow = catalogue.find(item => item.id === id);
  if (!cow) notFound();

  return <main className="partial-payment-page full-payment-page">
    <SiteHeader active="cattle"/>
    <div className="shell payment-content">
      <nav className="payment-breadcrumb" aria-label="Breadcrumb"><Link href="/">হোম</Link><span>/</span><Link href="/korbani-goru">কোরবানির গরু</Link><span>/</span><Link href={`/korbani-goru/${cow.id}`}>গরু বিস্তারিত</Link><span>/</span><span aria-current="page">পূর্ণ পেমেন্ট</span></nav>

      <div className="payment-layout">
        <aside className="payment-sidebar">
          <section className="payment-card booking-summary">
            <h2>অর্ডারের সারসংক্ষেপ</h2>
            <div className="summary-cow"><div className="summary-image"><Image src={cow.image} alt={cow.name} fill sizes="96px" style={{ objectPosition: cow.position }}/></div><div><h3>{cow.name}</h3><b>আইডি: {cow.id}</b><p>ওজন (প্রায়): {bnNumber(cow.weight)} কেজি</p><strong>৳ {bnNumber(cow.price)}</strong></div></div>
            <dl><div><dt>গরুর মূল্য</dt><dd>৳ {bnNumber(cow.price)}</dd></div><div><dt>ডেলিভারি চার্জ</dt><dd>৳ ০</dd></div><div><dt>মোট পরিশোধযোগ্য টাকা</dt><dd>৳ {bnNumber(cow.price)}</dd></div></dl>
          </section>

          <section className="payment-card bank-card"><h2>ব্যাংক তথ্য <small>(পেমেন্টকারীর তথ্য)</small></h2><dl><div><dt>ব্যাংকের নাম</dt><dd>সোনালী ব্যাংক লিমিটেড</dd></div><div><dt>শাখা</dt><dd>চরমুগুরিয়া, ময়মনসিংহ</dd></div><div><dt>একাউন্ট নম্বর</dt><dd>1234567890123</dd></div><div><dt>একাউন্ট নাম</dt><dd>Rabeya Farm</dd></div></dl><p>ডেমো ব্যাংক তথ্য—প্রকাশের আগে সঠিক হিসাব দিয়ে প্রতিস্থাপন করুন।</p></section>

          <section className="payment-card payment-instructions"><h2>গুরুত্বপূর্ণ নির্দেশনা</h2><ul><li>পূর্ণ পরিশোধ নিশ্চিত হওয়ার পরই অর্ডার কনফার্ম হবে।</li><li>টাকা পাঠানোর পর ট্রানজেকশন আইডি ও রসিদ আপলোড করুন।</li><li>তথ্য যাচাইয়ের পর অর্ডারের আপডেট ফোন বা SMS-এ জানানো হবে।</li><li>বুকিং কনফার্ম না হলে গরু ডেলিভারি দেওয়া হবে না।</li></ul></section>
        </aside>

        <section className="payment-main-card"><h1>পেমেন্ট সম্পন্ন করুন</h1><PaymentForm amount={cow.price} cowId={cow.id} paymentType="full"/></section>
      </div>

      <section className="payment-faq"><h2>সচরাচর জিজ্ঞাসা (FAQ)</h2><div>{faqs.map(([question, answer]) => <details key={question}><summary>{question}<span>⌄</span></summary><p>{answer}</p></details>)}</div></section>
    </div>

    <SiteFooter/>
  </main>;
}
