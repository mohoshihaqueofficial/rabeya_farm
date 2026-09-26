import Image from "next/image";
import Link from "next/link";
import SiteHeader from "@/app/components/site-header";
import SiteFooter from "@/app/components/site-footer";
import ReviewsCarousel from "@/app/components/reviews-carousel";
import { activePartners } from "@/data/partners";

const cattle = [
  { id: "RF–101", name: "সাদা ব্রাহমা", weight: "৬২০ কেজি", price: "২,৯০,০০০", src: "/Home/rabeya-hero.png", position: "82% center" },
  { id: "RF–102", name: "দেশি লাল", weight: "৫৮০ কেজি", price: "২,৪৫,০০০", src: "/Home/rabeya-cattle.png", position: "12% center" },
  { id: "RF–103", name: "কালো সাহিওয়াল", weight: "৬৬০ কেজি", price: "৩,১০,০০০", src: "/Home/rabeya-cattle.png", position: "50% center" },
];
const faqs = [
  ["কোরবানির জন্য গরু কীভাবে বুক করব?", "পছন্দের গরুর কোড জানিয়ে ফোন বা WhatsApp-এ যোগাযোগ করুন। আমাদের টিম বুকিং ও পেমেন্টের পুরো প্রক্রিয়াটি বুঝিয়ে দেবে।"],
  ["গরুর লাইভ ভিডিও দেখা যাবে?", "জি, অনুরোধ করলে নির্ধারিত সময়ে ভিডিও কল বা হালনাগাদ ভিডিওর ব্যবস্থা করা হবে।"],
  ["ঢাকার বাইরে ডেলিভারি আছে?", "অবশ্যই। দূরত্ব ও পরিবহন সুবিধা অনুযায়ী দেশের বিভিন্ন জেলায় নিরাপদ ডেলিভারি দেওয়া হয়।"],
  ["গরুর স্বাস্থ্য পরীক্ষা করা হয় কি?", "প্রতিটি গরু নিয়মিত পর্যবেক্ষণে থাকে এবং প্রয়োজন অনুযায়ী ভেটেরিনারি চেকআপ করা হয়।"],
];

type IconName = "phone" | "pin" | "shield" | "truck" | "leaf" | "arrow" | "play" | "menu";
function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths = {
    phone: <path d="M6.6 10.8a15.5 15.5 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.24c1.1.36 2.28.55 3.45.55a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.55 21 3 13.45 3 4.15a1 1 0 0 1 1-1H7.5a1 1 0 0 1 1 1c0 1.18.2 2.34.56 3.45a1 1 0 0 1-.25 1Z" />,
    pin: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
    shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-5"/></>,
    truck: <><path d="M3 6h11v10H3zM14 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></>,
    leaf: <><path d="M20 4C12 4 5 8 5 16c6 2 13-1 15-12Z"/><path d="M4 21c3-7 8-12 15-16"/></>,
    arrow: <><path d="M5 12h14"/><path d="m14 7 5 5-5 5"/></>,
    play: <path d="m9 7 8 5-8 5Z"/>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}
export default function Home() {
  return <main id="home">
    <SiteHeader active="home" />

    <section className="hero-section">
      <Image src="/Home/Homepage/2.jpg" alt="রাবেয়া ফার্মের পরিচ্ছন্ন শেডে বিশ্রামরত গরু" fill priority sizes="100vw" className="hero-image hero-farm-image"/>
      <div className="hero-shade"/>
      <div className="shell hero-content">
        <div className="hero-copy-block"><p className="kicker"><span/> বিশ্বস্ততার খামার, আপনার পরিবারের জন্য</p><h1>হাটে না ঘেঁটে,<br/><em>গরু কিনুন নেটে</em></h1><p className="hero-copy">নিজস্ব খামারে প্রাকৃতিক খাবার ও নিয়মিত যত্নে বেড়ে ওঠা সুস্থ গরু। নিশ্চিন্তে পছন্দ করুন, দায়িত্ব আমাদের।</p><div className="hero-actions"><Link href="/korbani-goru" className="button button-dark">গরু দেখুন <Icon name="arrow"/></Link><Link href="tel:01712345678" className="button button-white"><Icon name="phone"/> কথা বলুন</Link></div></div>
        <div className="hero-trust"><span><b>১০০%</b> প্রাকৃতিক খাবার</span><span><b>৫০০+</b> সন্তুষ্ট ক্রেতা</span><span><b>২৪/৭</b> সহায়তা</span></div>
      </div>
    </section>

    <section id="cattle" className="section shell"><div className="section-heading"><div><p className="eyebrow"><Icon name="leaf"/> আমাদের সংগ্রহ</p><h2>আপনার পছন্দের গরুটি বেছে নিন</h2></div><Link href="/korbani-goru" className="text-link">সব গরু দেখুন <Icon name="arrow"/></Link></div><div className="cattle-grid">{cattle.map((cow,index)=><article className="cow-card" key={cow.id}><div className="cow-photo"><Image src={cow.src} alt={cow.name} fill sizes="(max-width: 700px) 100vw, 33vw" style={{objectPosition:cow.position}}/><span>{index===0?"নতুন":"পছন্দের"}</span></div><div className="cow-info"><div><p>{cow.id}</p><h3>{cow.name}</h3></div><dl><div><dt>ওজন</dt><dd>{cow.weight}</dd></div><div><dt>মূল্য</dt><dd>৳ {cow.price}</dd></div></dl><Link href={`/korbani-goru/RB-${101 + index}`} className="card-link">বিস্তারিত দেখুন <Icon name="arrow" size={17}/></Link></div></article>)}</div></section>

    <section id="about" className="story-section delivery-story"><div className="shell story-grid"><div className="story-copy"><p className="eyebrow light"><Icon name="truck"/> নিজস্ব গাড়িতে হোম ডেলিভারি</p><h2>অনলাইনে অর্ডার করুন,<br/>গরু পৌঁছে যাবে বাড়িতে</h2><p>হাটের ভিড় ও যাতায়াতের ঝামেলা ছাড়াই ঘরে বসে পছন্দের গরু অর্ডার করুন। আমাদের প্রশিক্ষিত কর্মী নিজস্ব গাড়িতে নিরাপদভাবে আপনার দেওয়া ঠিকানায় গরু পৌঁছে দেবেন।</p><div className="delivery-points"><span>✓ যত্নশীল পরিবহন</span><span>✓ নির্ধারিত সময়ে পৌঁছানো</span></div><Link href="/korbani-goru" className="button button-lime">পছন্দের গরু দেখুন <Icon name="arrow"/></Link></div><div className="story-visual delivery-visual"><Image src="/Home/rabeya-home-delivery.png" alt="রাবেয়া ফার্মের নিজস্ব গাড়িতে গ্রাহকের বাড়িতে গরু ডেলিভারি" fill sizes="(max-width: 900px) 100vw, 56vw" quality={85}/><div className="story-badge delivery-badge"><span className="delivery-badge-icon"><Icon name="truck" size={24}/></span><span><b>নিজস্ব গাড়ি</b>সরাসরি আপনার বাড়িতে</span></div></div></div></section>

    <section className="features shell"><article><span><Icon name="leaf" size={28}/></span><div><h3>প্রাকৃতিক খাবার</h3><p>নিজস্ব তত্ত্বাবধানে ঘাস ও সুষম খাবার</p></div></article><article><span><Icon name="shield" size={28}/></span><div><h3>স্বাস্থ্য ও নিরাপত্তা</h3><p>নিয়মিত পর্যবেক্ষণ ও পরিচ্ছন্ন পরিবেশ</p></div></article><article><span><Icon name="truck" size={29}/></span><div><h3>নিরাপদ ডেলিভারি</h3><p>সময়মতো আপনার ঠিকানায় পৌঁছে দেওয়া</p></div></article></section>

    <section className="reviews-section"><div className="shell reviews-heading"><div className="center-heading"><p className="eyebrow"><Icon name="leaf"/> ক্রেতাদের ভালোবাসা</p><h2>আমাদের ক্রেতারা যা বলেন</h2><span>বাস্তব অভিজ্ঞতা, বিশ্বাসের সম্পর্ক</span></div></div><ReviewsCarousel/></section>

    <section className="partners-section" aria-labelledby="partners-title"><div className="shell partners-heading"><p>একসঙ্গে এগিয়ে চলা</p><h2 id="partners-title">Our Partners</h2></div><div className="partners-marquee"><div className="partners-track">{[0, 1].flatMap(copy => activePartners.map(partner => <div className="partner-logo" key={`${copy}-${partner.id}`} aria-hidden={copy === 1 ? "true" : undefined}><div className="partner-logo-image"><Image src={partner.logo} alt="" fill sizes="52px"/></div><span>{partner.name}</span></div>))}</div></div></section>

    <section id="faq" className="faq-section shell"><div className="faq-intro"><p className="eyebrow"><Icon name="leaf"/> সাধারণ জিজ্ঞাসা</p><h2>কিছু জানতে<br/>চান?</h2><p>আরও কোনো প্রশ্ন থাকলে আমাদের টিমের সঙ্গে সরাসরি কথা বলুন।</p><Link href="tel:01712345678" className="text-link"><Icon name="phone"/> ০১৭১২–৩৪৫৬৭৮</Link></div><div className="faq-list">{faqs.map((faq,index)=><details key={faq[0]} open={index===0}><summary>{faq[0]}<span>+</span></summary><p>{faq[1]}</p></details>)}</div></section>

    <section id="contact" className="cta-section"><div className="shell cta-inner"><div><p>আপনার কোরবানির গরু আজই বুক করুন</p><h2>বিশ্বাসের সঙ্গে<br/>শুরু হোক প্রস্তুতি।</h2></div><div><Link href="tel:01712345678" className="button button-lime"><Icon name="phone"/> এখনই কল করুন</Link><small>প্রতিদিন সকাল ৮টা—রাত ১০টা</small></div></div></section>
    <SiteFooter/>
  </main>;
}
