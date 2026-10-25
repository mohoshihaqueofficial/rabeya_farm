"use server";

import { headers } from "next/headers";
import { after } from "next/server";
import { catalogue } from "@/data/cattle";
import { availabilityWithOrders, detectImageType, isOpenOrder, newOrderId, partialBookingAmount, paymentBanks, revalidateCowPages, saveReceipt, updateOrders, type Order, type PaymentType } from "@/lib/orders";

export type OrderResult = { ok: true; orderId: string } | { ok: false; message: string; field?: string };

const phonePattern = /^01[3-9]\d{8}$/;
const maxReceiptBytes = 5 * 1024 * 1024;
// Bangla digits → English, so "০১৭১২৩৪৫৬৭৮" is accepted.
const toEnglishDigits = (value: string) => value.replace(/[০-৯]/g, digit => String("০১২৩৪৫৬৭৮৯".indexOf(digit)));

// Per-IP limit against spam: 10 orders per hour.
const recent = new Map<string, number[]>();
function rateLimited(ip: string) {
  const now = Date.now(), windowMs = 60 * 60 * 1000;
  const hits = (recent.get(ip) ?? []).filter(time => now - time < windowMs);
  recent.set(ip, [...hits, now]);
  return hits.length >= 10;
}

const fail = (message: string, field?: string): OrderResult => ({ ok: false, message, field });

export async function submitOrder(formData: FormData): Promise<OrderResult> {
  try {
    const requestHeaders = await headers();
    const ip = requestHeaders.get("x-forwarded-for")?.split(",")[0].trim() || requestHeaders.get("x-real-ip") || "local";
    if (rateLimited(ip)) return fail("অনেকবার অর্ডার করার চেষ্টা হয়েছে। কিছুক্ষণ পর আবার চেষ্টা করুন বা ফোন করুন।");

    const text = (name: string, max = 300) => String(formData.get(name) ?? "").trim().slice(0, max);
    const cowId = text("cowId", 20);
    const paymentType = text("paymentType", 10) as PaymentType;
    const customerName = text("customerName", 100);
    const customerAddress = text("customerAddress");
    const customerPhone = toEnglishDigits(text("customerPhone", 20)).replace(/[\s-]/g, "");
    const deliveryAddress = text("deliveryAddress");
    const deliveryPhone = toEnglishDigits(text("deliveryPhone", 20)).replace(/[\s-]/g, "");
    const bank = text("bank", 50);
    const transactionId = text("transactionId", 40);

    // Everything is validated here; the browser checks are only for convenience.
    const cow = catalogue.find(item => item.id === cowId); // drafts are not in `catalogue`
    if (!cow || (paymentType !== "partial" && paymentType !== "full")) return fail("অর্ডারের তথ্য সঠিক নয়। পেজটি আবার লোড করুন।");
    if (!customerName) return fail("গ্রাহকের নাম লিখুন।", "customerName");
    if (!customerAddress) return fail("গ্রাহকের ঠিকানা লিখুন।", "customerAddress");
    if (!phonePattern.test(customerPhone)) return fail("সঠিক মোবাইল নম্বর দিন (01XXXXXXXXX)।", "customerPhone");
    if (!deliveryAddress) return fail("ডেলিভারি ঠিকানা লিখুন।", "deliveryAddress");
    if (!phonePattern.test(deliveryPhone)) return fail("ডেলিভারির সঠিক মোবাইল নম্বর দিন (01XXXXXXXXX)।", "deliveryPhone");
    if (!(paymentBanks as readonly string[]).includes(bank)) return fail("ব্যাংক নির্বাচন করুন।", "bank");
    if (!/^[A-Za-z0-9\-/]{4,40}$/.test(transactionId)) return fail("সঠিক ট্রানজেকশন আইডি দিন (ইংরেজি অক্ষর ও সংখ্যা)।", "transactionId");
    if (formData.get("consent") !== "on") return fail("তথ্য সঠিক হওয়ার নিশ্চয়তা দিন।", "consent");

    const file = formData.get("receipt");
    let receiptBytes: Uint8Array | null = null, receiptExt: string | null = null;
    if (file instanceof File && file.size > 0) {
      if (file.size > maxReceiptBytes) return fail("ফাইলের সাইজ ৫ MB-এর কম হতে হবে।", "receipt");
      receiptBytes = new Uint8Array(await file.arrayBuffer());
      receiptExt = detectImageType(receiptBytes);
      if (!receiptExt) return fail("শুধু JPG, PNG বা WebP ছবি আপলোড করুন।", "receipt");
    } else if (paymentType === "partial") return fail("পেমেন্টের রসিদ বা স্ক্রিনশট আপলোড করুন।", "receipt");

    const amount = paymentType === "full" ? cow.price : partialBookingAmount; // never trust the form's amount

    const result = await updateOrders<OrderResult>(async orders => {
      if (availabilityWithOrders(cow, orders) !== "available") return { orders, result: fail("দুঃখিত, এই গরুটি ইতোমধ্যে বুক হয়ে গেছে। অন্য একটি গরু বেছে নিন।") };
      if (orders.some(order => isOpenOrder(order) && order.bank === bank && order.transactionId.toLowerCase() === transactionId.toLowerCase()))
        return { orders, result: fail("এই ট্রানজেকশন আইডি দিয়ে আগেই একটি অর্ডার জমা হয়েছে।", "transactionId") };
      const id = newOrderId(paymentType, cow.id, orders);
      const receipt = receiptBytes && receiptExt ? await saveReceipt(id, receiptBytes, receiptExt) : null;
      const now = new Date().toISOString();
      const order: Order = { id, cowId: cow.id, cowName: cow.name, paymentType, amount, customerName, customerAddress, customerPhone, deliveryAddress, deliveryPhone, bank, transactionId, receipt, status: "pending", adminNote: "", createdAt: now, updatedAt: now, history: [{ at: now, status: "pending", by: "customer" }] };
      return { orders: [...orders, order], result: { ok: true, orderId: id } };
    });

    // Refresh the static cow pages after the response is sent: revalidating the page the customer is on
    // inside the action re-renders it mid-request and the browser never received the Order ID.
    if (result.ok) after(() => revalidateCowPages(cow.id));
    return result;
  } catch {
    return fail("অর্ডার জমা দেওয়া যায়নি। আবার চেষ্টা করুন অথবা ফোন করুন ০১৭১২–৩৪৫৬৭৮।");
  }
}
