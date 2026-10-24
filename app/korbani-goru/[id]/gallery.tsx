"use client";

import { useState } from "react";
import Image from "next/image";
import { youtubeId, type Cow } from "@/data/cattle";

export default function CowGallery({ cow }: { cow: Cow }) {
  const photos = [cow.image, ...cow.gallery].map((src, index) => ({ src, alt: index ? `${cow.name} — ছবি ${index + 1}` : cow.name, position: index ? "center" : cow.position }));
  const videoId = youtubeId(cow.videoUrl);
  const slides = videoId ? [...photos, { src: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`, alt: "গরুর ভিডিও", position: "center", video: true }] : photos;
  const [active, setActive] = useState(0);
  const [favorite, setFavorite] = useState(false);
  const current = slides[active];
  return <div className="details-gallery">
    <div className="details-main-photo">{"video" in current ? <iframe className="details-video" src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0`} title={`${cow.name} — ভিডিও`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen/> : <Image src={current.src} alt={current.alt} fill preload unoptimized={current.src.startsWith("data:")} sizes="(max-width: 700px) 95vw, 45vw" style={{ objectPosition: current.position }}/>}<span className="gallery-count">{active + 1} / {slides.length}</span>{!("video" in current) && <button type="button" className="favorite-button" aria-label="পছন্দের গরু" aria-pressed={favorite} onClick={() => setFavorite(!favorite)}>{favorite ? "♥" : "♡"}</button>}</div>
    <div className="details-thumbnails">{slides.map((slide, index) => <button type="button" key={index} className={"video" in slide ? "video-thumb" : undefined} aria-label={`${slide.alt} দেখুন`} aria-pressed={active === index} onClick={() => setActive(index)}><Image src={slide.src} alt={slide.alt} fill sizes="130px" unoptimized={"video" in slide || slide.src.startsWith("data:")} style={{ objectPosition: slide.position }}/>{"video" in slide && <span className="video-play" aria-hidden="true">▶</span>}</button>)}</div>
    <p className="details-media-note">নমুনা ছবি ও খামারের পরিবেশ · নির্দিষ্ট গরুর হালনাগাদ ছবি জানতে যোগাযোগ করুন।</p>
  </div>;
}

export function ShareCow({ title }: { title: string }) {
  const [status, setStatus] = useState("");
  async function share() {
    try {
      if (navigator.share) await navigator.share({ title, url: window.location.href });
      else { await navigator.clipboard.writeText(window.location.href); setStatus("লিংক কপি হয়েছে"); }
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) setStatus("Browser address bar থেকে লিংক কপি করুন।");
    }
  }
  return <div><button type="button" className="details-outline-button" onClick={share}>↗ শেয়ার করুন</button><span className="share-status" role="status">{status}</span></div>;
}
