"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { heroSlides, heroSlidesStorageKey, isLocalImage, type HeroSlide } from "@/data/homepage";
import { useStoredList } from "./use-stored-list";

export default function HeroSlider() {
  const slides = useStoredList<HeroSlide>(heroSlidesStorageKey, heroSlides).filter(slide => slide.active);
  const [active, setActive] = useState(0);
  const count = slides.length;

  useEffect(() => {
    if (count < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setActive(current => (current + 1) % count), 5500);
    return () => window.clearInterval(timer);
  }, [count]);

  if (!count) return null;
  const current = active % count;
  return <>
    {slides.map((slide, index) => <Image key={slide.id} src={slide.image} alt={index === current ? slide.alt : ""} aria-hidden={index !== current || undefined} fill priority={index === 0} sizes="100vw" unoptimized={isLocalImage(slide.image)} className={`hero-image hero-farm-image hero-slide ${index === current ? "is-active" : ""}`}/>)}
    {count > 1 && <div className="hero-slider-dots" aria-label="স্লাইড নির্বাচন">{slides.map((slide, index) => <button type="button" key={slide.id} aria-label={`${index + 1} নম্বর ছবি`} aria-current={index === current ? "true" : undefined} onClick={() => setActive(index)}/>)}</div>}
  </>;
}
