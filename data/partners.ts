// Only what the homepage MoU section shows (name + signing photo), plus publish controls.
export type Partner = {
  id: string;
  name: string;
  agreementPhoto: string;
  active: boolean;
  sortOrder: number;
};

export const partnerStorageKey = "rabeya-farm:mou-partners";

// Demo records. Replace these details with official MoU signing records.
export const partners: Partner[] = [
  { id: "sukher-khamar", name: "সুখের খামার", agreementPhoto: "/partners/mou-sukher-khamar.jpg", active: true, sortOrder: 1 },
  { id: "vetcare", name: "VetCare Bangladesh", agreementPhoto: "/Home/Homepage/2.jpg", active: true, sortOrder: 2 },
  { id: "safe-move", name: "SafeMove Logistics", agreementPhoto: "/Home/rabeya-home-delivery-optimized.jpg", active: true, sortOrder: 3 },
];

export const activePartners = partners
  .filter(partner => partner.active)
  .sort((a, b) => a.sortOrder - b.sortOrder);
