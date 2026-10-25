"use client";

import Link from "next/link";
import { readStoredList } from "@/app/components/use-stored-list";
import { useEffect, useState } from "react";
import { faqs as defaultFaqs, faqStorageKey, maxHomepageFaqs, type Faq } from "@/data/faqs";
import { Icon } from "../../components/icons";
import AdminToast from "../../components/admin-toast";
import { useToast } from "../../components/use-admin-blogs";

const emptyForm = { question: "", answer: "", homepage: false };

// All active FAQs show on /faq; the ★ ones (max maxHomepageFaqs) also show on the homepage.
export default function AdminFaqPage() {
  const [items, setItems] = useState<Faq[]>(defaultFaqs);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState<string | null>(null);
  const { toast, notify, close } = useToast();

  useEffect(() => {
    const timer = window.setTimeout(() => { const saved = readStoredList<Faq>(faqStorageKey); if (saved) setItems(saved); }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const homepageCount = items.filter(faq => faq.homepage && faq.active).length;
  const fullMessage = `হোমপেজে সর্বোচ্চ ${maxHomepageFaqs}টি প্রশ্ন দেখানো যায় · আগে অন্য একটি সরান`;

  function persist(next: Faq[], message: string) {
    try { window.localStorage.setItem(faqStorageKey, JSON.stringify(next)); } catch { notify("সংরক্ষণ করা যায়নি", "error"); return false; }
    setItems(next); notify(message); return true;
  }
  function homepageFull(exceptId?: string) {
    return items.filter(faq => faq.homepage && faq.active && faq.id !== exceptId).length >= maxHomepageFaqs;
  }
  function submit(event: React.FormEvent) {
    event.preventDefault();
    const question = form.question.trim(), answer = form.answer.trim();
    if (!question || !answer) { notify("প্রশ্ন ও উত্তর দুটোই লিখুন", "error"); return; }
    if (form.homepage && homepageFull(editing ?? undefined)) { notify(fullMessage, "error"); return; }
    const id = `faq-${Math.max(0, ...items.map(faq => Number(faq.id.replace(/\D/g, "")) || 0)) + 1}`;
    const ok = editing
      ? persist(items.map(faq => faq.id === editing ? { ...faq, question, answer, homepage: form.homepage } : faq), "প্রশ্নটি হালনাগাদ হয়েছে")
      : persist([...items, { id, question, answer, homepage: form.homepage, active: true }], "নতুন প্রশ্ন যোগ হয়েছে");
    if (ok) { setForm(emptyForm); setEditing(null); }
  }
  function edit(faq: Faq) { setEditing(faq.id); setForm({ question: faq.question, answer: faq.answer, homepage: faq.homepage }); window.scrollTo({ top: 0, behavior: "smooth" }); }
  function cancelEdit() { setEditing(null); setForm(emptyForm); }
  function toggleActive(faq: Faq) { persist(items.map(item => item.id === faq.id ? { ...item, active: !item.active } : item), faq.active ? "প্রশ্নটি ওয়েবসাইটে লুকানো হয়েছে" : "প্রশ্নটি ওয়েবসাইটে দেখানো হচ্ছে"); }
  function toggleHomepage(faq: Faq) {
    if (!faq.homepage && homepageFull(faq.id)) { notify(fullMessage, "error"); return; }
    persist(items.map(item => item.id === faq.id ? { ...item, homepage: !item.homepage } : item), faq.homepage ? "হোমপেজ থেকে সরানো হয়েছে (FAQ পেজে থাকবে)" : "হোমপেজে দেখানো হচ্ছে");
  }
  function move(index: number, by: -1 | 1) { const next = [...items]; [next[index], next[index + by]] = [next[index + by], next[index]]; persist(next, "ক্রম পরিবর্তন হয়েছে"); }
  function remove(faq: Faq) {
    if (!window.confirm(`"${faq.question}" মুছে ফেলবেন?`)) return;
    persist(items.filter(item => item.id !== faq.id), "প্রশ্নটি মুছে ফেলা হয়েছে");
    if (editing === faq.id) cancelEdit();
  }

  return <main className="admin-page">
    <div className="admin-page-heading"><div><p className="admin-breadcrumb"><Link href="/admin">ড্যাশবোর্ড</Link><span>/</span> হোমপেজ <span>/</span> জিজ্ঞাসা</p><h1>জিজ্ঞাসা (FAQ)</h1><p>সব প্রশ্ন “জিজ্ঞাসা” পেজে দেখাবে; ★ দেওয়া সর্বোচ্চ {maxHomepageFaqs}টি হোমপেজেও দেখাবে।</p></div><Link href="/faq" target="_blank" className="admin-secondary"><Icon name="eye"/> FAQ পেজ দেখুন</Link></div>
    <div className="partner-admin-layout">
      <section className="admin-card partner-upload-card"><div className="section-title"><div><h2>{editing ? "প্রশ্ন সম্পাদনা" : "নতুন প্রশ্ন যোগ করুন"}</h2><p>ক্রেতারা যেভাবে জিজ্ঞেস করেন, সেভাবে লিখুন।</p></div><span><Icon name={editing ? "edit" : "plus"}/></span></div>
        <form onSubmit={submit} className="partner-form">
          <label className="partner-input">প্রশ্ন<input value={form.question} onChange={e=>setForm({...form,question:e.target.value})} placeholder="যেমন: ঢাকার বাইরে ডেলিভারি আছে?"/></label>
          <label className="partner-input">উত্তর<textarea rows={5} value={form.answer} onChange={e=>setForm({...form,answer:e.target.value})} placeholder="সংক্ষেপে পরিষ্কার উত্তর লিখুন"/></label>
          <label className="publish-toggle"><input type="checkbox" checked={form.homepage} onChange={e=>setForm({...form,homepage:e.target.checked})}/><span/><div><b>হোমপেজেও দেখান</b><small>হোমপেজে এখন {homepageCount}/{maxHomepageFaqs}টি প্রশ্ন</small></div></label>
          <button className="admin-primary" type="submit"><Icon name="save"/> {editing ? "পরিবর্তন সংরক্ষণ করুন" : "সংরক্ষণ ও প্রকাশ করুন"}</button>
          {editing && <button type="button" className="admin-secondary" onClick={cancelEdit}>বাতিল</button>}
        </form>
      </section>
      <section className="admin-card partner-records"><div className="section-title"><div><h2>সব প্রশ্ন</h2><p>{items.length}টি প্রশ্ন · তালিকার ক্রমেই ওয়েবসাইটে দেখাবে</p></div></div>
        {items.length === 0 && <div className="empty-state"><Icon name="search" size={28}/><b>এখনো কোনো প্রশ্ন নেই</b><p>বাম পাশের ফর্ম থেকে যোগ করুন।</p></div>}
        <div className="faq-admin-list">{items.map((faq, index) => <article key={faq.id} className={`${faq.active ? "" : "is-hidden"} ${editing === faq.id ? "is-editing" : ""}`}>
          <div className="faq-admin-copy"><h3>{faq.question}</h3><p>{faq.answer}</p></div>
          <div className="collection-actions">
            <div className="collection-order"><button type="button" onClick={()=>move(index,-1)} disabled={index===0} aria-label="উপরে সরান">↑</button><button type="button" onClick={()=>move(index,1)} disabled={index===items.length-1} aria-label="নিচে সরান">↓</button></div>
            <button type="button" className={`star-toggle ${faq.homepage ? "is-on" : ""}`} onClick={()=>toggleHomepage(faq)} aria-pressed={faq.homepage} title={faq.homepage ? "হোমপেজে দেখাচ্ছে" : "হোমপেজে দেখান"} aria-label="হোমপেজে দেখান">★</button>
            <label className="publish-switch"><input type="checkbox" checked={faq.active} onChange={()=>toggleActive(faq)}/><span/><b>{faq.active ? "প্রকাশিত" : "লুকানো"}</b></label>
            <button type="button" className="table-action" onClick={()=>edit(faq)} aria-label="সম্পাদনা করুন"><Icon name="edit" size={15}/></button>
            <button type="button" className="collection-delete" onClick={()=>remove(faq)} aria-label="মুছে ফেলুন">×</button>
          </div>
        </article>)}</div>
      </section>
    </div>
    <AdminToast toast={toast} onClose={close}/>
  </main>;
}
