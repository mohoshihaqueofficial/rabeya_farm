"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const reviews = [
  { quote: "“অনলাইনে দেখে যেমন মনে হয়েছিল, সামনে গিয়ে তার চেয়েও সুন্দর ও সুস্থ গরু পেয়েছি।”", name: "মোঃ আরিফ হাসান", location: "ঢাকা", image: "/Home/Homepage/2.jpg", position: "center 68%" },
  { quote: "“খামারের পরিবেশ, খাবার আর যত্ন—সবকিছুই স্বচ্ছ। পুরো প্রক্রিয়াটি ছিল নিশ্চিন্ত।”", name: "মোঃ সাইফুল ইসলাম", location: "ময়মনসিংহ", image: "/Home/rabeya-cattle.png", position: "center" },
  { quote: "“সময়মতো ডেলিভারি এবং দারুণ ব্যবহার। আগামী বছরও Rabeya Farm-ই প্রথম পছন্দ।”", name: "মোঃ রাকিবুল হাসান", location: "গাজীপুর", image: "/Home/Homepage/1.jpg", position: "center" },
];

export default function ReviewsCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => setActive(current => (current + 1) % reviews.length), 4500);
    return () => window.clearInterval(timer);
  }, [paused]);

  const previous = (active - 1 + reviews.length) % reviews.length;
  const next = (active + 1) % reviews.length;
  const visible = [
    { review: reviews[previous], position: "left" },
    { review: reviews[active], position: "center" },
    { review: reviews[next], position: "right" },
  ];

  return <div className="review-showcase" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
    <div className="review-showcase-stage" key={active}>{visible.map(({ review, position }) => <figure className={`review-showcase-card is-${position}`} key={`${active}-${position}`}>
      <div className="review-showcase-photo"><Image src={review.image} alt="" fill sizes="(max-width: 700px) 78vw, 430px" style={{ objectPosition: review.position }}/></div>
      <div className="review-showcase-body"><div className="stars">★★★★★</div><blockquote>{review.quote}</blockquote><figcaption><span>{review.name.slice(4, 5)}</span><div><b>{review.name}</b><small>{review.location} · যাচাইকৃত ক্রেতা</small></div></figcaption></div>
    </figure>)}</div>
    <div className="review-dots" aria-label="রিভিউ নির্বাচন">{reviews.map((review, index) => <button type="button" key={review.name} aria-label={`${index + 1} নম্বর রিভিউ`} aria-current={active === index ? "true" : undefined} onClick={() => setActive(index)}/>)}</div>
  </div>;
}
