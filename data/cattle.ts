export type CowColor = "brown" | "white" | "black" | "mixed";
export type Cow = { id: string; name: string; weight: number; price: number; color: CowColor; image: string; position: string };
export const colorLabels: Record<CowColor, string> = { brown: "বাদামি", white: "সাদা", black: "কালো", mixed: "মিশ্র" };
export const catalogue: Cow[] = [
  { id: "RB-101", name: "শাহিওয়াল গরু", weight: 425, price: 245000, color: "brown", image: "/Home/rabeya-cattle.png", position: "8% center" },
  { id: "RB-102", name: "দেশি গরু", weight: 330, price: 190000, color: "white", image: "/Home/rabeya-hero.png", position: "80% center" },
  { id: "RB-103", name: "শাহিওয়াল গরু", weight: 510, price: 285000, color: "brown", image: "/Home/rabeya-cattle.png", position: "8% center" },
  { id: "RB-104", name: "দেশি ক্রস গরু", weight: 470, price: 220000, color: "mixed", image: "/Home/Homepage/2.jpg", position: "65% 85%" },
  { id: "RB-105", name: "দেশি গরু", weight: 300, price: 140000, color: "white", image: "/Home/rabeya-hero.png", position: "80% center" },
  { id: "RB-106", name: "শাহিওয়াল গরু", weight: 480, price: 250000, color: "brown", image: "/Home/rabeya-cattle.png", position: "8% center" },
  { id: "RB-107", name: "দেশি ক্রস গরু", weight: 520, price: 240000, color: "black", image: "/Home/rabeya-cattle.png", position: "50% center" },
  { id: "RB-108", name: "দেশি গরু", weight: 280, price: 125000, color: "white", image: "/Home/rabeya-hero.png", position: "80% center" },
  { id: "RB-109", name: "কালো দেশি গরু", weight: 250, price: 110000, color: "black", image: "/Home/rabeya-cattle.png", position: "50% center" },
  { id: "RB-110", name: "দেশি লাল গরু", weight: 210, price: 95000, color: "brown", image: "/Home/rabeya-cattle.png", position: "8% center" },
  { id: "RB-111", name: "সাদা ব্রাহমা", weight: 620, price: 310000, color: "white", image: "/Home/rabeya-hero.png", position: "80% center" },
  { id: "RB-112", name: "দেশি ক্রস গরু", weight: 390, price: 175000, color: "mixed", image: "/Home/Homepage/2.jpg", position: "65% 85%" },
];
export const bnNumber = (value: number) => new Intl.NumberFormat("bn-BD").format(value);

export type CattleFilters = { search: string; minPrice: number; maxPrice: number; minWeight: number; maxWeight: number; colors: CowColor[] };
export function filterCattle(filters: CattleFilters, sort: string) {
  const query = filters.search.trim().toLocaleLowerCase();
  return catalogue.filter(cow => `${cow.id} ${cow.name}`.toLocaleLowerCase().includes(query)
    && cow.price >= filters.minPrice && cow.price <= filters.maxPrice
    && cow.weight >= filters.minWeight && cow.weight <= filters.maxWeight
    && (!filters.colors.length || filters.colors.includes(cow.color)))
    .sort((a, b) => sort === "price-low" ? a.price - b.price : sort === "price-high" ? b.price - a.price : sort === "weight" ? b.weight - a.weight : a.id.localeCompare(b.id));
}
