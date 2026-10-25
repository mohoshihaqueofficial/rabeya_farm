import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { revalidatePath } from "next/cache";
import type { Cow, CowAvailability } from "@/data/cattle";
import { dataDir, readJsonList, withFileLock, writeJsonList } from "./json-store";

// Customer orders submitted from /korbani-goru/[id]/partial-payment and /full-payment.
// Fields mirror the payment form exactly; amount is always computed on the server.

export type OrderStatus = "pending" | "verified" | "rejected" | "delivered" | "cancelled";
export type PaymentType = "partial" | "full";

export type OrderEvent = { at: string; status: OrderStatus; by: string; note?: string };
export type Order = {
  id: string;
  cowId: string;
  cowName: string;
  paymentType: PaymentType;
  amount: number;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryPhone: string;
  bank: string;
  transactionId: string;
  receipt: string | null; // file name under .data/receipts (private, served to admins only)
  status: OrderStatus;
  adminNote: string;
  createdAt: string;
  updatedAt: string;
  history: OrderEvent[];
};

export const ordersFile = "orders.json";
export const partialBookingAmount = 20000;
export const paymentBanks = ["সোনালী ব্যাংক", "ডাচ্-বাংলা ব্যাংক", "ইসলামী ব্যাংক", "ব্র্যাক ব্যাংক", "অন্যান্য"] as const;
export const orderStatusLabels: Record<OrderStatus, string> = { pending: "যাচাই বাকি", verified: "পেমেন্ট নিশ্চিত", rejected: "বাতিল (পেমেন্ট ভুল)", delivered: "ডেলিভারি সম্পন্ন", cancelled: "বাতিল" };
export const paymentTypeLabels: Record<PaymentType, string> = { partial: "আংশিক বুকিং", full: "পূর্ণ পেমেন্ট" };

// Allowed admin status changes.
export const orderTransitions: Record<OrderStatus, OrderStatus[]> = {
  pending: ["verified", "rejected", "cancelled"],
  verified: ["delivered", "cancelled"],
  rejected: ["pending"],
  delivered: ["verified"], // undo a delivery marked by mistake
  cancelled: ["pending"],
};
const openStatuses: OrderStatus[] = ["pending", "verified"];

export const listOrders = () => readJsonList<Order>(ordersFile);

export async function getOrder(id: string) {
  return (await listOrders()).find(order => order.id === id) ?? null;
}

// Order ID = <cow ID without dash>-<YYMMDD>-<P|F><nn>, e.g. "RB101-261025-P01".
// nn counts that cow's orders on that day; it is generated inside the orders lock and checked
// against existing IDs, so it is always unique.
export const orderIdPattern = /^RB\d+-\d{6}-[PF]\d{2,}$/;

export function newOrderId(type: PaymentType, cowId: string, existing: Order[], at = new Date()) {
  const date = `${String(at.getFullYear()).slice(2)}${String(at.getMonth() + 1).padStart(2, "0")}${String(at.getDate()).padStart(2, "0")}`;
  const prefix = `${cowId.replace(/-/g, "")}-${date}-${type === "full" ? "F" : "P"}`;
  const taken = new Set(existing.map(order => order.id));
  let sequence = existing.filter(order => order.id.startsWith(`${cowId.replace(/-/g, "")}-${date}-`)).length + 1;
  while (taken.has(`${prefix}${String(sequence).padStart(2, "0")}`)) sequence++;
  return `${prefix}${String(sequence).padStart(2, "0")}`;
}

/** Run a read-modify-write on the orders list under a lock. */
export function updateOrders<T>(task: (orders: Order[]) => Promise<{ orders: Order[]; result: T }>) {
  return withFileLock(ordersFile, async () => {
    const { orders, result } = await task(await listOrders());
    await writeJsonList(ordersFile, orders);
    return result;
  });
}

export const isOpenOrder = (order: Order) => openStatuses.includes(order.status);

/** Public availability of a cow, taking customer orders into account. */
export function availabilityWithOrders(cow: Cow, orders: Order[]): CowAvailability {
  if (cow.availability === "sold") return "sold";
  const mine = orders.filter(order => order.cowId === cow.id);
  if (mine.some(order => order.status === "delivered" || (order.status === "verified" && order.paymentType === "full"))) return "sold";
  if (mine.some(isOpenOrder)) return "partial-booked";
  return cow.availability;
}

export async function liveAvailability(cow: Cow) {
  return availabilityWithOrders(cow, await listOrders());
}

// ---- Receipts (private files) ----
export const receiptDir = path.join(dataDir, "receipts");
const receiptTypes = { jpg: [0xff, 0xd8, 0xff], png: [0x89, 0x50, 0x4e, 0x47] } as const;

/** Detects the real image type from the file's first bytes (not the name or browser-sent type). */
export function detectImageType(bytes: Uint8Array): "jpg" | "png" | "webp" | null {
  for (const [ext, signature] of Object.entries(receiptTypes)) if (signature.every((byte, i) => bytes[i] === byte)) return ext as "jpg" | "png";
  const ascii = (from: number, to: number) => String.fromCharCode(...bytes.slice(from, to));
  if (ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP") return "webp";
  return null;
}

export async function saveReceipt(orderId: string, bytes: Uint8Array, ext: string) {
  await mkdir(receiptDir, { recursive: true });
  const name = `${orderId}.${ext}`;
  await writeFile(path.join(receiptDir, name), bytes, { mode: 0o600 });
  return name;
}

export async function readReceipt(name: string) {
  if (!/^RB\d+-\d{6}-[PF]\d{2,}\.(jpg|png|webp)$/.test(name)) return null; // no path tricks
  try { return await readFile(path.join(receiptDir, name)); } catch { return null; }
}

/** Refresh the static cow pages after an order changes the cow's availability. */
export function revalidateCowPages(cowId: string) {
  for (const route of [`/korbani-goru/${cowId}`, `/korbani-goru/${cowId}/partial-payment`, `/korbani-goru/${cowId}/full-payment`, "/korbani-goru", "/"]) revalidatePath(route);
}
