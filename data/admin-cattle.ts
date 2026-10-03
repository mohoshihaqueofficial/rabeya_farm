import { catalogue, colorLabels, type CowColor } from "./cattle";

export type CowStatus = "available" | "reserved" | "sold" | "draft";

export type AdminCow = {
  id: string;
  name: string;
  breed: string;
  weight: number;
  price: number;
  purchasePrice: number;
  color: CowColor;
  status: CowStatus;
  age: string;
  gender: string;
  origin: string;
  shed: string;
  feed: string;
  health: string;
  vaccine: string;
  lastCheckup: string;
  note: string;
  image: string;
  position: string;
  views: number;
  inquiries: number;
  addedAt: string;
};

const statuses: CowStatus[] = ["available", "available", "reserved", "sold", "available", "draft"];

export const adminCattle: AdminCow[] = catalogue.map((cow, index) => ({
  ...cow,
  breed: cow.name.includes("শাহিওয়াল") ? "শাহিওয়াল" : cow.name.includes("ব্রাহমা") ? "ব্রাহমা ক্রস" : "দেশি ক্রস",
  purchasePrice: Math.round(cow.price * 0.71 / 1000) * 1000,
  status: cow.availability === "sold" ? "sold" : cow.availability === "partial-booked" ? "reserved" : statuses[index % statuses.length],
  age: `${2 + (index % 3)} বছর ${index % 2 ? "৬ মাস" : ""}`.trim(),
  gender: "ষাঁড়",
  origin: index % 2 ? "কুষ্টিয়া" : "নিজস্ব খামার",
  shed: `শেড ${String.fromCharCode(65 + (index % 3))} · ${String(index + 1).padStart(2, "0")}`,
  feed: "সবুজ ঘাস, খড় ও সুষম দানাদার খাবার",
  health: "সুস্থ ও সক্রিয়",
  vaccine: index % 4 === 3 ? "পরবর্তী ডোজ বাকি" : "সম্পূর্ণ",
  lastCheckup: `২০২৬-০৯-${String(12 + (index % 14)).padStart(2, "0")}`,
  note: "নিয়মিত স্বাস্থ্য পরীক্ষা করা হয়। ক্রেতার অনুরোধে লাইভ ভিডিও এবং হালনাগাদ ওজন দেওয়া যাবে।",
  views: 184 + index * 37,
  inquiries: 4 + (index % 7),
  addedAt: `২০২৬-০${7 + (index % 3)}-${String(8 + index).padStart(2, "0")}`,
}));

export const cowStatusLabels: Record<CowStatus, string> = {
  available: "বিক্রয়ের জন্য প্রস্তুত",
  reserved: "রিজার্ভড",
  sold: "বিক্রি হয়েছে",
  draft: "ড্রাফট",
};

export { colorLabels };

export const adminCowStorageKey = (id: string) => `rabeya-admin-cow:${id}`;

