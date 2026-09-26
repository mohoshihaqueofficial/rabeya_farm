import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/app/components/site-header";
import SiteFooter from "@/app/components/site-footer";
import { catalogue } from "@/data/cattle";
import DonationCampaign from "./donation-campaign";
import "./donation.css";

export const metadata: Metadata = { title: "আমাদের ডোনেশন | রাবেয়া ফার্ম", description: "অসহায় পরিবারের কোরবানির মাংসের জন্য রাবেয়া ফার্মের গরু ক্রয় campaign-এ সহযোগিতা করুন।" };

export default function DonationPage() {
  const campaignCow = catalogue[0];
  return <main className="donation-page"><SiteHeader active="donation"/>
    <section className="donation-hero"><div className="shell"><p>একসঙ্গে ছড়িয়ে দিই ঈদের আনন্দ</p><h1>আপনার সামান্য সহযোগিতায় একটি পরিবারের মুখে হাসি</h1><span>সবার ছোট ছোট ডোনেশনে গরুটি কেনা হবে এবং কোরবানির ঈদের দিন মাংস পৌঁছে যাবে অসহায় মানুষের কাছে।</span><a href="#donate-now">এখনই ডোনেট করুন ↓</a></div></section>
    <div className="shell donation-content"><nav className="donation-breadcrumb" aria-label="Breadcrumb"><Link href="/">হোম</Link><span>/</span><span aria-current="page">আমাদের ডোনেশন</span></nav><div id="donate-now"><DonationCampaign cow={campaignCow}/></div>
      <section className="donation-purpose"><div><p>এই উদ্যোগ কেন</p><h2>কোরবানির আনন্দ সবার জন্য</h2><span>আমাদের লক্ষ্য এমন পরিবারগুলোর কাছে মাংস পৌঁছে দেওয়া, যারা আর্থিক অসচ্ছলতার কারণে কোরবানি দিতে পারেন না বা ঈদের দিনও পর্যাপ্ত খাবার পান না।</span></div><div className="purpose-steps"><article><b>১</b><h3>ডোনেশন সংগ্রহ</h3><p>সামর্থ্য অনুযায়ী সবার সহযোগিতা একত্র করা হবে।</p></article><article><b>২</b><h3>গরু ক্রয় ও কোরবানি</h3><p>সংগৃহীত অর্থে নির্বাচিত গরুটি কোরবানি করা হবে।</p></article><article><b>৩</b><h3>মাংস বিতরণ</h3><p>যাচাইকৃত অসহায় পরিবারগুলোর কাছে সম্মানের সঙ্গে পৌঁছে দেওয়া হবে।</p></article></div></section>
      <section className="donation-trust"><h2>স্বচ্ছতা ও দায়িত্ব</h2><div><article><span>✓</span><p>Target, live amount, donor count ও due amount সবার জন্য দৃশ্যমান থাকবে।</p></article><article><span>✓</span><p>Campaign সম্পন্ন হলে ক্রয় ও বিতরণের update প্রকাশ করা হবে।</p></article><article><span>✓</span><p>সাহায্য গ্রহণকারী পরিবারের মর্যাদা ও ব্যক্তিগত তথ্য রক্ষা করা হবে।</p></article></div></section>
      <section className="donation-faq"><h2>সাধারণ জিজ্ঞাসা</h2><details><summary>সর্বনিম্ন কত টাকা ডোনেট করা যাবে?<span>+</span></summary><p>১ টাকা থেকে শুরু করে আপনার সামর্থ্য অনুযায়ী যেকোনো amount দিতে পারবেন।</p></details><details><summary>ডোনেশনের টাকা কী কাজে ব্যবহার হবে?<span>+</span></summary><p>Campaign-এর নির্বাচিত গরু কেনা, কোরবানি এবং প্রয়োজনীয় বিতরণ ব্যবস্থায় ব্যবহার হবে।</p></details><details><summary>Live amount কীভাবে update হবে?<span>+</span></summary><p>বর্তমান demo-তে একই browser-এর tab-এ সঙ্গে সঙ্গে update হয়। Production-এ verified payment database থেকে real-time update হবে।</p></details></section>
    </div>
    <SiteFooter/>
  </main>;
}
