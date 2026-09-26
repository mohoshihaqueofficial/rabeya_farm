import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteHeader from "@/app/components/site-header";
import SiteFooter from "@/app/components/site-footer";
import { activeBlogPosts } from "@/data/blogs";

export const metadata: Metadata = {
  title: "ব্লগ | Rabeya Farm",
  description: "গরু নির্বাচন, খামার পরিচর্যা, কোরবানি প্রস্তুতি ও নিরাপদ ডেলিভারি বিষয়ে রাবেয়া ফার্মের লেখা।",
};

export default function BlogPage() {
  const featured = activeBlogPosts.find(post => post.featured) ?? activeBlogPosts[0];
  const posts = activeBlogPosts.filter(post => post.slug !== featured.slug);

  return <main className="blog-page">
    <SiteHeader active="blog"/>
    <section className="blog-hero"><div className="shell"><p>রাবেয়া ফার্ম জার্নাল</p><h1>খামার, যত্ন ও কোরবানির<br/><span>প্রয়োজনীয় গল্প</span></h1><div>সঠিক তথ্য ও বাস্তব অভিজ্ঞতা দিয়ে আপনার সিদ্ধান্তকে আরও সহজ করতে আমাদের নিয়মিত আয়োজন।</div></div></section>

    <div className="shell blog-content">
      <Link href={`/blog/${featured.slug}`} className="featured-post"><div className="featured-post-image"><Image src={featured.coverImage} alt={featured.title} fill priority sizes="(max-width: 800px) 100vw, 58vw" style={{ objectPosition: featured.imagePosition }}/></div><div className="featured-post-copy"><span>{featured.category}</span><p>{featured.publishedLabel} · {featured.readTime}</p><h2>{featured.title}</h2><div>{featured.excerpt}</div><b>সম্পূর্ণ পড়ুন <i>→</i></b></div></Link>

      <section className="blog-list-section" aria-labelledby="latest-blogs"><div className="blog-section-heading"><div><p>সাম্প্রতিক লেখা</p><h2 id="latest-blogs">সব ব্লগ</h2></div><span>{activeBlogPosts.length}টি লেখা</span></div><div className="blog-grid">{posts.map(post => <article className="blog-card" key={post.slug}><Link href={`/blog/${post.slug}`} className="blog-card-image"><Image src={post.coverImage} alt={post.title} fill sizes="(max-width: 640px) 100vw, (max-width: 950px) 50vw, 33vw" style={{ objectPosition: post.imagePosition }}/><span>{post.category}</span></Link><div className="blog-card-body"><p>{post.publishedLabel} · {post.readTime}</p><h3><Link href={`/blog/${post.slug}`}>{post.title}</Link></h3><div>{post.excerpt}</div><Link href={`/blog/${post.slug}`} className="blog-read-link">বিস্তারিত পড়ুন <span>→</span></Link></div></article>)}</div></section>
    </div>
    <SiteFooter/>
  </main>;
}
