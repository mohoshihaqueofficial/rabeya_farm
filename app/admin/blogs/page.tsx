"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { BlogPost } from "@/data/blogs";
import { Icon } from "../components/icons";
import AdminToast from "../components/admin-toast";
import { saveAdminBlogs, useAdminBlogs, useToast } from "../components/use-admin-blogs";

type Filter = "all" | "active" | "hidden";

export default function AdminBlogsPage() {
  const posts = useAdminBlogs();
  const { toast, notify, close } = useToast();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const rows = useMemo(() => posts
    .filter(post => filter === "all" || (filter === "active" ? post.active : !post.active))
    .filter(post => `${post.title} ${post.category}`.toLocaleLowerCase().includes(query.toLocaleLowerCase().trim()))
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)), [posts, query, filter]);

  function save(next: BlogPost[], message: string) {
    try { saveAdminBlogs(next); notify(message); } catch { notify("সংরক্ষণ করা যায়নি · ব্রাউজারের জায়গা পূর্ণ", "error"); }
  }
  function setActive(post: BlogPost, active: boolean) {
    save(posts.map(item => item.slug === post.slug ? { ...item, active } : item), active ? "ব্লগটি ওয়েবসাইটে প্রকাশিত হয়েছে" : "ব্লগটি ওয়েবসাইটে লুকানো হয়েছে");
  }
  // Only one featured post: it is the big card on top of /blog.
  function setFeatured(post: BlogPost) {
    save(posts.map(item => ({ ...item, featured: item.slug === post.slug })), "এটি এখন ব্লগ পেজের প্রধান (ফিচার্ড) লেখা");
  }
  function remove(post: BlogPost) {
    if (!window.confirm(`"${post.title}" মুছে ফেলবেন?`)) return;
    save(posts.filter(item => item.slug !== post.slug), "ব্লগটি মুছে ফেলা হয়েছে");
  }

  const filters: [Filter, string][] = [["all", "সব"], ["active", "প্রকাশিত"], ["hidden", "লুকানো"]];
  return <main className="admin-page">
    <div className="admin-page-heading"><div><p className="admin-breadcrumb"><Link href="/admin">ড্যাশবোর্ড</Link><span>/</span> ব্লগ</p><h1>ব্লগ</h1><p>ওয়েবসাইটের ব্লগ লেখা তৈরি, সম্পাদনা ও প্রকাশ করুন।</p></div><Link href="/admin/blogs/new" className="admin-primary"><Icon name="plus"/> নতুন ব্লগ লিখুন</Link></div>
    <section className="admin-card cattle-manager">
      <div className="manager-toolbar"><label><Icon name="search"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="শিরোনাম বা ক্যাটাগরি দিয়ে খুঁজুন"/></label><div className="filter-tabs">{filters.map(([value,label]) => <button key={value} className={filter === value ? "active" : ""} onClick={()=>setFilter(value)}>{label}{value === "all" && <span>{posts.length}</span>}</button>)}</div></div>
      <div className="admin-table-wrap"><table><thead><tr><th>ব্লগ</th><th>ক্যাটাগরি</th><th>প্রকাশের তারিখ</th><th>ফিচার্ড</th><th>ওয়েবসাইটে</th><th/></tr></thead><tbody>{rows.map(post => <tr key={post.slug}>
        <td><Link href={`/admin/blogs/${post.slug}`} className="cow-table-id blog-table-title"><span><Image src={post.coverImage} alt="" fill sizes="64px" unoptimized={post.coverImage.startsWith("data:")} style={{objectPosition:post.imagePosition}}/></span><div><b>{post.title}</b><small>{post.readTime} · {post.author}</small></div></Link></td>
        <td>{post.category}</td>
        <td>{post.publishedLabel}</td>
        <td><button type="button" className={`star-toggle ${post.featured ? "is-on" : ""}`} onClick={()=>setFeatured(post)} aria-pressed={!!post.featured} aria-label={`${post.title} ফিচার্ড করুন`} title={post.featured ? "ব্লগ পেজের প্রধান লেখা" : "প্রধান লেখা করুন"}>★</button></td>
        <td><label className="row-toggle"><input type="checkbox" checked={post.active} onChange={e=>setActive(post, e.target.checked)} aria-label={`${post.title} ওয়েবসাইটে ${post.active ? "লুকান" : "দেখান"}`}/><span/><b>{post.active ? "Active" : "Inactive"}</b></label></td>
        <td><div className="row-actions">{post.active && <Link className="table-action" href={`/blog/${post.slug}`} target="_blank" aria-label="ওয়েবসাইটে দেখুন"><Icon name="eye" size={16}/></Link>}<Link className="table-action" href={`/admin/blogs/${post.slug}`} aria-label={`${post.title} সম্পাদনা করুন`}><Icon name="edit" size={16}/></Link><button type="button" className="table-action danger" onClick={()=>remove(post)} aria-label={`${post.title} মুছে ফেলুন`}>×</button></div></td>
      </tr>)}</tbody></table>{rows.length === 0 && <div className="empty-state"><Icon name="search" size={28}/><b>কোনো ব্লগ পাওয়া যায়নি</b><p>অন্য শব্দ বা filter দিয়ে চেষ্টা করুন।</p></div>}</div>
    </section>
    <AdminToast toast={toast} onClose={close}/>
  </main>;
}
