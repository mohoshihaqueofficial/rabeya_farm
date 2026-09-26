import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/app/components/site-header";
import SiteFooter from "@/app/components/site-footer";
import { activeBlogPosts, getBlogPost } from "@/data/blogs";

type BlogDetailsProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return activeBlogPosts.map(post => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogDetailsProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: "ব্লগ পাওয়া যায়নি | Rabeya Farm" };
  return { title: `${post.title} | Rabeya Farm`, description: post.excerpt };
}

export default async function BlogDetailsPage({ params }: BlogDetailsProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();
  const related = activeBlogPosts.filter(item => item.slug !== post.slug).slice(0, 3);

  return <main className="blog-details-page">
    <SiteHeader active="blog"/>
    <div className="shell blog-breadcrumb"><Link href="/">হোম</Link><span>/</span><Link href="/blog">ব্লগ</Link><span>/</span><b>{post.category}</b></div>
    <article className="shell blog-article">
      <header className="blog-article-header"><span>{post.category}</span><h1>{post.title}</h1><p>{post.excerpt}</p><div><b>{post.author}</b><i>•</i><time dateTime={post.publishedAt}>{post.publishedLabel}</time><i>•</i><span>{post.readTime}</span></div></header>
      <div className="blog-article-cover"><Image src={post.coverImage} alt={post.title} fill priority sizes="(max-width: 900px) 100vw, 980px" style={{ objectPosition: post.imagePosition }}/></div>
      <div className="blog-article-layout"><div className="blog-article-body">{post.content.map(section => <section key={section.heading}><h2>{section.heading}</h2>{section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</section>)}<div className="blog-article-note"><b>মনে রাখুন</b><p>গরুর স্বাস্থ্য বা পরিচর্যা বিষয়ে কোনো সন্দেহ থাকলে সরাসরি অভিজ্ঞ ভেটেরিনারি চিকিৎসকের পরামর্শ নিন।</p></div><Link href="/blog" className="blog-back-link">← সব ব্লগে ফিরে যান</Link></div><aside className="related-blogs"><h2>আরও পড়ুন</h2>{related.map(item => <Link href={`/blog/${item.slug}`} key={item.slug}><div><Image src={item.coverImage} alt="" fill sizes="92px" style={{ objectPosition: item.imagePosition }}/></div><span><small>{item.category}</small><b>{item.title}</b></span></Link>)}</aside></div>
    </article>
    <SiteFooter/>
  </main>;
}
