"use server";

import { after } from "next/server";
import { requireAdminAction } from "@/lib/admin-auth";
import { orderStatusLabels, orderTransitions, revalidateCowPages, updateOrders, type OrderStatus } from "@/lib/orders";

export type OrderActionResult = { ok: boolean; message: string };

async function admin() {
  try { return await requireAdminAction(); } catch { return null; }
}

/** Move an order to a new status (only allowed transitions), with an optional note kept in the history. */
export async function changeOrderStatus(id: string, status: OrderStatus, note: string): Promise<OrderActionResult> {
  const me = await admin();
  if (!me) return { ok: false, message: "এই কাজের অনুমতি নেই। আবার লগইন করুন।" };
  const cleanNote = note.trim().slice(0, 500);
  if ((status === "rejected" || status === "cancelled") && !cleanNote) return { ok: false, message: "বাতিলের কারণ নোটে লিখুন।" };

  const result = await updateOrders<OrderActionResult & { cowId?: string }>(async orders => {
    const order = orders.find(item => item.id === id);
    if (!order) return { orders, result: { ok: false, message: "অর্ডার পাওয়া যায়নি।" } };
    if (!orderTransitions[order.status].includes(status)) return { orders, result: { ok: false, message: `"${orderStatusLabels[order.status]}" থেকে "${orderStatusLabels[status]}" করা যায় না।` } };
    // Re-opening is only allowed when no other open order holds the same cow.
    if (status === "pending" && orders.some(item => item.id !== id && item.cowId === order.cowId && (item.status === "pending" || item.status === "verified" || item.status === "delivered")))
      return { orders, result: { ok: false, message: "এই গরুর জন্য আরেকটি সক্রিয় অর্ডার আছে, তাই আবার চালু করা যাবে না।" } };
    const now = new Date().toISOString();
    const updated = orders.map(item => item.id === id ? { ...item, status, updatedAt: now, history: [...item.history, { at: now, status, by: me.username, ...(cleanNote ? { note: cleanNote } : {}) }] } : item);
    return { orders: updated, result: { ok: true, message: `অর্ডারটি এখন "${orderStatusLabels[status]}"।`, cowId: order.cowId } };
  });

  // Admin pages are dynamic and refreshed by the client (router.refresh); public cow pages are refreshed after the response.
  const cowId = result.cowId;
  if (result.ok && cowId) after(() => revalidateCowPages(cowId));
  return { ok: result.ok, message: result.message };
}

/** Internal note for the team (not shown to the customer). */
export async function saveOrderNote(id: string, note: string): Promise<OrderActionResult> {
  if (!(await admin())) return { ok: false, message: "এই কাজের অনুমতি নেই। আবার লগইন করুন।" };
  const result = await updateOrders<OrderActionResult>(async orders => {
    if (!orders.some(item => item.id === id)) return { orders, result: { ok: false, message: "অর্ডার পাওয়া যায়নি।" } };
    return { orders: orders.map(item => item.id === id ? { ...item, adminNote: note.trim().slice(0, 1000), updatedAt: new Date().toISOString() } : item), result: { ok: true, message: "নোট সংরক্ষিত হয়েছে।" } };
  });
  return result;
}
