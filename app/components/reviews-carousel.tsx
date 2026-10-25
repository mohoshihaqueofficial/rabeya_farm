"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { isLocalImage, reviews as defaultReviews, reviewsStorageKey, type Review } from "@/data/homepage";
import { useStoredList } from "./use-stored-list";

// Avatar letter: first letter of the name after an honorific like "মোঃ".
const initial = (name: string) => Array.from(name.replace(/^(মোঃ|মো\.|মোছাঃ)\s*/, "").trim())[0] ?? "";

export default function ReviewsCarousel() {
  const reviews = useStoredList<Review>(reviewsStorageKey, defaultReviews).filter(review => review.active && typeof review.image === "string" && review.image !== "" && typeof review.name === "string");
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || reviews.length < 2) return;
    const timer = window.setInterval(() => setActive(current => (current + 1) % reviews.length), 4500);
    return () => window.clearInterval(timer);
  }, [paused, reviews.length]);

  if (!reviews.length) return null;
  const current = active % reviews.length;
  const previous = (current - 1 + reviews.length) % reviews.length;
  const next = (current + 1) % reviews.length;
  const visible = [
    { review: reviews[previous], position: "left" },
    { review: reviews[current], position: "center" },
    { review: reviews[next], position: "right" },
  ];

  return <div className="review-showcase" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
    <div className="review-showcase-stage" key={active}>{visible.map(({ review, position }) => <figure className={`review-showcase-card is-${position}`} key={`${active}-${position}`}>
      <div className="review-showcase-photo"><Image src={review.image} alt="" fill sizes="(max-width: 700px) 78vw, 430px" unoptimized={isLocalImage(review.image)}/></div>
      <div className="review-showcase-body"><div className="stars">★★★★★</div><blockquote>“{review.quote}”</blockquote><figcaption><span>{initial(review.name)}</span><div><b>{review.name}</b><small>{review.location} · যাচাইকৃত ক্রেতা</small></div></figcaption></div>
    </figure>)}</div>
    <div className="review-dots" aria-label="রিভিউ নির্বাচন">{reviews.map((review, index) => <button type="button" key={review.id} aria-label={`${index + 1} নম্বর রিভিউ`} aria-current={current === index ? "true" : undefined} onClick={() => setActive(index)}/>)}</div>
  </div>;
}
