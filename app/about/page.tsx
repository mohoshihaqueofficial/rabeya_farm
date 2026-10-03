import type { Metadata } from "next";
import SiteFooter from "@/app/components/site-footer";
import SiteHeader from "@/app/components/site-header";
import "./about.css";

export const metadata: Metadata = {
  title: "আমাদের সম্পর্কে | রাবেয়া ফার্ম",
  description: "রাবেয়া ফার্মের মিশন ও ভিশন।",
};

export default function AboutPage() {
  return <main className="about-page-simple">
    <SiteHeader active="about" />

    <section className="about-video-section shell">
      <div className="about-video-frame">
        <iframe src="https://www.youtube.com/embed/I8sRPf5TVO8" title="রাবেয়া ফার্ম সম্পর্কে ভিডিও" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
      </div>
      <div className="about-video-copy">
        <p>রাবেয়া ফার্ম</p>
        <h1>আমাদের সম্পর্কে</h1>
        <span>আমাদের খামার, পরিচর্যা এবং মানুষের কাছে নিরাপদ খাদ্য পৌঁছে দেওয়ার গল্পটি ভিডিওতে দেখুন।</span>
      </div>
    </section>

    <section className="about-statement mission">
      <div className="shell">
        <p>আমাদের Mission</p>
        <h2>মানুষের কাছে প্রয়োজনীয় প্রোটিন নিশ্চিত করা</h2>
        <span>বিশ্বস্ত উৎস, দায়িত্বশীল পরিচর্যা ও সহজলভ্যতার মাধ্যমে আরও বেশি মানুষের কাছে মানসম্মত প্রাণিজ প্রোটিন পৌঁছে দেওয়া।</span>
      </div>
    </section>

    <section className="about-statement vision">
      <div className="shell">
        <p>আমাদের Vision</p>
        <h2>সেরা organic ও ভেজালমুক্ত মাংস পৌঁছে দেওয়া</h2>
        <span>পরিচ্ছন্ন পরিবেশে লালন-পালন এবং স্বচ্ছ ব্যবস্থাপনার মাধ্যমে পরিবারের জন্য নিরাপদ ও ভেজালমুক্ত মাংস নিশ্চিত করা।</span>
      </div>
    </section>

    <SiteFooter />
  </main>;
}
