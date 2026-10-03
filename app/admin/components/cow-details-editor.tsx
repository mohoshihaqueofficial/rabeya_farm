"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { adminCattle, adminCowStorageKey, colorLabels, cowStatusLabels, type AdminCow, type CowStatus } from "@/data/admin-cattle";
import { bnNumber, type CowColor } from "@/data/cattle";
import { Icon } from "./icons";

type Tab = "details" | "health" | "media" | "activity";
const media = ["/Home/rabeya-cattle-optimized.jpg", "/Home/Homepage/2.jpg", "/Home/Homepage/1.jpg"];

function Field({ label, children, full = false }: { label: string; children: React.ReactNode; full?: boolean }) {
  return <label className={full ? "form-field full" : "form-field"}><span>{label}</span>{children}</label>;
}

export default function CowDetailsEditor({ id }: { id: string }) {
  const isNew = id === "new";
  const baseCow = useMemo(() => adminCattle.find(c => c.id === id) ?? { ...adminCattle[0], id: isNew ? "RB-NEW" : id, name: "নতুন গরু", status: "draft" as CowStatus, views: 0, inquiries: 0 }, [id, isNew]);
  const [cow, setCow] = useState<AdminCow>(baseCow);
  const [tab, setTab] = useState<Tab>("details");
  const [saved, setSaved] = useState("");
  const [dirty, setDirty] = useState(false);
  const [hero, setHero] = useState(baseCow.image);

  useEffect(() => {
    const draft = window.localStorage.getItem(adminCowStorageKey(id));
    if (!draft) return;
    const timer = window.setTimeout(() => {
      try { setCow(JSON.parse(draft)); } catch {}
    }, 0);
    return () => window.clearTimeout(timer);
  }, [id]);

  function update<K extends keyof AdminCow>(key: K, value: AdminCow[K]) { setCow(current => ({ ...current, [key]: value })); setDirty(true); setSaved(""); }
  function save() { window.localStorage.setItem(adminCowStorageKey(id), JSON.stringify(cow)); setDirty(false); setSaved(isNew ? "নতুন গরুর ড্রাফট তৈরি হয়েছে" : "সব পরিবর্তন সংরক্ষিত হয়েছে"); window.setTimeout(()=>setSaved(""), 3000); }
  function reset() { setCow(baseCow); window.localStorage.removeItem(adminCowStorageKey(id)); setDirty(false); setSaved("ড্রাফট রিসেট করা হয়েছে"); }

  return <main className="admin-page cow-editor-page">
    <div className="editor-heading"><div><p className="admin-breadcrumb"><Link href="/admin">ড্যাশবোর্ড</Link><span>/</span><Link href="/admin/cows">গরুর তালিকা</Link><span>/</span>{isNew ? "নতুন গরু" : cow.id}</p><div className="editor-title-row"><h1>{cow.name}</h1><span className={`status-pill ${cow.status}`}><i/>{cowStatusLabels[cow.status]}</span></div><p>গরুর প্রোফাইল, স্বাস্থ্য ও প্রকাশিত তথ্য হালনাগাদ করুন।</p></div><div className="editor-actions"><span className="save-status" role="status">{saved || (dirty ? "সংরক্ষণ করা হয়নি" : "")}</span>{!isNew && <Link href={`/korbani-goru/${baseCow.id}`} target="_blank" className="admin-secondary"><Icon name="eye"/> লাইভ পেজ</Link>}<button className="admin-primary" onClick={save}><Icon name="save"/> {isNew ? "ড্রাফট তৈরি করুন" : "পরিবর্তন সংরক্ষণ"}</button></div></div>

    <div className="editor-layout">
      <aside className="cow-profile-card admin-card"><div className="profile-photo"><Image src={hero} alt={cow.name} fill priority sizes="300px" style={{objectPosition:cow.position}}/><button aria-label="ছবি পরিবর্তন" onClick={()=>setTab("media")}><Icon name="edit" size={16}/></button></div><h2>{cow.name}</h2><p>{cow.id}</p><div className="profile-quick-stats"><span><small>ওজন</small><b>{bnNumber(cow.weight)} কেজি</b></span><span><small>বয়স</small><b>{cow.age}</b></span></div><div className="profile-price"><small>বর্তমান বিক্রয় মূল্য</small><strong>৳ {bnNumber(cow.price)}</strong></div><label className="status-select-label">বিক্রয় অবস্থা<select value={cow.status} onChange={e=>update("status", e.target.value as CowStatus)}>{Object.entries(cowStatusLabels).map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></label><div className="profile-metrics"><span><Icon name="eye"/><b>{bnNumber(cow.views)}</b><small>পেজ ভিউ</small></span><span><Icon name="heart"/><b>{bnNumber(cow.inquiries)}</b><small>ইনকোয়ারি</small></span></div></aside>

      <section className="editor-content admin-card">
        <div className="editor-tabs">{([ ["details","মূল তথ্য"], ["health","স্বাস্থ্য ও যত্ন"], ["media","ছবি ও মিডিয়া"], ["activity","কার্যকলাপ"] ] as [Tab,string][]).map(([value,label])=><button key={value} className={tab===value?"active":""} onClick={()=>setTab(value)}>{label}</button>)}</div>
        {tab === "details" && <div className="editor-panel"><div className="section-title"><div><h2>গরুর মূল তথ্য</h2><p>ওয়েবসাইটে ক্রেতারা এই তথ্যগুলো দেখতে পাবেন।</p></div><span><Icon name="edit" size={18}/></span></div><div className="form-grid">
          <Field label="গরুর আইডি"><input value={cow.id} disabled/></Field><Field label="প্রদর্শিত নাম"><input value={cow.name} onChange={e=>update("name",e.target.value)}/></Field>
          <Field label="জাত / Breed"><input value={cow.breed} onChange={e=>update("breed",e.target.value)}/></Field><Field label="রঙ"><select value={cow.color} onChange={e=>update("color", e.target.value as CowColor)}>{Object.entries(colorLabels).map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></Field>
          <Field label="ওজন (কেজি)"><div className="input-suffix"><input type="number" value={cow.weight} onChange={e=>update("weight",Number(e.target.value))}/><span>কেজি</span></div></Field><Field label="বয়স"><input value={cow.age} onChange={e=>update("age",e.target.value)}/></Field>
          <Field label="বিক্রয় মূল্য"><div className="input-prefix"><span>৳</span><input type="number" value={cow.price} onChange={e=>update("price",Number(e.target.value))}/></div></Field><Field label="ক্রয় মূল্য (শুধু অ্যাডমিন)"><div className="input-prefix"><span>৳</span><input type="number" value={cow.purchasePrice} onChange={e=>update("purchasePrice",Number(e.target.value))}/></div></Field>
          <Field label="খামারের অবস্থান"><input value={cow.shed} onChange={e=>update("shed",e.target.value)}/></Field><Field label="উৎপত্তি"><input value={cow.origin} onChange={e=>update("origin",e.target.value)}/></Field>
          <Field label="বিশেষ নোট" full><textarea rows={4} value={cow.note} onChange={e=>update("note",e.target.value)}/><small>{cow.note.length}/৩০০ অক্ষর</small></Field>
        </div></div>}
        {tab === "health" && <div className="editor-panel"><div className="section-title"><div><h2>স্বাস্থ্য ও যত্ন</h2><p>গরুর সর্বশেষ স্বাস্থ্য পরীক্ষা এবং দৈনিক খাবারের তথ্য।</p></div><span className="healthy-badge"><Icon name="shield" size={17}/> স্বাস্থ্যকর</span></div><div className="form-grid"><Field label="বর্তমান স্বাস্থ্য"><select value={cow.health} onChange={e=>update("health",e.target.value)}><option>সুস্থ ও সক্রিয়</option><option>পর্যবেক্ষণে</option><option>চিকিৎসাধীন</option></select></Field><Field label="শেষ স্বাস্থ্য পরীক্ষা"><input value={cow.lastCheckup} onChange={e=>update("lastCheckup",e.target.value)}/></Field><Field label="টিকাদান"><select value={cow.vaccine} onChange={e=>update("vaccine",e.target.value)}><option>সম্পূর্ণ</option><option>পরবর্তী ডোজ বাকি</option><option>তথ্য নেই</option></select></Field><Field label="লিঙ্গ"><select value={cow.gender} onChange={e=>update("gender",e.target.value)}><option>ষাঁড়</option><option>গাভী</option></select></Field><Field label="দৈনিক খাদ্য তালিকা" full><textarea rows={4} value={cow.feed} onChange={e=>update("feed",e.target.value)}/></Field></div><div className="health-checklist"><h3>যত্নের চেকলিস্ট</h3>{["সকালের খাবার দেওয়া হয়েছে","পরিষ্কার পানি পরিবর্তন করা হয়েছে","শেড পরিষ্কার করা হয়েছে","দৈনিক পর্যবেক্ষণ সম্পন্ন"].map((text,index)=><label key={text}><input type="checkbox" defaultChecked={index<3}/><span><Icon name="check" size={13}/></span>{text}</label>)}</div></div>}
        {tab === "media" && <div className="editor-panel"><div className="section-title"><div><h2>ছবি ও মিডিয়া</h2><p>প্রধান ছবি বেছে নিন। প্রথম ছবিটি catalogue-এ দেখানো হবে।</p></div><button className="admin-secondary"><Icon name="plus"/> ছবি আপলোড</button></div><div className="media-grid">{media.map((src,index)=><button key={src} className={hero===src?"selected":""} onClick={()=>{setHero(src);update("image",src)}}><span><Image src={src} alt={`গরুর ছবি ${index+1}`} fill sizes="250px"/></span>{hero===src && <b><Icon name="check" size={13}/> প্রধান ছবি</b>}<i>{index+1}</i></button>)}<button className="media-upload"><Icon name="image" size={27}/><b>আরও ছবি যোগ করুন</b><small>PNG, JPG · সর্বোচ্চ ৮MB</small></button></div></div>}
        {tab === "activity" && <div className="editor-panel"><div className="section-title"><div><h2>সাম্প্রতিক কার্যকলাপ</h2><p>এই গরুর record-এ করা সর্বশেষ পরিবর্তন।</p></div></div><div className="activity-list"><article><span><Icon name="edit"/></span><div><b>বিক্রয় মূল্য পরিবর্তন করা হয়েছে</b><p>৳ {bnNumber(cow.price-5000)} থেকে ৳ {bnNumber(cow.price)}</p><small>আজ, সকাল ১০:৪২ · রাবেয়া অ্যাডমিন</small></div></article><article><span><Icon name="shield"/></span><div><b>স্বাস্থ্য পরীক্ষার তথ্য যোগ করা হয়েছে</b><p>{cow.health} · টিকাদান {cow.vaccine}</p><small>গতকাল, বিকাল ৪:১৮ · খামার ম্যানেজার</small></div></article><article><span><Icon name="image"/></span><div><b>৩টি নতুন ছবি আপলোড করা হয়েছে</b><p>প্রধান ছবিও হালনাগাদ করা হয়েছে</p><small>২৮ সেপ্টেম্বর ২০২৬ · রাবেয়া অ্যাডমিন</small></div></article></div></div>}
        <div className="editor-footer"><button className="danger-link" onClick={reset}>পরিবর্তন রিসেট করুন</button><div><button className="admin-secondary" onClick={()=>setCow(baseCow)}>বাতিল</button><button className="admin-primary" onClick={save}><Icon name="save"/> সংরক্ষণ করুন</button></div></div>
      </section>
    </div>
  </main>;
}

