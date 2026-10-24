"use client";

import { useEffect, useState } from "react";

export default function ShareButtons({ title }: { title: string }) {
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setUrl(window.location.href), 0);
    return () => window.clearTimeout(timer);
  }, []);

  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  const links = [
    { name: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${u}`, color: "#1877f2" },
    { name: "WhatsApp", href: `https://wa.me/?text=${t}%20${u}`, color: "#25d366" },
    { name: "Messenger", href: `fb-messenger://share/?link=${u}`, color: "#0084ff" },
    { name: "X", href: `https://twitter.com/intent/tweet?url=${u}&text=${t}`, color: "#111" },
    { name: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`, color: "#0a66c2" },
  ];

  async function copy() {
    try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
  }

  async function nativeShare() {
    if (navigator.share) { try { await navigator.share({ title, url }); } catch {} } else copy();
  }

  return <div className="blog-share">
    <b>শেয়ার করুন</b>
    <div>
      {links.map(link => <a key={link.name} href={link.href} target="_blank" rel="noopener noreferrer" style={{ background: link.color }} aria-label={`${link.name}-এ শেয়ার করুন`}>{link.name}</a>)}
      <button type="button" onClick={copy}>{copied ? "কপি হয়েছে ✓" : "লিংক কপি"}</button>
      <button type="button" className="blog-share-native" onClick={nativeShare}>আরও…</button>
    </div>
  </div>;
}
