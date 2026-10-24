import { allCattle, availabilityLabels, colorLabels, type Cow, type CowAvailability, type CowColor } from "./cattle";

// Admin edits exactly the public Cow fields; views/inquiries/addedAt are read-only stats.
export type AdminCow = Cow & { views: number; inquiries: number; addedAt: string };

export const adminCattle: AdminCow[] = allCattle.map((cow, index) => ({
  ...cow,
  views: 184 + index * 37,
  inquiries: 4 + (index % 7),
  addedAt: `২০২৬-০${7 + (index % 3)}-${String(8 + index).padStart(2, "0")}`,
}));

export function nextCowId() {
  const max = Math.max(...adminCattle.map(cow => Number(cow.id.replace(/\D/g, "")) || 0));
  return `RB-${max + 1}`;
}

// A blank form: nothing pre-filled except the id. color/availability start empty and must be chosen.
export function newAdminCow(id = nextCowId()): AdminCow {
  return { id, name: "", weight: 0, price: 0, color: "" as CowColor, availability: "" as CowAvailability, image: "", position: "center", age: "", gender: "", health: "", vaccine: "", origin: "", feed: "", gallery: [], videoUrl: "", draft: true, views: 0, inquiries: 0, addedAt: "" };
}

export const cowStatusLabels = availabilityLabels;

// Admin list/dashboard status: a draft overrides the sale status.
export type AdminStatus = Cow["availability"] | "draft";
export const adminStatus = (cow: Cow): AdminStatus => cow.draft ? "draft" : cow.availability;
export const adminStatusLabels: Record<AdminStatus, string> = { ...availabilityLabels, draft: "ড্রাফট" };
export { colorLabels };

export const adminCowStorageKey = (id: string) => `rabeya-admin-cow:${id}`;
export const adminCattleChangeEvent = "rabeya-admin-cattle-change";

export function saveAdminCow(cow: AdminCow) {
  window.localStorage.setItem(adminCowStorageKey(cow.id), JSON.stringify(cow));
  window.dispatchEvent(new Event(adminCattleChangeEvent));
}

const storagePrefix = adminCowStorageKey("");

// Built-in cattle merged with every cow saved from the admin editor (edits + newly added ones).
export function loadAdminCattle(): AdminCow[] {
  const saved = new Map<string, AdminCow>();
  let keys: string[] = [];
  try { keys = Object.keys(window.localStorage); } catch { return adminCattle; }
  // One bad/old record must not hide the rest, so each key is parsed on its own.
  for (const key of keys) {
    if (!key.startsWith(storagePrefix) || key === adminCowStorageKey("new")) continue;
    try {
      const cow = JSON.parse(window.localStorage.getItem(key) ?? "") as AdminCow;
      if (cow && typeof cow.id === "string" && key === adminCowStorageKey(cow.id)) saved.set(cow.id, cow);
    } catch {}
  }
  const merged = adminCattle.map(cow => saved.has(cow.id) ? { ...cow, ...saved.get(cow.id) } : cow);
  const added = [...saved.values()].filter(cow => !adminCattle.some(base => base.id === cow.id));
  return [...merged, ...added.map(cow => ({ ...newAdminCow(), ...cow }))];
}

export function nextSavedCowId() {
  const max = Math.max(...loadAdminCattle().map(cow => Number(cow.id.replace(/\D/g, "")) || 0));
  return `RB-${max + 1}`;
}
