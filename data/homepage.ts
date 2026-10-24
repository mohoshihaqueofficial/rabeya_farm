// Homepage sections managed from the admin panel (হোমপেজ group).
// Until a backend exists, admin edits are stored in this browser's localStorage under these keys.

export type HeroSlide = { id: string; image: string; alt: string; active: boolean };
export type Review = { id: string; quote: string; name: string; location: string; image: string; active: boolean };

export const heroSlidesStorageKey = "rabeya-farm:hero-slides";
export const reviewsStorageKey = "rabeya-farm:reviews";
export const advisorsStorageKey = "rabeya-farm:advisors";

export const heroSlides: HeroSlide[] = [
  { id: "farm-shed", image: "/Home/Homepage/2.jpg", alt: "রাবেয়া ফার্মের পরিচ্ছন্ন শেডে বিশ্রামরত গরু", active: true },
  { id: "farm-cattle", image: "/Home/rabeya-cattle-optimized.jpg", alt: "রাবেয়া ফার্মের গরু", active: true },
  { id: "farm-hero", image: "/Home/rabeya-hero-optimized.jpg", alt: "খামারে সাদা গরু", active: true },
];

export const reviews: Review[] = [
  { id: "arif", quote: "অনলাইনে দেখে যেমন মনে হয়েছিল, সামনে গিয়ে তার চেয়েও সুন্দর ও সুস্থ গরু পেয়েছি।", name: "মোঃ আরিফ হাসান", location: "ঢাকা", image: "/Home/Homepage/2.jpg", active: true },
  { id: "saiful", quote: "খামারের পরিবেশ, খাবার আর যত্ন—সবকিছুই স্বচ্ছ। পুরো প্রক্রিয়াটি ছিল নিশ্চিন্ত।", name: "মোঃ সাইফুল ইসলাম", location: "ময়মনসিংহ", image: "/Home/rabeya-cattle-optimized.jpg", active: true },
  { id: "rakibul", quote: "সময়মতো ডেলিভারি এবং দারুণ ব্যবহার। আগামী বছরও Rabeya Farm-ই প্রথম পছন্দ।", name: "মোঃ রাকিবুল হাসান", location: "গাজীপুর", image: "/Home/Homepage/1.jpg", active: true },
];

export const isLocalImage = (src: string) => src.startsWith("data:");
