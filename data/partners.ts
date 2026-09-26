export type Partner = {
  id: string;
  name: string;
  logo: string;
  website?: string;
  active: boolean;
  sortOrder: number;
};

// Demo records. The admin/API layer can replace this data source later without
// changing the homepage partner-section markup.
export const partners: Partner[] = [
  { id: "green-feed", name: "Green Feed Ltd.", logo: "/partners/green-feed.svg", active: true, sortOrder: 1 },
  { id: "vetcare", name: "VetCare Bangladesh", logo: "/partners/vetcare.svg", active: true, sortOrder: 2 },
  { id: "safe-move", name: "SafeMove Logistics", logo: "/partners/safe-move.svg", active: true, sortOrder: 3 },
  { id: "agro-trust", name: "Agro Trust", logo: "/partners/agro-trust.svg", active: true, sortOrder: 4 },
  { id: "farm-tech", name: "FarmTech", logo: "/partners/farm-tech.svg", active: true, sortOrder: 5 },
];

export const activePartners = partners
  .filter(partner => partner.active)
  .sort((a, b) => a.sortOrder - b.sortOrder);
