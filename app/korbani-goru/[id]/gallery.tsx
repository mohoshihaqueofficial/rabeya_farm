"use client";

import { useState } from "react";
import Image from "next/image";
import type { Cow } from "@/data/cattle";

export default function CowGallery({ cow }: { cow: Cow }) {
  const photos = [{ src: cow.image, alt: cow.name, position: cow.position }, { src: "/Home/Homepage/2.jpg", alt: "খামারের শেড", position: "center 75%" }, { src: "/Home/Homepage/1.jpg", alt: "খামারের প্রবেশপথ", position: "center" }];
  const [active, setActive] = useState(0);
  const [favorite, setFavorite] = useState(false);
  return <div className="details-gallery">
    <div className="details-main-photo"><Image src={photos[active].src} alt={photos[active].alt} fill preload sizes="(max-width: 700px) 95vw, 45vw" style={{ objectPosition: photos[active].position }}/><span className="gallery-count">{active + 1} / {photos.length}</span><button type="button" className="favorite-button" aria-label="পছন্দের গরু" aria-pressed={favorite} onClick={() => setFavorite(!favorite)}>{favorite ? "♥" : "♡"}</button></div>
    <div className="details-thumbnails">{photos.map((photo, index) => <button type="button" key={index} aria-label={`${photo.alt} দেখুন`} aria-pressed={active === index} onClick={() => setActive(index)}><Image src={photo.src} alt={photo.alt} fill sizes="130px" style={{ objectPosition: photo.position }}/></button>)}</div>
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
