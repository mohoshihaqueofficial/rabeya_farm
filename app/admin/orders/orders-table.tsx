"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { bnNumber } from "@/data/cattle";
import type { Order, OrderStatus } from "@/lib/orders";
import { Icon } from "../components/icons";
import AdminToast from "../components/admin-toast";
import { useToast } from "../components/use-admin-blogs";
import { changeOrderStatus } from "./actions";

// Labels duplicated from lib/orders (that module is server-only: it uses the file system).
export const statusLabels: Record<OrderStatus, string> = { pending: "যাচাই বাকি", verified: "পেমেন্ট নিশ্চিত", rejected: "বাতিল (পেমেন্ট ভুল)", delivered: "ডেলিভারি সম্পন্ন", cancelled: "বাতিল" };
export const typeLabels = { partial: "আংশিক বুকিং", full: "পূর্ণ পেমেন্ট" } as const;
export const formatDate = (iso: string) => new Intl.DateTimeFormat("bn-BD", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(iso));

type Filter = "all" | "pending" | "verified" | "delivered" | "closed";
const filters: [Filter, string][] = [["all", "সব"], ["pending", "যাচাই বাকি"], ["verified", "পেমেন্ট নিশ্চিত"], ["delivered", "ডেলিভারি সম্পন্ন"], ["closed", "বাতিল"]];
const matches = (order: Order, filter: Filter) => filter === "all" || (filter === "closed" ? order.status === "rejected" || order.status === "cancelled" : order.status === filter);

export default function OrdersTable({ orders: serverOrders }: { orders: Order[] }) {
  // Status changes made here show immediately; the server copy arrives with router.refresh().
  const [statusOverrides, setStatusOverrides] = useState<Record<string, OrderStatus>>({});
  const orders = useMemo(() => serverOrders.map(order => statusOverrides[order.id] ? { ...order, status: statusOverrides[order.id] } : order), [serverOrders, statusOverrides]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const router = useRouter();
  const { toast, notify, close } = useToast();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  // Delivery switch: only a payment-confirmed order can be marked delivered; switching off undoes it.
  function setDelivered(order: Order, delivered: boolean) {
    setBusyId(order.id);
    startTransition(async () => {
      try {
        const result = await changeOrderStatus(order.id, delivered ? "delivered" : "verified", delivered ? "" : "ডেলিভারি ভুলবশত চিহ্নিত হয়েছিল — বাতিল করা হলো");
        notify(result.ok ? (delivered ? `${order.id} — ডেলিভারি সম্পন্ন` : `${order.id} — ডেলিভারি বাতিল, আবার "পেমেন্ট নিশ্চিত"`) : result.message, result.ok ? "success" : "error");
        if (result.ok) { setStatusOverrides(current => ({ ...current, [order.id]: delivered ? "delivered" : "verified" })); router.refresh(); }
      } catch { notify("কিছু একটা ভুল হয়েছে, আবার চেষ্টা করুন।", "error"); }
      setBusyId(null);
    });
  }
  const rows = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    return orders.filter(order => matches(order, filter) && `${order.id} ${order.customerName} ${order.customerPhone} ${order.cowId} ${order.transactionId}`.toLocaleLowerCase().includes(needle));
  }, [orders, query, filter]);

  return <section className="admin-card cattle-manager">
    <div className="manager-toolbar"><label><Icon name="search"/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Order ID, নাম, মোবাইল, গরু বা ট্রানজেকশন আইডি"/></label>
      <label className="status-filter"><span>অবস্থা</span><select value={filter} onChange={e => setFilter(e.target.value as Filter)} aria-label="অবস্থা অনুযায়ী ফিল্টার">{filters.map(([value, label]) => <option key={value} value={value}>{label} ({bnNumber(orders.filter(order => matches(order, value)).length)})</option>)}</select></label></div>
    <div className="admin-table-wrap"><table><thead><tr><th>Order ID</th><th>তারিখ</th><th>ক্রেতা</th><th>গরু</th><th>ধরন</th><th>টাকা</th><th>অবস্থা</th><th>ডেলিভারি</th><th/></tr></thead><tbody>{rows.map(order => <tr key={order.id}>
      <td><Link href={`/admin/orders/${order.id}`} className="order-id-link">{order.id}</Link></td>
      <td><small className="table-subtext">{formatDate(order.createdAt)}</small></td>
      <td><b>{order.customerName}</b><small className="table-subtext">{order.customerPhone}</small></td>
      <td><b>{order.cowId}</b><small className="table-subtext">{order.cowName}</small></td>
      <td>{typeLabels[order.paymentType]}</td>
      <td><b>৳ {bnNumber(order.amount)}</b></td>
      <td><span className={`status-pill order-${order.status}`}><i/>{statusLabels[order.status]}</span></td>
      <td>{(() => { const can = order.status === "verified" || order.status === "delivered"; const on = order.status === "delivered"; return <label className={`row-toggle ${can ? "" : "is-disabled"}`} title={can ? (on ? "ডেলিভারি বাতিল করতে বন্ধ করুন" : "ডেলিভারি সম্পন্ন হলে চালু করুন") : "পেমেন্ট নিশ্চিত হওয়ার পর ডেলিভারি দেওয়া যাবে"}><input type="checkbox" checked={on} disabled={!can || busyId === order.id} onChange={e => setDelivered(order, e.target.checked)} aria-label={`${order.id} ডেলিভারি`}/><span/><b>{busyId === order.id ? "…" : on ? "দেওয়া হয়েছে" : can ? "বাকি" : "—"}</b></label>; })()}</td>
      <td><Link className="table-action" href={`/admin/orders/${order.id}`} aria-label={`${order.id} বিস্তারিত`}><Icon name="arrow" size={16}/></Link></td>
    </tr>)}</tbody></table>
      {rows.length === 0 && <div className="empty-state"><Icon name="cart" size={28}/><b>{orders.length ? "কোনো অর্ডার পাওয়া যায়নি" : "এখনো কোনো অর্ডার আসেনি"}</b><p>{orders.length ? "অন্য শব্দ বা filter দিয়ে চেষ্টা করুন।" : "ক্রেতা পেমেন্ট ফর্ম জমা দিলে অর্ডার এখানে দেখা যাবে।"}</p></div>}
    </div>
    <AdminToast toast={toast} onClose={close}/>
  </section>;
}
