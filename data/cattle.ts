export type CowColor = "brown" | "white" | "black" | "mixed";
export type CowAvailability = "available" | "partial-booked" | "sold";
// Every field here is shown on the public cow page; the admin form edits exactly these.
export type Cow = { id: string; name: string; weight: number; price: number; color: CowColor; availability: CowAvailability; image: string; position: string; age: string; gender: string; health: string; vaccine: string; origin: string; feed: string; gallery: string[]; videoUrl?: string; draft?: boolean; featured?: boolean };
// Demo video shown on every cow page until real per-cow videos are added from the admin panel.
const demoVideoUrl = "https://www.youtube.com/watch?v=l4Ec_U1jy-Y";
export const cowDefaults = { gallery: ["/Home/Homepage/2.jpg", "/Home/Homepage/1.jpg"] as string[], age: "নিশ্চিত করা হবে", gender: "নিশ্চিত করা হবে", health: "তথ্য চাইতে পারেন", vaccine: "যাচাই করা হবে", origin: "নিজস্ব খামার", feed: "ঘাস ও সুষম খাবার" };
export const colorLabels: Record<CowColor, string> = { brown: "বাদামি", white: "সাদা", black: "কালো", mixed: "মিশ্র" };
export const availabilityLabels: Record<CowAvailability, string> = { available: "বিক্রয়ের জন্য প্রস্তুত", "partial-booked": "আংশিক বুকড", sold: "সোল্ড আউট" };
// Every cow, including drafts — admin only.
export const allCattle: Cow[] = ([
  { id: "RB-101", name: "শাহিওয়াল গরু", weight: 425, price: 245000, color: "brown", availability: "available", image: "/Home/rabeya-cattle-optimized.jpg", position: "8% center" },
  { id: "RB-102", name: "দেশি গরু", weight: 330, price: 190000, color: "white", availability: "available", image: "/Home/rabeya-hero-optimized.jpg", position: "80% center" },
  { id: "RB-103", featured: true, name: "শাহিওয়াল গরু", weight: 510, price: 285000, color: "brown", availability: "partial-booked", image: "/Home/rabeya-cattle-optimized.jpg", position: "8% center" },
  { id: "RB-104", featured: true, name: "দেশি ক্রস গরু", weight: 470, price: 220000, color: "mixed", availability: "available", image: "/Home/Homepage/2.jpg", position: "65% 85%" },
  { id: "RB-105", name: "দেশি গরু", weight: 300, price: 140000, color: "white", availability: "available", image: "/Home/rabeya-hero-optimized.jpg", position: "80% center" },
  { id: "RB-106", draft: true, name: "শাহিওয়াল গরু", weight: 480, price: 250000, color: "brown", availability: "available", image: "/Home/rabeya-cattle-optimized.jpg", position: "8% center" },
  { id: "RB-107", name: "দেশি ক্রস গরু", weight: 520, price: 240000, color: "black", availability: "sold", image: "/Home/rabeya-cattle-optimized.jpg", position: "50% center" },
  { id: "RB-108", name: "দেশি গরু", weight: 280, price: 125000, color: "white", availability: "available", image: "/Home/rabeya-hero-optimized.jpg", position: "80% center" },
  { id: "RB-109", name: "কালো দেশি গরু", weight: 250, price: 110000, color: "black", availability: "sold", image: "/Home/rabeya-cattle-optimized.jpg", position: "50% center" },
  { id: "RB-110", featured: true, name: "দেশি লাল গরু", weight: 210, price: 95000, color: "brown", availability: "available", image: "/Home/rabeya-cattle-optimized.jpg", position: "8% center" },
  { id: "RB-111", featured: true, name: "সাদা ব্রাহমা", weight: 620, price: 310000, color: "white", availability: "partial-booked", image: "/Home/rabeya-hero-optimized.jpg", position: "80% center" },
  { id: "RB-112", draft: true, name: "দেশি ক্রস গরু", weight: 390, price: 175000, color: "mixed", availability: "available", image: "/Home/Homepage/2.jpg", position: "65% 85%" },
] as Omit<Cow, keyof typeof cowDefaults>[]).map(cow => ({ ...cowDefaults, videoUrl: demoVideoUrl, ...cow }));
// Public site: drafts stay hidden until the admin publishes them.
export const catalogue = allCattle.filter(cow => !cow.draft);
// Homepage "আমাদের সংগ্রহ" section: published cows marked featured in the admin panel.
export const maxFeaturedCattle = 4;
export const featuredCattle = catalogue.filter(cow => cow.featured).slice(0, maxFeaturedCattle);
// Accepts youtube.com/watch?v=, youtu.be/, /shorts/, /embed/ links; returns the 11-char video id.
export function youtubeId(url = "") {
  const match = url.trim().match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/|live\/))([\w-]{11})/);
  return match?.[1] ?? null;
}
export const bnNumber = (value: number) => new Intl.NumberFormat("bn-BD").format(value);

export type CattleFilters = { search: string; minPrice: number; maxPrice: number; minWeight: number; maxWeight: number; colors: CowColor[] };
export function filterCattle(filters: CattleFilters, sort: string) {
  const query = filters.search.trim().toLocaleLowerCase();
  return catalogue.filter(cow => `${cow.id} ${cow.name}`.toLocaleLowerCase().includes(query)
    && cow.price >= filters.minPrice && cow.price <= filters.maxPrice
    && cow.weight >= filters.minWeight && cow.weight <= filters.maxWeight
    && (!filters.colors.length || filters.colors.includes(cow.color)))
    .sort((a, b) => {
      const availabilityOrder = Number(a.availability !== "available") - Number(b.availability !== "available");
      if (availabilityOrder) return availabilityOrder;
      return sort === "price-low" ? a.price - b.price : sort === "price-high" ? b.price - a.price : sort === "weight" ? b.weight - a.weight : a.id.localeCompare(b.id);
    });
}
