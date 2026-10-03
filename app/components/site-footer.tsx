import Image from "next/image";
import Link from "next/link";

export default function SiteFooter() {
  return <footer className="shared-site-footer">
    <div className="shell shared-footer-grid">
      <div className="shared-footer-brand"><Link href="/" aria-label="রাবেয়া ফার্ম হোম"><Image src="/Home/Logo/RF_Logo.png" alt="রাবেয়া ফার্ম" width={190} height={64} className="shared-footer-logo" style={{ height: "auto" }}/></Link><p>যত্ন, স্বচ্ছতা ও বিশ্বাস—এই তিনটি মূল্যবোধে গড়ে উঠেছে রাবেয়া ফার্ম।</p></div>
      <div><h2>দ্রুত লিংক</h2><Link href="/">হোম</Link><Link href="/korbani-goru">কোরবানির গরু</Link><Link href="/donation">আমাদের ডোনেশন</Link><Link href="/blog">ব্লগ</Link><Link href="/about">আমাদের সম্পর্কে</Link></div>
      <div><h2>সহায়তা</h2><Link href="/#faq">সাধারণ জিজ্ঞাসা</Link><Link href="/contact">যোগাযোগ</Link><Link href="/account?mode=login">লগইন</Link><Link href="/account?mode=signup">সাইন আপ</Link></div>
      <div><h2>যোগাযোগ করুন</h2><a href="tel:01712345678">০১৭১২–৩৪৫৬৭৮</a><a href="mailto:info@rabeyafarm.com">info@rabeyafarm.com</a><a href="https://www.facebook.com/rabeyafarm" target="_blank" rel="noopener noreferrer">Facebook ↗</a><span><b>Farm:</b> উত্তর মানিকপুর, সেনবাগ, নোয়াখালী</span><span><b>ঢাকা অফিস:</b> ২৫, Rowshon Complex, মিরপুর–১৩</span></div>
    </div>
    <div className="shell shared-footer-bottom"><span>© {new Date().getFullYear()} Rabeya Farm. সর্বস্বত্ব সংরক্ষিত।</span><span>যত্নে গড়া, বিশ্বাসে বড়</span></div>
  </footer>;
}
