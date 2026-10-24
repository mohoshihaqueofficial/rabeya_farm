"use client";

import { useEffect, useState } from "react";
import { blogPosts, blogStorageKey, type BlogPost } from "@/data/blogs";

export const blogsChangeEvent = "rabeya-admin-blogs-change";

export function loadAdminBlogs(): BlogPost[] {
  try {
    const saved = window.localStorage.getItem(blogStorageKey);
    if (saved) return JSON.parse(saved);
  } catch {}
  return blogPosts;
}

// Whole list is stored under one key; throws if the browser storage is full.
export function saveAdminBlogs(posts: BlogPost[]) {
  window.localStorage.setItem(blogStorageKey, JSON.stringify(posts));
  window.dispatchEvent(new Event(blogsChangeEvent));
}

export function useAdminBlogs() {
  const [posts, setPosts] = useState(blogPosts);
  useEffect(() => {
    const refresh = () => setPosts(loadAdminBlogs());
    const timer = window.setTimeout(refresh, 0);
    window.addEventListener(blogsChangeEvent, refresh);
    window.addEventListener("storage", refresh);
    return () => { window.clearTimeout(timer); window.removeEventListener(blogsChangeEvent, refresh); window.removeEventListener("storage", refresh); };
  }, []);
  return posts;
}

export function useToast() {
  const [toast, setToast] = useState<{ text: string; tone: "success" | "error"; key: number } | null>(null);
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);
  const notify = (text: string, tone: "success" | "error" = "success") => setToast(current => ({ text, tone, key: (current?.key ?? 0) + 1 }));
  return { toast, notify, close: () => setToast(null) };
}
