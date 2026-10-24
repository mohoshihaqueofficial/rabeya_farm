"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { partnerStorageKey, partners as initialPartners, type Partner } from "@/data/partners";
import { Icon } from "../components/icons";

type PartnerForm = { name: string; agreementPhoto: string };
const emptyForm: PartnerForm = { name: "", agreementPhoto: "" };

export default function AdminPartnersPage() {
  const [items, setItems] = useState<Partner[]>(initialPartners);
  const [form, setForm] = useState<PartnerForm>(emptyForm);
  const [message, setMessage] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem(partnerStorageKey);
    if (!saved) return;
    const timer = window.setTimeout(() => { try { setItems(JSON.parse(saved)); } catch {} }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  function persist(next: Partner[]) { setItems(next); window.localStorage.setItem(partnerStorageKey, JSON.stringify(next)); }
  function choosePhoto(file?: File) {
    setMessage("");
    if (!file) return;
    if (!file.type.startsWith("image/")) { setMessage("শুধু JPG, PNG বা WebP ছবি নির্বাচন করুন।"); return; }
    if (file.size > 1_500_000) { setMessage("ছবিটি ১.৫MB-এর মধ্যে রাখুন।"); return; }
    const reader = new FileReader();
    reader.onload = () => setForm(current => ({ ...current, agreementPhoto: String(reader.result) }));
    reader.readAsDataURL(file);
  }
  function addPartner(event: React.FormEvent) {
    event.preventDefault();
    if (!form.agreementPhoto) { setMessage("MoU স্বাক্ষরের একটি ছবি নির্বাচন করুন।"); return; }
    const next: Partner = { ...form, id: `mou-${Date.now()}`, active: true, sortOrder: items.length + 1 };
    persist([...items, next]); setForm(emptyForm); if (fileInput.current) fileInput.current.value = ""; setMessage("নতুন MoU পার্টনার homepage-এ প্রকাশিত হয়েছে।");
  }
  function togglePartner(id: string) { persist(items.map(item => item.id === id ? { ...item, active: !item.active } : item)); }

  return <main className="admin-page">
    <div className="admin-page-heading"><div><p className="admin-breadcrumb"><Link href="/admin">ড্যাশবোর্ড</Link><span>/</span> MoU পার্টনার</p><h1>MoU পার্টনার</h1><p>সমঝোতা চুক্তির ছবি ও প্রতিষ্ঠানের নাম homepage-এ প্রকাশ করুন।</p></div><Link href="/#partners-title" target="_blank" className="admin-secondary"><Icon name="eye"/> Homepage দেখুন</Link></div>
    <div className="partner-admin-layout">
      <section className="admin-card partner-upload-card"><div className="section-title"><div><h2>নতুন MoU যোগ করুন</h2><p>স্বাক্ষরের ছবি ও কোম্পানির নাম দিন।</p></div><span><Icon name="handshake"/></span></div>
        <form onSubmit={addPartner} className="partner-form">
          <label className={`mou-uploader ${form.agreementPhoto ? "has-photo" : ""}`}><input ref={fileInput} type="file" accept="image/png,image/jpeg,image/webp" onChange={event => choosePhoto(event.target.files?.[0])}/>{form.agreementPhoto ? <Image src={form.agreementPhoto} alt="MoU ছবির preview" fill unoptimized/> : <><span><Icon name="upload" size={23}/></span><b>MoU স্বাক্ষরের ছবি আপলোড</b><small>JPG, PNG বা WebP · সর্বোচ্চ ১.৫MB</small></>}</label>
          <label className="partner-input">কোম্পানির নাম<input required value={form.name} onChange={event=>setForm({...form,name:event.target.value})} placeholder="যেমন: Green Feed Ltd."/></label>
          <p className="partner-form-message" role="status">{message}</p><button className="admin-primary" type="submit"><Icon name="save"/> সংরক্ষণ ও প্রকাশ করুন</button>
        </form>
      </section>
      <section className="admin-card partner-records"><div className="section-title"><div><h2>বর্তমান চুক্তিসমূহ</h2><p>{items.length}টি প্রতিষ্ঠানের MoU record</p></div></div><div className="partner-record-list">{items.map(item=><article key={item.id}><div className="partner-record-photo"><Image src={item.agreementPhoto} alt="" fill sizes="120px" unoptimized={item.agreementPhoto.startsWith("data:")}/></div><div><h3>{item.name}</h3></div><label className="publish-switch"><input type="checkbox" checked={item.active} onChange={()=>togglePartner(item.id)}/><span/><b>{item.active ? "প্রকাশিত" : "লুকানো"}</b></label></article>)}</div></section>
    </div>
  </main>;
}
