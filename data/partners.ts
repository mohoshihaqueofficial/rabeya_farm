export type Partner = {
  id: string;
  name: string;
  logo: string;
  agreementPhoto: string;
  scope: string;
  signedAt: string;
  website?: string;
  active: boolean;
  sortOrder: number;
};

export const partnerStorageKey = "rabeya-farm:mou-partners";

// Demo records. Replace these details with official MoU signing records.
export const partners: Partner[] = [
  { id: "sukher-khamar", name: "সুখের খামার", logo: "/partners/agro-trust.svg", agreementPhoto: "/partners/mou-sukher-khamar.jpg", scope: "আধুনিক ও টেকসই প্রাণিসম্পদ ব্যবস্থাপনায় যৌথ উদ্যোগ", signedAt: "তারিখ হালনাগাদ করুন", active: true, sortOrder: 1 },
  { id: "vetcare", name: "VetCare Bangladesh", logo: "/partners/vetcare.svg", agreementPhoto: "/Home/Homepage/2.jpg", scope: "নিয়মিত স্বাস্থ্য পরীক্ষা ও ভেটেরিনারি সেবা", signedAt: "২৫ জুলাই ২০২৬", active: true, sortOrder: 2 },
  { id: "safe-move", name: "SafeMove Logistics", logo: "/partners/safe-move.svg", agreementPhoto: "/Home/rabeya-home-delivery-optimized.jpg", scope: "সারাদেশে নিরাপদ পরিবহন ও হোম ডেলিভারি", signedAt: "০৮ জুন ২০২৬", active: true, sortOrder: 3 },
];

export const activePartners = partners
  .filter(partner => partner.active)
  .sort((a, b) => a.sortOrder - b.sortOrder);
