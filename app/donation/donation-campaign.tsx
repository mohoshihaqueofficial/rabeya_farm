"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { bnNumber, type Cow } from "@/data/cattle";

type Donation = { id: string; name: string; mobile: string; amount: number; paymentMethod: string; transactionId: string; createdAt: string };
type CampaignState = { raised: number; donorCount: number; recent: Donation[] };

const storageKey = "rabeya-farm-donation-campaign-v1";
const emptyCampaign: CampaignState = { raised: 0, donorCount: 0, recent: [] };

export default function DonationCampaign({ cow }: { cow: Cow }) {
  const [campaign, setCampaign] = useState<CampaignState>(emptyCampaign);
  const [amount, setAmount] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("bKash");
  const [transactionId, setTransactionId] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [error, setError] = useState("");
  const [confirmation, setConfirmation] = useState<Donation | null>(null);
  const channelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    const hydrationFrame = window.requestAnimationFrame(() => {
      const saved = window.localStorage.getItem(storageKey);
      if (saved) {
        try { setCampaign(JSON.parse(saved) as CampaignState); } catch { window.localStorage.removeItem(storageKey); }
      }
    });

    if ("BroadcastChannel" in window) {
      const channel = new BroadcastChannel(storageKey);
      channel.onmessage = event => setCampaign(event.data as CampaignState);
      channelRef.current = channel;
    }
    function syncFromStorage(event: StorageEvent) {
      if (event.key === storageKey && event.newValue) setCampaign(JSON.parse(event.newValue) as CampaignState);
    }
    window.addEventListener("storage", syncFromStorage);
    return () => { window.cancelAnimationFrame(hydrationFrame); channelRef.current?.close(); window.removeEventListener("storage", syncFromStorage); };
  }, []);

  const due = Math.max(cow.price - campaign.raised, 0);
  const progress = Math.min((campaign.raised / cow.price) * 100, 100);
  const progressLabel = useMemo(() => `${Math.round(progress)}%`, [progress]);

  function submitDonation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount < 1) {
      setError("কমপক্ষে ১ টাকা লিখুন।");
      return;
    }
    if (numericAmount > due) {
      setError(`এই campaign-এ সর্বোচ্চ ৳ ${bnNumber(due)} টাকা বাকি আছে।`);
      return;
    }

    const donation: Donation = {
      id: `DN-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
      name: anonymous || !name.trim() ? "নাম প্রকাশে অনিচ্ছুক" : name.trim(),
      mobile,
      amount: numericAmount,
      paymentMethod,
      transactionId: transactionId.trim(),
      createdAt: new Date().toLocaleString("bn-BD", { dateStyle: "medium", timeStyle: "short" }),
    };
    const next: CampaignState = {
      raised: campaign.raised + numericAmount,
      donorCount: campaign.donorCount + 1,
      recent: [donation, ...campaign.recent].slice(0, 8),
    };
    setCampaign(next);
    window.localStorage.setItem(storageKey, JSON.stringify(next));
    channelRef.current?.postMessage(next);
    setConfirmation(donation);
    setAmount("");
    setName("");
    setMobile("");
    setTransactionId("");
    setAnonymous(false);
    setError("");
  }

  return <>
    {confirmation && <div className="donation-modal-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) setConfirmation(null); }}>
      <section className="donation-modal" role="dialog" aria-modal="true" aria-labelledby="donation-success-title"><button type="button" className="donation-modal-close" aria-label="পপআপ বন্ধ করুন" onClick={() => setConfirmation(null)}>×</button><span className="donation-success-icon">♥</span><h2 id="donation-success-title">ডোনেশনের তথ্য জমা হয়েছে</h2><p>আপনার <strong>৳ {bnNumber(confirmation.amount)}</strong> টাকার {confirmation.paymentMethod} payment তথ্য গ্রহণ করা হয়েছে।</p><div><small>Donation ID</small><b>{confirmation.id}</b></div><small>প্রকৃত transaction যাচাই করতে backend/admin approval প্রয়োজন।</small><button type="button" className="donation-modal-action" onClick={() => setConfirmation(null)}>ঠিক আছে</button></section>
    </div>}

    <section className="donation-live-card" aria-labelledby="donation-campaign-title">
      <div className="donation-cow"><div className="donation-cow-image"><Image src="/Home/qurbani-donation-distribution-optimized.jpg" alt="গ্রামীণ এলাকায় অসহায় পরিবারের মাঝে কোরবানির মাংস বিতরণ" fill priority sizes="(max-width: 760px) 100vw, 48vw" style={{ objectPosition: "center" }}/><span>কোরবানি ডোনেশন ২০২৬</span></div><div className="donation-recipients"><p>কোরবানির মাংস বিতরণ</p><h2 id="donation-campaign-title">কারা এই মাংস পাবেন?</h2><ol><li><b>১</b><span>দরিদ্র পরিবার, যারা সামর্থ্যের অভাবে কোরবানি দিতে পারবেন না</span></li><li><b>২</b><span>ফকির ও মিসকিন</span></li><li><b>৩</b><span>মধ্যবিত্ত পরিবার, যারা আর্থিক সংকটের কারণে কোরবানি দিতে পারেননি</span></li><li><b>৪</b><span>ইসলামি কাজে নিয়োজিত এমন ব্যক্তি, যিনি কোরবানি দিতে পারেননি</span></li></ol></div></div>

      <div className="donation-panel">
        <div className="live-indicator"><i/> LIVE CAMPAIGN</div>
        <h2>আপনার সামর্থ্য অনুযায়ী ডোনেট করুন</h2>
        <blockquote className="donation-hadith"><p>“ইসলামের উত্তম কাজ হলো মানুষকে খাবার খাওয়ানো এবং পরিচিত-অপরিচিত সবাইকে সালাম দেওয়া।”</p><cite>— রাসুলুল্লাহ ﷺ · <a href="https://sunnah.com/bukhari/2/5" target="_blank" rel="noopener noreferrer">সহিহ আল-বুখারি, হাদিস ১২</a></cite></blockquote>
        <div className="donation-stats"><div><small>লক্ষ্যমাত্রা</small><strong>৳ {bnNumber(cow.price)}</strong></div><div><small>এখন পর্যন্ত উঠেছে</small><strong>৳ {bnNumber(campaign.raised)}</strong></div><div><small>বাকি আছে</small><strong>৳ {bnNumber(due)}</strong></div><div><small>মোট ডোনার</small><strong>{bnNumber(campaign.donorCount)} জন</strong></div></div>
        <div className="donation-progress" aria-label={`ডোনেশন progress ${progressLabel}`}><div style={{ width: `${progress}%` }}/></div><div className="donation-progress-label"><span>{progressLabel} সম্পন্ন</span><span>Live update</span></div>

        {due > 0 ? <form className="donation-form" onSubmit={submitDonation}>
          <label className="anonymous-check"><input type="checkbox" checked={anonymous} onChange={event => { const checked = event.target.checked; setAnonymous(checked); if (checked) { setName(""); setMobile(""); } }}/> নাম ও মোবাইল নম্বর প্রকাশ করতে চাই না</label>
          <div className="donor-fields-grid"><label>আপনার নাম <small>(ঐচ্ছিক)</small><input name="donorName" type="text" placeholder="নাম লিখুন" value={name} disabled={anonymous} onChange={event => setName(event.target.value)}/></label><label>মোবাইল নম্বর <em>*</em><input required={!anonymous} name="mobile" type="tel" inputMode="tel" autoComplete="tel" placeholder="01XXXXXXXXX" pattern="01[3-9][0-9]{8}" value={mobile} disabled={anonymous} onChange={event => setMobile(event.target.value)}/></label></div>
          <label>ডোনেশনের পরিমাণ (৳) <em>*</em><input required name="amount" type="number" min="1" max={due} step="1" inputMode="numeric" placeholder="যে পরিমাণ ডোনেট করতে চান" value={amount} onChange={event => { setAmount(event.target.value); setError(""); }}/></label>
          <div className="donation-presets" aria-label="দ্রুত amount নির্বাচন">{[500, 1000, 5000, 10000].filter(value => value <= due).map(value => <button key={value} type="button" onClick={() => { setAmount(String(value)); setError(""); }}>৳ {bnNumber(value)}</button>)}</div>
          <div className="donor-fields-grid"><label>পেমেন্ট মাধ্যম <em>*</em><select required name="paymentMethod" value={paymentMethod} onChange={event => setPaymentMethod(event.target.value)}><option>bKash</option><option>Nagad</option><option>Rocket</option><option>Bank Transfer</option></select></label><label>Transaction ID <em>*</em><input required name="transactionId" type="text" placeholder="যেমন: 9F8A3K7L2M" value={transactionId} onChange={event => setTransactionId(event.target.value)}/></label></div>
          {error && <p className="donation-error" role="alert">{error}</p>}
          <button className="donation-submit" type="submit">ডোনেশনের তথ্য জমা দিন</button>
          <small className="donation-demo-note">Payment number ফোন/WhatsApp-এ নিশ্চিত না করে টাকা পাঠাবেন না।</small>
        </form> : <div className="campaign-complete"><span>✓</span><h3>লক্ষ্যমাত্রা পূর্ণ হয়েছে</h3><p>সবার সহযোগিতার জন্য আন্তরিক ধন্যবাদ।</p></div>}
      </div>
    </section>

  </>;
}
