import type { Metadata } from "next";
import BlogEditor from "../../components/blog-editor";

export const metadata: Metadata = { title: "ব্লগ সম্পাদনা" };

export default async function AdminBlogEditorPage({ params }: PageProps<"/admin/blogs/[slug]">) {
  const { slug } = await params;
  return <BlogEditor slug={slug}/>;
}
