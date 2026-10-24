"use client";

import CollectionManager from "../../components/collection-manager";
import { reviews, reviewsStorageKey, type Review } from "@/data/homepage";

export default function AdminReviewsPage() {
  return <CollectionManager<Review>
    title="ক্রেতা রিভিউ" description="হোমপেজের “আমাদের ক্রেতারা যা বলেন” অংশের ছবি ও মন্তব্য।" formTitle="নতুন রিভিউ যোগ করুন" photoLabel="ক্রেতা বা গরুর ছবি আপলোড"
    storageKey={reviewsStorageKey} initial={reviews} previewHref="/#reviews"
    fields={[
      { key: "name", label: "ক্রেতার নাম", placeholder: "যেমন: মোঃ আরিফ হাসান", required: true },
      { key: "location", label: "এলাকা", placeholder: "যেমন: ঢাকা", required: true },
      { key: "quote", label: "মন্তব্য", placeholder: "ক্রেতা কী বলেছেন?", multiline: true, required: true },
    ]}
    makeItem={(values, image, id) => ({ id, image, name: values.name, location: values.location, quote: values.quote, active: true })}
    itemTitle={review => review.name} itemSubtitle={review => `${review.location} · ${review.quote}`}/>;
}
