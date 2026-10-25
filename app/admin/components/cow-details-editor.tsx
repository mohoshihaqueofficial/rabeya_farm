"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { adminCattle, adminCattleChangeEvent, adminCowStorageKey, adminStatus, adminStatusLabels, colorLabels, cowStatusLabels, newAdminCow, loadAdminCattle, nextSavedCowId, saveAdminCow, type AdminCow } from "@/data/admin-cattle";
import { bnNumber, maxFeaturedCattle, youtubeId, type CowAvailability, type CowColor } from "@/data/cattle";
import { Icon } from "./icons";

type Tab = "details" | "media";
const maxPhotoSize = 2_000_000;

function Field({ label, children, full = false }: { label: string; children: React.ReactNode; full?: boolean }) {
  return <label className={full ? "form-field full" : "form-field"}><span>{label}</span>{children}</label>;
}

// Fields mirror the public cow page (/korbani-goru/[id]) exactly — nothing more, nothing less.
export default function CowDetailsEditor({ id }: { id: string }) {
  const isNew = id === "new";
  const router = useRouter();
  const baseCow = useMemo(() => (isNew ? undefined : adminCattle.find(c => c.id === id)) ?? newAdminCow(), [id, isNew]);
  const [cow, setCow] = useState<AdminCow>(baseCow);
  // Unknown id (not built-in, not saved in this browser) → "not found" instead of a blank editable cow.
  const [missing, setMissing] = useState(false);
  const [tab, setTab] = useState<Tab>("details");
  const [toast, setToast] = useState<{ text: string; tone: "success" | "error"; key: number } | null>(null);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  function notify(text: string, tone: "success" | "error" = "success") { setToast({ text, tone, key: Date.now() }); }

  useEffect(() => {
    if (isNew) {
      // Fresh blank form every time; only the id is generated (next unused RB- number incl. saved cows).
      window.localStorage.removeItem(adminCowStorageKey("new"));
      const timer = window.setTimeout(() => setCow(newAdminCow(nextSavedCowId())), 0);
      return () => window.clearTimeout(timer);
    }
    const draft = window.localStorage.getItem(adminCowStorageKey(id));
    if (!draft) {
      if (adminCattle.some(c => c.id === id)) return;
      const timer = window.setTimeout(() => setMissing(true), 0);
      return () => window.clearTimeout(timer);
    }
    const timer = window.setTimeout(() => {
      try { setCow({ ...baseCow, ...JSON.parse(draft) }); } catch {}
    }, 0);
    return () => window.clearTimeout(timer);
  }, [id, isNew, baseCow]);

  function update<K extends keyof AdminCow>(key: K, value: AdminCow[K]) { setCow(current => ({ ...current, [key]: value })); setDirty(true); }
  function validate(next: AdminCow) {
    if (!next.name.trim() || next.price <= 0 || next.weight <= 0) { setTab("details"); notify("নাম, মূল্য ও ওজন দিন", "error"); return false; }
    if (!next.color || !next.availability) { setTab("details"); notify("রঙ ও বিক্রয় অবস্থা নির্বাচন করুন", "error"); return false; }
    if (!next.image) { setTab("media"); notify("অন্তত একটি ছবি যোগ করুন", "error"); return false; }
    if (next.videoUrl?.trim() && !youtubeId(next.videoUrl)) { setTab("media"); notify("সঠিক YouTube লিংক দিন", "error"); return false; }
    return true;
  }
  // Saves under the cow's real id so the list/dashboard pick it up; a new cow gets its final id here.
  function persist(next: AdminCow, message: string) {
    if (!validate(next)) return;
    const record = isNew && loadAdminCattle().some(c => c.id === next.id) ? { ...next, id: nextSavedCowId() } : next;
    try { saveAdminCow(record); } catch { notify("সংরক্ষণ করা যায়নি · ব্রাউজারের জায়গা পূর্ণ, কিছু ছবি মুছে আবার চেষ্টা করুন", "error"); return; }
    setCow(record); setDirty(false); notify(message);
    if (isNew) router.replace(`/admin/cows/${record.id}`);
  }
  function save() { persist(cow, cow.draft ? "ড্রাফট সংরক্ষিত হয়েছে" : isNew ? "নতুন গরু প্রকাশিত হয়েছে" : "সব পরিবর্তন সংরক্ষিত হয়েছে"); }
  // Homepage shows at most maxFeaturedCattle featured cows; edits apply on save like other fields.
  function setFeatured(featured: boolean) {
    if (featured && loadAdminCattle().filter(c => c.featured && c.id !== cow.id).length >= maxFeaturedCattle) {
      notify(`হোমপেজে সর্বোচ্চ ${bnNumber(maxFeaturedCattle)}টি গরু দেখানো যায় · আগে অন্য একটি বন্ধ করুন`, "error"); return;
    }
    update("featured", featured);
  }
  function setPublished(published: boolean) {
    persist({ ...cow, draft: !published }, published ? "ওয়েবসাইটে প্রকাশিত হয়েছে" : "ড্রাফটে সরানো হয়েছে · ওয়েবসাইটে লুকানো");
  }

  function reset() { setCow(baseCow); window.localStorage.removeItem(adminCowStorageKey(id)); window.dispatchEvent(new Event(adminCattleChangeEvent)); setDirty(false); notify("পরিবর্তন রিসেট করা হয়েছে"); }

  const title = cow.name || "নতুন গরু";
  const videoId = youtubeId(cow.videoUrl);
  const photos = [cow.image, ...cow.gallery].filter(Boolean);

  // First photo is the main one (catalogue card + first gallery slide).
  function setPhotos(next: string[]) { setCow(current => ({ ...current, image: next[0] ?? "", gallery: next.slice(1) })); setDirty(true); }
  function addPhotos(files: FileList | null) {
    const valid = Array.from(files ?? []).filter(file => file.type.startsWith("image/") && file.size <= maxPhotoSize);
    if (files && valid.length < files.length) notify("শুধু JPG, PNG বা WebP · প্রতিটি সর্বোচ্চ ২MB", "error");
    Promise.all(valid.map(file => new Promise<string>(resolve => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.readAsDataURL(file); })))
      .then(urls => urls.length && setCow(current => { const next = [current.image, ...current.gallery].filter(Boolean).concat(urls); setDirty(true); return { ...current, image: next[0], gallery: next.slice(1) }; }));
  }
  function removePhoto(src: string) { setPhotos(photos.filter(photo => photo !== src)); }
  function makeMain(src: string) { setPhotos([src, ...photos.filter(photo => photo !== src)]); }

  if (missing) return <main className="admin-page"><div className="empty-state"><Icon name="search" size={28}/><b>গরুটি পাওয়া যায়নি</b><p><strong>{id}</strong> আইডির কোনো গরু নেই। <Link href="/admin/cows">গরুর তালিকায় ফিরে যান</Link></p></div></main>;

  return <main className="admin-page cow-editor-page">
    <div className="editor-heading"><div><p className="admin-breadcrumb"><Link href="/admin">ড্যাশবোর্ড</Link><span>/</span><Link href="/admin/cows">গরুর তালিকা</Link><span>/</span>{isNew ? "নতুন গরু" : cow.id}</p><div className="editor-title-row"><h1>{title}</h1>{adminStatusLabels[adminStatus(cow)] && <span className={`status-pill ${adminStatus(cow)}`}><i/>{adminStatusLabels[adminStatus(cow)]}</span>}</div><p>এখানের সব তথ্য ওয়েবসাইটের গরুর পেজে দেখানো হয়।</p></div><div className="editor-actions"><span className="save-status" role="status">{dirty ? "● সংরক্ষণ করা হয়নি" : ""}</span>{!isNew && !cow.draft && <Link href={`/korbani-goru/${baseCow.id}`} target="_blank" className="admin-secondary"><Icon name="eye"/> লাইভ পেজ</Link>}</div></div>

    <div className="editor-layout">
      <aside className="cow-profile-card admin-card"><div className="profile-photo">{!cow.image && <span className="profile-photo-empty">ছবি যোগ করুন</span>}{cow.image && <Image src={cow.image} alt={title} fill priority sizes="300px" unoptimized={cow.image.startsWith("data:")} style={{objectPosition:cow.position}}/>}<button aria-label="ছবি পরিবর্তন" onClick={()=>setTab("media")}><Icon name="edit" size={16}/></button></div><h2>{title}</h2><p>{cow.id}</p><div className="profile-quick-stats"><span><small>ওজন</small><b>{bnNumber(cow.weight)} কেজি</b></span><span><small>রঙ</small><b>{colorLabels[cow.color] ?? "—"}</b></span></div><div className="profile-price"><small>বিক্রয় মূল্য</small><strong>৳ {bnNumber(cow.price)}</strong></div><label className="publish-toggle"><input type="checkbox" checked={!cow.draft} onChange={e=>setPublished(e.target.checked)}/><span/><div><b>{cow.draft ? "ড্রাফট" : "ওয়েবসাইটে প্রকাশিত"}</b><small>{cow.draft ? "ক্রেতারা এখনো দেখতে পাবেন না" : "ক্রেতারা catalogue-এ দেখতে পাচ্ছেন"}</small></div></label><label className="publish-toggle featured-toggle"><input type="checkbox" checked={!!cow.featured} onChange={e=>setFeatured(e.target.checked)}/><span/><div><b>হোমপেজে ফিচার্ড</b><small>{cow.featured ? (cow.draft ? "প্রকাশ করলে হোমপেজে দেখাবে" : "হোমপেজের \"আমাদের সংগ্রহ\"-এ দেখাচ্ছে") : `হোমপেজে সর্বোচ্চ ${bnNumber(maxFeaturedCattle)}টি গরু`}</small></div></label>{!isNew && <div className="profile-metrics"><span><Icon name="eye"/><b>{bnNumber(cow.views)}</b><small>পেজ ভিউ</small></span><span><Icon name="heart"/><b>{bnNumber(cow.inquiries)}</b><small>ইনকোয়ারি</small></span></div>}</aside>

      <section className="editor-content admin-card">
        <div className="editor-tabs">{([ ["details","গরুর তথ্য"], ["media","ছবি ও ভিডিও"] ] as [Tab,string][]).map(([value,label])=><button key={value} className={tab===value?"active":""} onClick={()=>setTab(value)}>{label}</button>)}</div>
        {tab === "details" && <div className="editor-panel"><div className="section-title"><div><h2>গরুর তথ্য</h2><p>ক্রেতারা ওয়েবসাইটে ঠিক এই তথ্যগুলো দেখতে পাবেন।</p></div><span><Icon name="edit" size={18}/></span></div><div className="form-grid">
          <Field label="গরুর আইডি"><input value={cow.id} disabled/></Field><Field label="ধরন / নাম"><input value={cow.name} placeholder="যেমন: শাহিওয়াল গরু" onChange={e=>update("name",e.target.value)}/></Field>
          <Field label="বিক্রয় মূল্য"><div className="input-prefix"><span>৳</span><input type="number" min={0} value={cow.price || ""} placeholder="0" onChange={e=>update("price",Number(e.target.value))}/></div></Field><Field label="ওজন"><div className="input-suffix"><input type="number" min={0} value={cow.weight || ""} placeholder="0" onChange={e=>update("weight",Number(e.target.value))}/><span>কেজি</span></div></Field>
          <Field label="রঙ"><select value={cow.color} onChange={e=>update("color", e.target.value as CowColor)}>{!cow.color && <option value="" disabled>নির্বাচন করুন</option>}{Object.entries(colorLabels).map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></Field><Field label="বিক্রয় অবস্থা"><select value={cow.availability} onChange={e=>update("availability", e.target.value as CowAvailability)}>{!cow.availability && <option value="" disabled>নির্বাচন করুন</option>}{Object.entries(cowStatusLabels).map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></Field>
          <Field label="বয়স"><input value={cow.age} onChange={e=>update("age",e.target.value)}/></Field><Field label="লিঙ্গ"><input value={cow.gender} onChange={e=>update("gender",e.target.value)}/></Field>
          <Field label="স্বাস্থ্য পরীক্ষা"><input value={cow.health} onChange={e=>update("health",e.target.value)}/></Field><Field label="টিকাদান"><input value={cow.vaccine} onChange={e=>update("vaccine",e.target.value)}/></Field>
          <Field label="উৎপত্তি"><input value={cow.origin} onChange={e=>update("origin",e.target.value)}/></Field><Field label="খাবার"><input value={cow.feed} onChange={e=>update("feed",e.target.value)}/></Field>
        </div></div>}
        {tab === "media" && <div className="editor-panel"><div className="section-title"><div><h2>ছবি ও ভিডিও</h2><p>প্রধান ছবি catalogue ও গরুর পেজে প্রথমে দেখানো হবে। ভিডিও গ্যালারির শেষে থাকবে।</p></div></div><div className="media-grid">{photos.map((src,index)=><div key={src} className={`media-item ${index===0?"selected":""}`}><button type="button" className="media-select" onClick={()=>makeMain(src)} aria-label={`ছবি ${index+1} প্রধান ছবি করুন`}><span><Image src={src} alt={`গরুর ছবি ${index+1}`} fill sizes="250px" unoptimized={src.startsWith("data:")}/></span>{index===0 ? <b><Icon name="check" size={13}/> প্রধান ছবি</b> : <em>প্রধান করুন</em>}</button><button type="button" className="media-remove" onClick={()=>removePhoto(src)} aria-label={`ছবি ${index+1} মুছে ফেলুন`}>×</button></div>)}<label className="media-upload"><input type="file" accept="image/png,image/jpeg,image/webp" multiple hidden onChange={e=>{addPhotos(e.target.files); e.target.value="";}}/><Icon name="image" size={27}/><b>নতুন ছবি যোগ করুন</b><small>PNG, JPG, WebP · সর্বোচ্চ ২MB</small></label></div>
          <div className="video-field"><Field label="YouTube ভিডিও লিংক (ঐচ্ছিক)" full><input type="url" inputMode="url" value={cow.videoUrl ?? ""} placeholder="https://www.youtube.com/watch?v=… বা https://youtu.be/…" onChange={e=>update("videoUrl",e.target.value)}/><small className={cow.videoUrl && !videoId ? "video-error" : undefined}>{cow.videoUrl ? (videoId ? "✓ ভিডিওটি গরুর পেজের গ্যালারিতে দেখানো হবে" : "সঠিক YouTube লিংক দিন") : "লিংক দিলে ক্রেতারা গরুর পেজে ভিডিও দেখতে পারবেন"}</small></Field>{videoId && <div className="video-preview"><iframe src={`https://www.youtube-nocookie.com/embed/${videoId}`} title="ভিডিও preview" allow="encrypted-media; picture-in-picture" allowFullScreen/></div>}</div>
        </div>}
        <div className="editor-footer"><button className="danger-link" onClick={reset}>পরিবর্তন রিসেট করুন</button><div><button className="admin-secondary" onClick={()=>{setCow(baseCow);setDirty(false);}}>বাতিল</button><button className="admin-primary" onClick={save}><Icon name="save"/> {cow.draft ? "ড্রাফট সংরক্ষণ" : isNew ? "গরু প্রকাশ করুন" : "সংরক্ষণ করুন"}</button></div></div>
      </section>
    </div>
    {toast && <div key={toast.key} className={`admin-toast ${toast.tone}`} role={toast.tone === "error" ? "alert" : "status"}><span>{toast.tone === "success" ? <Icon name="check" size={15}/> : "!"}</span><p>{toast.text}</p><button type="button" onClick={()=>setToast(null)} aria-label="বন্ধ করুন">×</button></div>}
  </main>;
}
