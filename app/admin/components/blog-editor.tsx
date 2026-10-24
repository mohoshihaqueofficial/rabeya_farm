"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { blogCategories, blogDateLabel, blogPosts, blogReadTime, type BlogPost } from "@/data/blogs";
import { Icon } from "./icons";
import AdminToast from "./admin-toast";
import { loadAdminBlogs, saveAdminBlogs, useToast } from "./use-admin-blogs";

// Sections are edited as heading + one textarea; a blank line separates paragraphs.
type SectionDraft = { heading: string; body: string };
const maxCoverSize = 1_500_000;
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function Field({ label, hint, children, full = false }: { label: string; hint?: string; children: React.ReactNode; full?: boolean }) {
  return <label className={full ? "form-field full" : "form-field"}><span>{label}</span>{children}{hint && <small className="field-hint">{hint}</small>}</label>;
}

function today() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

const blankPost = (): BlogPost => ({ slug: "", title: "", excerpt: "", category: "", author: "", publishedAt: "", publishedLabel: "", readTime: "", coverImage: "", imagePosition: "center", featured: false, active: false, content: [] });
const toDrafts = (post: BlogPost): SectionDraft[] => post.content.length ? post.content.map(section => ({ heading: section.heading, body: section.paragraphs.join("\n\n") })) : [{ heading: "", body: "" }];

export default function BlogEditor({ slug }: { slug: string }) {
  const isNew = slug === "new";
  const router = useRouter();
  const base = useMemo(() => (isNew ? undefined : blogPosts.find(post => post.slug === slug)) ?? blankPost(), [isNew, slug]);
  const [post, setPost] = useState<BlogPost>(base);
  const [sections, setSections] = useState<SectionDraft[]>(() => toDrafts(base));
  const [dirty, setDirty] = useState(false);
  const [missing, setMissing] = useState(false);
  const { toast, notify, close } = useToast();
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (isNew) { setPost(current => ({ ...current, publishedAt: today() })); return; }
      const saved = loadAdminBlogs().find(item => item.slug === slug);
      if (saved) { setPost(saved); setSections(toDrafts(saved)); } else if (!blogPosts.some(item => item.slug === slug)) setMissing(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [isNew, slug]);

  const content = sections.map(section => ({ heading: section.heading.trim(), paragraphs: section.body.split(/\n\s*\n/).map(text => text.trim()).filter(Boolean) })).filter(section => section.heading || section.paragraphs.length);
  const readTime = blogReadTime(content);

  function update<K extends keyof BlogPost>(key: K, value: BlogPost[K]) { setPost(current => ({ ...current, [key]: value })); setDirty(true); }
  function updateSection(index: number, patch: Partial<SectionDraft>) { setSections(current => current.map((section, i) => i === index ? { ...section, ...patch } : section)); setDirty(true); }
  function moveSection(index: number, by: -1 | 1) { setSections(current => { const next = [...current]; [next[index], next[index + by]] = [next[index + by], next[index]]; return next; }); setDirty(true); }
  function removeSection(index: number) { setSections(current => current.length > 1 ? current.filter((_, i) => i !== index) : [{ heading: "", body: "" }]); setDirty(true); }

  function chooseCover(file?: File) {
    if (!file) return;
    if (!file.type.startsWith("image/")) { notify("শুধু JPG, PNG বা WebP ছবি নির্বাচন করুন", "error"); return; }
    if (file.size > maxCoverSize) { notify("ছবিটি ১.৫MB-এর মধ্যে রাখুন", "error"); return; }
    const reader = new FileReader();
    reader.onload = () => update("coverImage", String(reader.result));
    reader.readAsDataURL(file);
  }

  function save(overrides: Partial<BlogPost> = {}, message?: string) {
    const next: BlogPost = { ...post, ...overrides, title: post.title.trim(), slug: post.slug.trim(), excerpt: post.excerpt.trim(), category: post.category.trim(), author: post.author.trim(), content, readTime, publishedLabel: blogDateLabel(post.publishedAt) };
    const all = loadAdminBlogs();
    const required: [string, string][] = [[next.title, "শিরোনাম"], [next.slug, "URL (slug)"], [next.excerpt, "সংক্ষিপ্ত বিবরণ"], [next.category, "ক্যাটাগরি"], [next.author, "লেখক"], [next.publishedAt, "প্রকাশের তারিখ"], [next.coverImage, "কভার ছবি"]];
    const empty = required.find(([value]) => !value);
    if (empty) { notify(`${empty[1]} দিন`, "error"); return; }
    if (!slugPattern.test(next.slug)) { notify("URL-এ শুধু ছোট হাতের ইংরেজি অক্ষর, সংখ্যা ও - ব্যবহার করুন", "error"); return; }
    if (all.some(item => item.slug === next.slug && item.slug !== slug)) { notify("এই URL আগে থেকেই আছে · অন্য একটি দিন", "error"); return; }
    if (!content.length) { notify("অন্তত একটি অংশ লিখুন", "error"); return; }
    // One featured post at a time (the big card on /blog).
    const others = all.filter(item => item.slug !== slug).map(item => next.featured ? { ...item, featured: false } : item);
    const list = isNew ? [...others, next] : all.some(item => item.slug === slug) ? all.map(item => item.slug === slug ? next : next.featured ? { ...item, featured: false } : item) : [...others, next];
    try { saveAdminBlogs(list); } catch { notify("সংরক্ষণ করা যায়নি · ব্রাউজারের জায়গা পূর্ণ, ছোট ছবি ব্যবহার করুন", "error"); return; }
    setPost(next); setDirty(false);
    notify(message ?? (next.active ? (isNew ? "নতুন ব্লগ প্রকাশিত হয়েছে" : "সব পরিবর্তন সংরক্ষিত হয়েছে") : "ড্রাফট সংরক্ষিত হয়েছে"));
    if (next.slug !== slug) router.replace(`/admin/blogs/${next.slug}`);
  }

  if (missing) return <main className="admin-page"><div className="empty-state"><Icon name="search" size={28}/><b>ব্লগটি পাওয়া যায়নি</b><p><Link href="/admin/blogs">ব্লগ তালিকায় ফিরে যান</Link></p></div></main>;

  const title = post.title || "নতুন ব্লগ";
  return <main className="admin-page cow-editor-page">
    <div className="editor-heading"><div><p className="admin-breadcrumb"><Link href="/admin">ড্যাশবোর্ড</Link><span>/</span><Link href="/admin/blogs">ব্লগ</Link><span>/</span>{isNew ? "নতুন ব্লগ" : "সম্পাদনা"}</p><div className="editor-title-row"><h1>{title}</h1><span className={`status-pill ${post.active ? "available" : "draft"}`}><i/>{post.active ? "প্রকাশিত" : "ড্রাফট"}</span></div><p>এখানের সব তথ্য ওয়েবসাইটের ব্লগ পেজে দেখানো হয়।</p></div><div className="editor-actions"><span className="save-status" role="status">{dirty ? "● সংরক্ষণ করা হয়নি" : ""}</span>{!isNew && post.active && <Link href={`/blog/${slug}`} target="_blank" className="admin-secondary"><Icon name="eye"/> লাইভ পেজ</Link>}</div></div>

    <div className="editor-layout">
      <aside className="cow-profile-card admin-card">
        <label className="profile-photo blog-cover-upload">{post.coverImage ? <Image src={post.coverImage} alt={title} fill sizes="300px" unoptimized={post.coverImage.startsWith("data:")} style={{objectPosition:post.imagePosition}}/> : <span className="profile-photo-empty">কভার ছবি যোগ করুন</span>}<input ref={fileInput} type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={e=>{chooseCover(e.target.files?.[0]); e.target.value="";}}/><span className="cover-change"><Icon name="upload" size={15}/> {post.coverImage ? "ছবি বদলান" : "আপলোড"}</span></label>
        <h2>{title}</h2><p>{post.category || "ক্যাটাগরি নেই"}</p>
        <div className="profile-quick-stats"><span><small>প্রকাশ</small><b>{blogDateLabel(post.publishedAt) || "—"}</b></span><span><small>পড়ার সময়</small><b>{content.length ? readTime.replace(" পড়ুন", "") : "—"}</b></span></div>
        <label className="publish-toggle"><input type="checkbox" checked={post.active} onChange={e=>save({ active: e.target.checked }, e.target.checked ? "ব্লগটি ওয়েবসাইটে প্রকাশিত হয়েছে" : "ড্রাফটে সরানো হয়েছে · ওয়েবসাইটে লুকানো")}/><span/><div><b>{post.active ? "ওয়েবসাইটে প্রকাশিত" : "ড্রাফট"}</b><small>{post.active ? "পাঠকেরা ব্লগে দেখতে পাচ্ছেন" : "পাঠকেরা এখনো দেখতে পাবেন না"}</small></div></label>
        <label className="publish-toggle featured-toggle"><input type="checkbox" checked={!!post.featured} onChange={e=>update("featured", e.target.checked)}/><span/><div><b>ফিচার্ড লেখা</b><small>ব্লগ পেজের সবার উপরে বড় করে দেখাবে (একটিই)</small></div></label>
      </aside>

      <section className="editor-content admin-card">
        <div className="editor-panel">
          <div className="section-title"><div><h2>ব্লগের তথ্য</h2><p>ব্লগ তালিকা ও কার্ডে এই তথ্যগুলো দেখা যাবে।</p></div><span><Icon name="edit" size={18}/></span></div>
          <div className="form-grid">
            <Field label="শিরোনাম" full><input value={post.title} onChange={e=>update("title",e.target.value)} placeholder="যেমন: সুস্থ কোরবানির গরু চেনার সহজ উপায়"/></Field>
            <Field label="URL (slug)" hint={post.slug ? `ঠিকানা: /blog/${post.slug}` : "ইংরেজি ছোট হাতের অক্ষর ও - দিয়ে, যেমন: healthy-cow-guide"}><input value={post.slug} onChange={e=>update("slug",e.target.value.toLowerCase().replace(/\s+/g,"-"))} placeholder="healthy-cow-guide"/></Field>
            <Field label="ক্যাটাগরি"><input list="blog-categories" value={post.category} onChange={e=>update("category",e.target.value)} placeholder="নির্বাচন করুন বা নতুন লিখুন"/><datalist id="blog-categories">{blogCategories.map(category => <option key={category} value={category}/>)}</datalist></Field>
            <Field label="লেখক"><input value={post.author} onChange={e=>update("author",e.target.value)} placeholder="যেমন: রাবেয়া ফার্ম টিম"/></Field>
            <Field label="প্রকাশের তারিখ"><input type="date" value={post.publishedAt} onChange={e=>update("publishedAt",e.target.value)}/></Field>
            <Field label="সংক্ষিপ্ত বিবরণ" hint="ব্লগ কার্ড ও শিরোনামের নিচে দেখাবে" full><textarea rows={3} value={post.excerpt} onChange={e=>update("excerpt",e.target.value)} placeholder="১–২ লাইনে লেখাটির মূল কথা"/></Field>
          </div>

          <div className="section-title blog-sections-title"><div><h2>লেখার অংশ</h2><p>প্রতিটি অংশে একটি উপশিরোনাম ও লেখা। নতুন অনুচ্ছেদের জন্য একটি ফাঁকা লাইন দিন।</p></div><span className="read-time-badge">{readTime}</span></div>
          <div className="blog-section-list">{sections.map((section, index) => <div className="blog-section-card" key={index}>
            <div className="blog-section-head"><b>অংশ {new Intl.NumberFormat("bn-BD").format(index + 1)}</b><div className="collection-order horizontal"><button type="button" onClick={()=>moveSection(index,-1)} disabled={index===0} aria-label="উপরে সরান">↑</button><button type="button" onClick={()=>moveSection(index,1)} disabled={index===sections.length-1} aria-label="নিচে সরান">↓</button></div><button type="button" className="collection-delete" onClick={()=>removeSection(index)} aria-label={`অংশ ${index+1} মুছুন`}>×</button></div>
            <input className="blog-section-heading" value={section.heading} onChange={e=>updateSection(index,{heading:e.target.value})} placeholder="উপশিরোনাম"/>
            <textarea rows={5} value={section.body} onChange={e=>updateSection(index,{body:e.target.value})} placeholder="এই অংশের লেখা…"/>
          </div>)}</div>
          <button type="button" className="admin-secondary add-section" onClick={()=>{setSections(current=>[...current,{heading:"",body:""}]); setDirty(true);}}><Icon name="plus"/> নতুন অংশ যোগ করুন</button>
        </div>
        <div className="editor-footer"><Link href="/admin/blogs" className="danger-link">← ব্লগ তালিকা</Link><div><button className="admin-secondary" onClick={()=>{ if (fileInput.current) fileInput.current.value=""; router.push("/admin/blogs"); }}>বাতিল</button><button className="admin-primary" onClick={()=>save()}><Icon name="save"/> {post.active ? (isNew ? "ব্লগ প্রকাশ করুন" : "সংরক্ষণ করুন") : "ড্রাফট সংরক্ষণ"}</button></div></div>
      </section>
    </div>
    <AdminToast toast={toast} onClose={close}/>
  </main>;
}
