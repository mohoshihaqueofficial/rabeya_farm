import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import CattleCatalogue from "./catalogue";
import SiteHeader from "@/app/components/site-header";
import SiteFooter from "@/app/components/site-footer";
import "./catalogue.css";

export const metadata: Metadata = { title: "কোরবানির গরু | রাবেয়া ফার্ম", description: "দাম, ওজন ও রঙ অনুযায়ী আপনার পছন্দের কোরবানির গরু খুঁজুন।" };

export default function KorbaniGoruPage() {
  return <main className="catalogue-page">
    <SiteHeader active="cattle" />
    <section className="catalogue-banner">
      <Image src="/Home/rabeya-hero.png" alt="সবুজ মাঠে সাদা ব্রাহমা গরু" fill preload sizes="100vw" />
      <div className="catalogue-banner-shade" />
      <div className="shell catalogue-banner-content">
        <Link href="/" className="catalogue-back">← হোমে ফিরুন</Link>
        <p>নিজস্ব খামারে লালিত, সুস্থ ও সবল গরু</p>
        <h1>কোরবানির জন্য <span>সেরা গরু</span></h1>
        <p className="catalogue-banner-copy">দাম, ওজন ও রঙ মিলিয়ে খুঁজে নিন আপনার পছন্দের গরুটি।</p>
      </div>
    </section>
    <CattleCatalogue />
    <SiteFooter/>
  </main>;
}
