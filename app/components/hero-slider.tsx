"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { heroSlides, heroSlidesStorageKey, isLocalImage, type HeroSlide } from "@/data/homepage";
import { useStoredList } from "./use-stored-list";

export default function HeroSlider() {
  const slides = useStoredList<HeroSlide>(heroSlidesStorageKey, heroSlides).filter(slide => slide.active && typeof slide.image === "string" && slide.image !== "");
  // `previous` stays mounted so it can fade out under the new slide.
  const [state, setState] = useState<{ active: number; previous: number | null }>({ active: 0, previous: null });
  const count = slides.length;

  useEffect(() => {
    if (count < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setState(current => ({ active: (current.active + 1) % count, previous: current.active })), 5500);
    return () => window.clearInterval(timer);
  }, [count]);

  if (!count) return null;
  const current = state.active % count;
  const next = (current + 1) % count;
  // Only the visible slide, the one fading out and the upcoming one are in the DOM,
  // so the first visit downloads 2 hero images instead of all of them.
  const mounted = new Set([current, next, ...(state.previous === null ? [] : [state.previous % count])]);

  return <>
    {slides.map((slide, index) => mounted.has(index) && <Image key={slide.id} src={slide.image} alt={index === current ? slide.alt : ""} aria-hidden={index !== current || undefined} fill preload={index === 0} sizes="100vw" unoptimized={isLocalImage(slide.image)} className={`hero-image hero-farm-image hero-slide ${index === current ? "is-active" : ""}`}/>)}
    {count > 1 && <div className="hero-slider-dots" aria-label="স্লাইড নির্বাচন">{slides.map((slide, index) => <button type="button" key={slide.id} aria-label={`${index + 1} নম্বর ছবি`} aria-current={index === current ? "true" : undefined} onClick={() => setState({ active: index, previous: current === index ? null : current })}/>)}</div>}
  </>;
}
