"use client";

import CollectionManager from "../../components/collection-manager";
import { heroSlides, heroSlidesStorageKey, type HeroSlide } from "@/data/homepage";

export default function AdminHeroSliderPage() {
  return <CollectionManager<HeroSlide>
    title="স্লাইডার ছবি" description="হোমপেজের সবার উপরের বড় ছবিগুলো—কয়েক সেকেন্ড পরপর বদলায়।" formTitle="নতুন স্লাইড যোগ করুন" photoLabel="স্লাইডের ছবি আপলোড (চওড়া ছবি ভালো)"
    storageKey={heroSlidesStorageKey} initial={heroSlides} previewHref="/"
    fields={[{ key: "alt", label: "ছবির সংক্ষিপ্ত বিবরণ", placeholder: "যেমন: খামারের শেডে গরু" }]}
    makeItem={(values, image, id) => ({ id, image, alt: values.alt || "রাবেয়া ফার্মের ছবি", active: true })}
    itemTitle={slide => slide.alt}/>;
}
