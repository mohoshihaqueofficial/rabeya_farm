"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Icon } from "./icons";

export type CollectionItem = { id: string; image: string; active?: boolean };
export type FieldDef = { key: string; label: string; placeholder?: string; multiline?: boolean; required?: boolean };

type Props<T extends CollectionItem> = {
  title: string;
  description: string;
  formTitle: string;
  photoLabel: string;
  storageKey: string;
  initial: T[];
  fields: FieldDef[];
  makeItem: (values: Record<string, string>, image: string, id: string) => T;
  itemTitle: (item: T) => string;
  itemSubtitle?: (item: T) => string;
  previewHref: string;
};

const maxPhotoSize = 1_500_000;

// Shared admin editor for homepage photo collections (slider, reviews, advisors).
// Order in the list = order on the homepage; hidden items stay saved but are not shown.
export default function CollectionManager<T extends CollectionItem>({ title, description, formTitle, photoLabel, storageKey, initial, fields, makeItem, itemTitle, itemSubtitle, previewHref }: Props<T>) {
  const emptyValues = Object.fromEntries(fields.map(field => [field.key, ""]));
  const [items, setItems] = useState<T[]>(initial);
  const [values, setValues] = useState<Record<string, string>>(emptyValues);
  const [photo, setPhoto] = useState("");
  const [toast, setToast] = useState<{ text: string; tone: "success" | "error"; key: number } | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => { try { const saved = window.localStorage.getItem(storageKey); if (saved) setItems(JSON.parse(saved)); } catch {} }, 0);
    return () => window.clearTimeout(timer);
  }, [storageKey]);
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  function notify(text: string, tone: "success" | "error" = "success") { setToast(current => ({ text, tone, key: (current?.key ?? 0) + 1 })); }
  function persist(next: T[], message: string) {
    try { window.localStorage.setItem(storageKey, JSON.stringify(next)); }
    catch { notify("সংরক্ষণ করা যায়নি · ব্রাউজারের জায়গা পূর্ণ, কিছু ছবি মুছে আবার চেষ্টা করুন", "error"); return; }
    setItems(next); notify(message);
  }
  function choosePhoto(file?: File) {
    if (!file) return;
    if (!file.type.startsWith("image/")) { notify("শুধু JPG, PNG বা WebP ছবি নির্বাচন করুন", "error"); return; }
    if (file.size > maxPhotoSize) { notify("ছবিটি ১.৫MB-এর মধ্যে রাখুন", "error"); return; }
    const reader = new FileReader();
    reader.onload = () => setPhoto(String(reader.result));
    reader.readAsDataURL(file);
  }
  function add(event: React.FormEvent) {
    event.preventDefault();
    if (!photo) { notify("একটি ছবি নির্বাচন করুন", "error"); return; }
    const missing = fields.find(field => field.required && !values[field.key].trim());
    if (missing) { notify(`${missing.label} দিন`, "error"); return; }
    const trimmed = Object.fromEntries(Object.entries(values).map(([key, value]) => [key, value.trim()]));
    persist([...items, makeItem(trimmed, photo, `item-${Date.now()}`)], "যোগ হয়েছে · হোমপেজে দেখানো হচ্ছে");
    setValues(emptyValues); setPhoto(""); if (fileInput.current) fileInput.current.value = "";
  }
  function toggle(id: string) {
    const next = items.map(item => item.id === id ? { ...item, active: item.active === false } : item);
    persist(next, next.find(item => item.id === id)?.active === false ? "হোমপেজে লুকানো হয়েছে" : "হোমপেজে দেখানো হচ্ছে");
  }
  function remove(item: T) {
    if (!window.confirm(`"${itemTitle(item)}" মুছে ফেলবেন?`)) return;
    persist(items.filter(entry => entry.id !== item.id), "মুছে ফেলা হয়েছে");
  }
  function move(index: number, by: -1 | 1) {
    const next = [...items];
    [next[index], next[index + by]] = [next[index + by], next[index]];
    persist(next, "ক্রম পরিবর্তন হয়েছে");
  }

  const shown = items.filter(item => item.active !== false).length;

  return <main className="admin-page">
    <div className="admin-page-heading"><div><p className="admin-breadcrumb"><Link href="/admin">ড্যাশবোর্ড</Link><span>/</span> হোমপেজ <span>/</span> {title}</p><h1>{title}</h1><p>{description}</p></div><Link href={previewHref} target="_blank" className="admin-secondary"><Icon name="eye"/> Homepage দেখুন</Link></div>
    <div className="partner-admin-layout">
      <section className="admin-card partner-upload-card"><div className="section-title"><div><h2>{formTitle}</h2><p>ছবি ও তথ্য দিয়ে সংরক্ষণ করুন।</p></div><span><Icon name="plus"/></span></div>
        <form onSubmit={add} className="partner-form">
          <label className={`mou-uploader ${photo ? "has-photo" : ""}`}><input ref={fileInput} type="file" accept="image/png,image/jpeg,image/webp" onChange={event => choosePhoto(event.target.files?.[0])}/>{photo ? <Image src={photo} alt="ছবির preview" fill unoptimized/> : <><span><Icon name="upload" size={23}/></span><b>{photoLabel}</b><small>JPG, PNG বা WebP · সর্বোচ্চ ১.৫MB</small></>}</label>
          {fields.map(field => <label className="partner-input" key={field.key}>{field.label}{!field.required && <small className="optional-label"> (ঐচ্ছিক)</small>}{field.multiline ? <textarea rows={3} value={values[field.key]} onChange={event=>setValues({...values,[field.key]:event.target.value})} placeholder={field.placeholder}/> : <input value={values[field.key]} onChange={event=>setValues({...values,[field.key]:event.target.value})} placeholder={field.placeholder}/>}</label>)}
          <button className="admin-primary" type="submit"><Icon name="save"/> সংরক্ষণ ও প্রকাশ করুন</button>
        </form>
      </section>
      <section className="admin-card partner-records"><div className="section-title"><div><h2>বর্তমান তালিকা</h2><p>{items.length}টির মধ্যে {shown}টি হোমপেজে দেখানো হচ্ছে · তালিকার ক্রমেই হোমপেজে দেখাবে</p></div></div>
        {items.length === 0 && <div className="empty-state"><Icon name="image" size={28}/><b>এখনো কিছু যোগ করা হয়নি</b><p>বাম পাশের ফর্ম থেকে যোগ করুন।</p></div>}
        <div className="partner-record-list">{items.map((item,index)=><article key={item.id} className={item.active === false ? "is-hidden" : undefined}>
          <div className="partner-record-photo"><Image src={item.image} alt="" fill sizes="120px" unoptimized={item.image.startsWith("data:")}/></div>
          <div><h3>{itemTitle(item)}</h3>{itemSubtitle && <p>{itemSubtitle(item)}</p>}</div>
          <div className="collection-actions">
            <div className="collection-order"><button type="button" onClick={()=>move(index,-1)} disabled={index===0} aria-label="উপরে সরান">↑</button><button type="button" onClick={()=>move(index,1)} disabled={index===items.length-1} aria-label="নিচে সরান">↓</button></div>
            <label className="publish-switch"><input type="checkbox" checked={item.active !== false} onChange={()=>toggle(item.id)}/><span/><b>{item.active === false ? "লুকানো" : "প্রকাশিত"}</b></label>
            <button type="button" className="collection-delete" onClick={()=>remove(item)} aria-label={`${itemTitle(item)} মুছে ফেলুন`}>×</button>
          </div>
        </article>)}</div>
      </section>
    </div>
    {toast && <div key={toast.key} className={`admin-toast ${toast.tone}`} role={toast.tone === "error" ? "alert" : "status"}><span>{toast.tone === "success" ? <Icon name="check" size={15}/> : "!"}</span><p>{toast.text}</p><button type="button" onClick={()=>setToast(null)} aria-label="বন্ধ করুন">×</button></div>}
  </main>;
}
